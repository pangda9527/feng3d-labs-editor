namespace editor
{
    export class AssetsView extends eui.Component implements eui.UIComponent
    {
        public assetsTreeScroller: eui.Scroller;
        public assetsTreeList: eui.List;

        public floderpathTxt: eui.Label;
        public includeTxt: eui.TextInput;
        public excludeTxt: eui.TextInput;
        public filelistgroup: eui.Group;
        public floderScroller: eui.Scroller;
        public filelist: eui.List;
        public filepathLabel: eui.Label;
        //
        private _assetstreeInvalid = true;
        private listData: eui.ArrayCollection;
        private filelistData: eui.ArrayCollection;

        private fileDrag: FileDrag;

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "AssetsView";
            editorui.assetsview = this;

            this.fileDrag = new FileDrag(this);
        }

        private onComplete(): void
        {
            this.assetsTreeList.itemRenderer = AssetsTreeItemRenderer;
            this.filelist.itemRenderer = AssetsFileItemRenderer;

            this.floderScroller.viewport = this.filelist;
            this.assetsTreeScroller.viewport = this.assetsTreeList;

            this.listData = this.assetsTreeList.dataProvider = new eui.ArrayCollection();
            this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.excludeTxt.text = "";
            this.filepathLabel.text = "";

            //
            drag.register(this.filelistgroup, (dragsource) => { }, ["gameobject"], (dragSource) =>
            {
                if (dragSource.gameobject)
                {
                    var gameobject = feng3d.serialization.clone(dragSource.gameobject);
                    editorAssets.saveObject(gameobject);
                }
            });

            this.initlist();

            //
            this.fileDrag.addEventListener();

            this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);

            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);

            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();

            this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);

            this.filelist.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);

            this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);

            feng3d.watcher.unwatch(editorAssets, "showFloder", this.updateShowFloder, this);

            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);

            //
            drag.unregister(this.filelistgroup);

            this.fileDrag.removeEventListener();
        }

        private initlist()
        {
            editorAssets.initproject(() =>
            {
                this.invalidateAssetstree();

                editorAssets.rootFile.on("openChanged", this.invalidateAssetstree, this);
                editorAssets.rootFile.on("added", this.invalidateAssetstree, this);
                editorAssets.rootFile.on("removed", this.invalidateAssetstree, this);

                feng3d.watcher.watch(editorAssets, "showFloder", this.updateShowFloder, this);
            });
        }

        private update()
        {
            if (this._assetstreeInvalid)
            {
                this.updateAssetsTree();
                this.updateShowFloder();
                this._assetstreeInvalid = false;
            }
        }

        invalidateAssetstree()
        {
            this._assetstreeInvalid = true;
            feng3d.ticker.nextframe(this.update, this);
        }

        private updateAssetsTree()
        {
            var folders = editorAssets.rootFile.getFolderList();
            this.listData.replaceAll(folders);
        }

        private updateShowFloder(host?: any, property?: string, oldvalue?: any)
        {
            var floder = editorAssets.showFloder;
            if (!floder) return;

            var textFlow = new Array<egret.ITextElement>();
            do
            {
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floder.label, style: { "href": `event:${floder.id}` } });
                floder = floder.parent;
            }
            while (floder)
            this.floderpathTxt.textFlow = textFlow;

            var children = editorAssets.showFloder.children;

            try
            {
                var excludeReg = new RegExp(this.excludeTxt.text);
            } catch (error)
            {
                excludeReg = new RegExp("");
            }
            try
            {
                var includeReg = new RegExp(this.includeTxt.text);
            } catch (error)
            {
                includeReg = new RegExp("");
            }

            var fileinfos = children.filter((value) =>
            {
                if (this.includeTxt.text)
                {
                    if (!includeReg.test(value.label))
                        return false;
                }
                if (this.excludeTxt.text)
                {
                    if (excludeReg.test(value.label))
                        return false;
                }
                return true;
            });
            var nodes = fileinfos.map((value) => { return value; });
            nodes = nodes.sort((a, b) =>
            {
                if (a.isDirectory > b.isDirectory)
                    return -1;
                if (a.isDirectory < b.isDirectory)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 1;
            });

            this.filelistData.replaceAll(nodes);
            this.filelist.scrollV = 0;
            this.selectedfilechanged();
        }

        private onfilter()
        {
            this.updateShowFloder();
        }

        private selectedfilechanged()
        {
            var selectedAssetsFile = editorData.selectedAssetsFile;
            if (selectedAssetsFile.length > 0)
                this.filepathLabel.text = selectedAssetsFile.map(v =>
                {
                    return v.feng3dAssets.name + v.feng3dAssets.extenson;
                }).join(",");
            else
                this.filepathLabel.text = "";
        }

        private onfilelistclick(e: egret.MouseEvent)
        {
            if (e.target == this.filelist)
            {
                editorData.clearSelectedObjects()
            }
        }

        private onfilelistrightclick(e: egret.MouseEvent)
        {
            editorData.clearSelectedObjects();

            editorAssets.popupmenu(editorAssets.showFloder);
        }

        private onfloderpathTxtLink(evt: egret.TextEvent)
        {
            editorAssets.showFloder = editorAssets.getAssetsByID(evt.text);
        }

        private areaSelectStartPosition: feng3d.Vector2;
        private onMouseDown(e: egret.MouseEvent)
        {
            if (e.target != this.filelist) return;

            this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        }

        private onMouseMove()
        {
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var p = this.filelist.localToGlobal(0, 0);
            var rectangle = new feng3d.Rectangle(p.x, p.y, this.filelist.width, this.filelist.height);
            //
            areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
            //
            areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
            //
            var min = this.areaSelectStartPosition.clone().min(areaSelectEndPosition);
            var max = this.areaSelectStartPosition.clone().max(areaSelectEndPosition);
            var areaRect = new feng3d.Rectangle(min.x, min.y, max.x - min.x, max.y - min.y);
            //
            var datas = this.filelist.$indexToRenderer.filter(v =>
            {
                var p = v.localToGlobal(0, 0);
                var rectangle = new feng3d.Rectangle(p.x, p.y, v.width, v.height);
                return areaRect.intersects(rectangle);
            }).map(v => v.data);
            editorData.selectMultiObject(datas);
        }

        private onMouseUp()
        {
            areaSelectRect.hide();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        }
    }

    class FileDrag
    {
        addEventListener: () => void
        removeEventListener: () => void;

        constructor(displayobject: egret.DisplayObject)
        {
            this.addEventListener = () =>
            {
                document.addEventListener("dragenter", dragenter, false);
                document.addEventListener("dragover", dragover, false);
                document.addEventListener("drop", drop, false);
            }

            this.removeEventListener = () =>
            {
                document.removeEventListener("dragenter", dragenter, false);
                document.removeEventListener("dragover", dragover, false);
                document.removeEventListener("drop", drop, false);
            }

            function dragenter(e)
            {
                e.stopPropagation();
                e.preventDefault();
            }
            function dragover(e)
            {
                e.stopPropagation();
                e.preventDefault();
            }
            function drop(e: DragEvent)
            {
                e.stopPropagation();
                e.preventDefault();
                var dt = e.dataTransfer;
                var fileList = dt.files;
                var files = [];
                for (let i = 0; i < fileList.length; i++)
                {
                    files[i] = fileList[i];
                }
                if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY))
                {
                    editorAssets.inputFiles(files);
                }
            }
        }
    }
}