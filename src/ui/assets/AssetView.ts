namespace editor
{
    export class AssetView extends eui.Component implements ModuleView
    {
        public assetTreeScroller: eui.Scroller;
        public assetTreeList: eui.List;

        public floderpathTxt: eui.Label;
        public includeTxt: eui.TextInput;
        public excludeTxt: eui.TextInput;
        public filelistgroup: eui.Group;
        public floderScroller: eui.Scroller;
        public filelist: eui.List;
        public filepathLabel: eui.Label;
        //
        private _assettreeInvalid = true;
        private listData: eui.ArrayCollection;
        private filelistData: eui.ArrayCollection;

        private fileDrag: FileDrag;
        private _areaSelectRect: AreaSelectRect;

		/**
		 * 模块名称
		 */
        moduleName: string;

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "AssetView";

            //
            this.moduleName = "Asset";

            editorui.assetview = this;
            //
            this._areaSelectRect = new AreaSelectRect();
            //
            this.fileDrag = new FileDrag(this);
        }

        private onComplete(): void
        {
            this.assetTreeList.itemRenderer = AssetTreeItemRenderer;
            this.filelist.itemRenderer = AssetFileItemRenderer;

            this.floderScroller.viewport = this.filelist;
            this.assetTreeScroller.viewport = this.assetTreeList;

            this.listData = this.assetTreeList.dataProvider = new eui.ArrayCollection();
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
                    editorAsset.saveObject(gameobject);
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

            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
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

            feng3d.watcher.unwatch(editorAsset, "showFloder", this.updateShowFloder, this);

            feng3d.dispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);

            //
            drag.unregister(this.filelistgroup);

            this.fileDrag.removeEventListener();
        }

        private initlist()
        {
            editorAsset.initproject(() =>
            {
                this.invalidateAssettree();

                editorAsset.rootFile.on("openChanged", this.invalidateAssettree, this);
                editorAsset.rootFile.on("added", this.invalidateAssettree, this);
                editorAsset.rootFile.on("removed", this.invalidateAssettree, this);

                feng3d.watcher.watch(editorAsset, "showFloder", this.updateShowFloder, this);
            });
        }

        private update()
        {
            if (this._assettreeInvalid)
            {
                this.updateAssetTree();
                this.updateShowFloder();
                this._assettreeInvalid = false;
            }
        }

        invalidateAssettree()
        {
            this._assettreeInvalid = true;
            feng3d.ticker.nextframe(this.update, this);
        }

        private updateAssetTree()
        {
            var folders = editorAsset.rootFile.getFolderList();
            this.listData.replaceAll(folders);
        }

        private updateShowFloder(host?: any, property?: string, oldvalue?: any)
        {
            var floder = editorAsset.showFloder;
            if (!floder) return;

            var textFlow = new Array<egret.ITextElement>();
            do
            {
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floder.label, style: { "href": `event:${floder.asset.assetId}` } });
                floder = floder.parent;
            }
            while (floder)
            this.floderpathTxt.textFlow = textFlow;

            var children = editorAsset.showFloder.children;

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
            var selectedAssetFile = editorData.selectedAssetNodes;
            if (selectedAssetFile.length > 0)
                this.filepathLabel.text = selectedAssetFile.map(v =>
                {
                    return v.asset.name + v.asset.extenson;
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

            editorAsset.popupmenu(editorAsset.showFloder);
        }

        private onfloderpathTxtLink(evt: egret.TextEvent)
        {
            editorAsset.showFloder = editorAsset.getAssetByID(evt.text);
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
            this._areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
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
            this._areaSelectRect.hide();
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
                    editorAsset.inputFiles(files);
                }
            }
        }
    }
}