namespace editor
{
    export class AssetsView extends eui.Component implements eui.UIComponent
    {
        public treelist: eui.List;
        public floderpathTxt: eui.Label;
        public includeTxt: eui.TextInput;
        public excludeTxt: eui.TextInput;
        public filelistgroup: eui.Group;
        public filelist: eui.List;
        public filepathLabel: eui.Label;
        //
        private _assetstreeInvalid = true;
        private listData: eui.ArrayCollection;
        private filelistData: eui.ArrayCollection;

        private fileDrag: FileDrag;
        //
        private selectfile: AssetsFile;

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
            this.treelist.itemRenderer = AssetsTreeItemRenderer;
            this.filelist.itemRenderer = AssetsFileItemRenderer;

            this.listData = this.treelist.dataProvider = new eui.ArrayCollection();
            this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.excludeTxt.text = "";
            this.filepathLabel.text = "";

            //
            drag.register(this.filelistgroup, (dragsource) => { }, ["gameobject", "animationclip", "material", "geometry"], (dragSource) =>
            {
                if (dragSource.gameobject)
                {
                    var gameobject = dragSource.gameobject;
                    editorAssets.saveObject(gameobject);
                }
                if (dragSource.animationclip)
                {
                    var animationclip = dragSource.animationclip;
                    editorAssets.saveObject(animationclip);
                }
                if (dragSource.material)
                {
                    var material = dragSource.material;
                    editorAssets.saveObject(material);
                }
                if (dragSource.geometry)
                {
                    var geometry = dragSource.geometry;
                    editorAssets.saveObject(geometry);
                }
            });

            this.initlist();

            //
            this.fileDrag.addEventListener();

            this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);

            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);

            feng3d.watcher.watch(editorAssets, "showFloder", this.updateShowFloder, this);

            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();

            this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);

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
                textFlow.unshift({ text: floder.name, style: { "href": `event:${floder.id}` } });
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
                    if (!includeReg.test(value.name))
                        return false;
                }
                if (this.excludeTxt.text)
                {
                    if (excludeReg.test(value.name))
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
                if (a.name < b.name)
                    return -1;
                return 1;
            });

            this.filelistData.replaceAll(nodes);

            this.selectedfilechanged();
        }

        private onfilter()
        {
            this.updateShowFloder();
        }

        private selectedfilechanged()
        {
            this.selectfile = null;
            var selectedAssetsFile = editorData.selectedAssetsFile;
            var assetsFiles: AssetsFile[] = this.filelistData.source;
            assetsFiles.forEach(element =>
            {
                if (selectedAssetsFile.indexOf(element) != -1)
                    this.selectfile = element;
            });
            if (this.selectfile)
                this.filepathLabel.text = this.selectfile.name;
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
            editorAssets.popupmenu(editorAssets.showFloder);
        }

        private onfloderpathTxtLink(evt: egret.TextEvent)
        {
            editorAssets.showFloder = editorAssets.files[evt.text];
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