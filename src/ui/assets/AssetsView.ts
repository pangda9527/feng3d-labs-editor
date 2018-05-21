namespace feng3d.editor
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

            this.excludeTxt.text = "(\\.d\\.ts|\\.js\\.map|\\.js)\\b";
            this.filepathLabel.text = "";

            //
            drag.register(this.filelistgroup, (dragsource) => { }, ["gameobject", "animationclip", "material", "geometry"], (dragSource) =>
            {
                if (dragSource.gameobject)
                {
                    var gameobject: GameObject = dragSource.gameobject;
                    if (gameobject.getComponent(Scene3D) != null)
                        editorAssets.saveObject(gameobject, gameobject.name + "." + AssetExtension.scene);
                    else
                        editorAssets.saveObject(gameobject, gameobject.name + "." + AssetExtension.gameobject);
                }
                if (dragSource.animationclip)
                {
                    var animationclip = dragSource.animationclip;
                    editorAssets.saveObject(animationclip, animationclip.name + "." + AssetExtension.anim);
                }
                if (dragSource.material)
                {
                    var material = dragSource.material;
                    editorAssets.saveObject(material, material.shaderName + "." + AssetExtension.material);
                }
                if (dragSource.geometry)
                {
                    var geometry = dragSource.geometry;
                    editorAssets.saveObject(geometry, geometry.name + "." + AssetExtension.geometry);
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

            watcher.watch(editorData, "selectedObjects", this.selectedfilechanged, this);
            watcher.watchchain(this, "selectfile.name", this.selectfile_nameChanged, this);

            assetsDispather.on("changed", this.invalidateAssetstree, this);
            assetsDispather.on("openChanged", this.invalidateAssetstree, this);
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

            watcher.unwatch(editorData, "selectedObjects", this.selectedfilechanged, this);

            assetsDispather.off("changed", this.invalidateAssetstree, this);
            assetsDispather.off("openChanged", this.invalidateAssetstree, this);

            //
            drag.unregister(this.filelistgroup);

            this.fileDrag.removeEventListener();
        }

        private initlist()
        {
            editorAssets.initproject(() =>
            {
                this.invalidateAssetstree();
            });
        }

        update()
        {
            if (this._assetstreeInvalid)
            {
                this.updateAssetsTree();
                this.updateShowFloder();
                this._assetstreeInvalid = false;
            }
        }

        private invalidateAssetstree()
        {
            this._assetstreeInvalid = true;
            this.once(egret.Event.ENTER_FRAME, this.update, this);
        }

        updateAssetsTree()
        {
            var paths = Object.keys(editorAssets.files).filter((item) => pathUtils.isDirectory(item)).sort();

            var nodes: AssetsFile[] = [];
            var closepath: string;
            for (let i = 0, n = paths.length; i < n; i++)
            {
                const element = paths[i];
                if (closepath)
                {
                    if (element.substr(0, closepath.length) == closepath)
                        continue;
                    closepath = null;
                }
                var assetsFile = editorAssets.getFile(element);
                if (!assetsFile.isOpen)
                    closepath = assetsFile.path;
                nodes.push(assetsFile);
            }
            this.listData.replaceAll(nodes);
        }

        updateShowFloder(host?: any, property?: string, oldvalue?: any)
        {
            if (oldvalue)
            {
                var oldnode = editorAssets.getFile(oldvalue);
                if (oldnode)
                {
                    oldnode.currentOpenDirectory = false;
                }
            }
            if (editorAssets.showFloder)
            {
                var newnode = editorAssets.getFile(editorAssets.showFloder);
                if (newnode)
                {
                    newnode.currentOpenDirectory = true;
                }
            }

            var floders = editorAssets.showFloder.split("/");
            // 除去尾部 ""
            floders.pop();

            var textFlow = new Array<egret.ITextElement>();
            do
            {
                var path = floders.join("/") + "/";
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floders.pop(), style: { "href": `event:${path}` } });
                if (path == editorAssets.assetsPath)
                    break;
            }
            while (floders.length > 0)
            this.floderpathTxt.textFlow = textFlow;

            var children = editorAssets.filter((item) => pathUtils.getParentPath(item.path) == editorAssets.showFloder);


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
                    if (!includeReg.test(value.path))
                        return false;
                }
                if (this.excludeTxt.text)
                {
                    if (excludeReg.test(value.path))
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
                if (a.path < b.path)
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
            var selectedAssetsFile = editorData.selectedAssetsFile;
            var assetsFiles: AssetsFile[] = this.filelistData.source;
            assetsFiles.forEach(element =>
            {
                element.selected = selectedAssetsFile.indexOf(element) != -1;
                if (element.selected)
                    this.selectfile = element;
            });
        }

        private selectfile_nameChanged()
        {
            if (this.selectfile)
                this.filepathLabel.text = this.selectfile.name;
            else
                this.filepathLabel.text = "";
        }

        private onfilelistclick(e: egret.MouseEvent)
        {
            if (e.target == this.filelist)
            {
                editorData.selectObject(null)
            }
        }

        private onfilelistrightclick(e: egret.MouseEvent)
        {
            var assetsFile = editorAssets.getFile(editorAssets.showFloder);
            if (assetsFile)
            {
                editorAssets.popupmenu(assetsFile);
            }
        }

        private onfloderpathTxtLink(evt: egret.TextEvent)
        {
            editorAssets.showFloder = evt.text;
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
                var files = dt.files;
                if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY))
                {
                    editorAssets.inputFiles(files);
                }
            }
        }
    }


}