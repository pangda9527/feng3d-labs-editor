module feng3d.editor
{
    export class AssetsView extends eui.Component implements eui.UIComponent
    {

        public treelist: eui.List;
        public floderpathTxt: eui.Label;
        public includeTxt: eui.TextInput;
        public excludeTxt: eui.TextInput;
        public filelistgroup: eui.Group;
        public filelist: eui.List;
        //
        private _assetstreeInvalid = true;
        private listData: eui.ArrayCollection;
        private filelistData: eui.ArrayCollection;

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "AssetsView";
            editorui.assetsview = this;
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

            this.filelist.addEventListener(MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);

            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);

            feng3d.watcher.watch(assets, "showFloder", this.updateShowFloder, this);
            feng3d.watcher.watch(editor3DData, "selectedObject", this.selectedfilechanged, this);
            assetstree.on("changed", this.invalidateAssetstree, this);
            assetstree.on("openChanged", this.invalidateAssetstree, this);

            this.excludeTxt.text = "(\\.d\\.ts|\\.js\\.map|\\.js)\\b";

            //
            drag.register(this.filelistgroup, (dragsource) => { }, ["gameobject", "animationclip"], (dragSource) =>
            {
                if (dragSource.gameobject)
                {
                    var gameObject: GameObject = dragSource.gameobject;
                    assets.saveGameObject(gameObject);
                }
                if (dragSource.animationclip)
                {
                    var animationclip = dragSource.animationclip;
                    var obj = serialization.serialize(animationclip);
                    assets.saveObject(obj, animationclip.name + ".anim");
                }
            });

            this.initlist();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();

            this.filelist.removeEventListener(MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);

            this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);

            feng3d.watcher.unwatch(assets, "showFloder", this.updateShowFloder, this);
            feng3d.watcher.unwatch(editor3DData, "selectedObject", this.selectedfilechanged, this);
            assetstree.off("changed", this.invalidateAssetstree, this);
            assetstree.off("openChanged", this.invalidateAssetstree, this);

            //
            drag.unregister(this.filelistgroup);
        }

        private initlist()
        {
            assets.initproject(assets.projectPath, () =>
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
            var nodes = assetstree.getShowNodes();
            this.listData.replaceAll(nodes);
        }

        updateShowFloder(host?: any, property?: string, oldvalue?: any)
        {
            if (oldvalue)
            {
                var oldnode = assetstree.getAssetsTreeNode(oldvalue);
                if (oldnode)
                {
                    oldnode.selected = false;
                }
            }
            if (assets.showFloder)
            {
                var newnode = assetstree.getAssetsTreeNode(assets.showFloder);
                if (newnode)
                {
                    newnode.selected = true;
                }
            }

            var floders = assets.showFloder.split("/");

            var textFlow = new Array<egret.ITextElement>();
            do
            {
                var path = floders.join("/");
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floders.pop(), style: { "href": `event:${path}` } });
                if (path == assets.assetsPath)
                    break;
            }
            while (floders.length > 0)
            this.floderpathTxt.textFlow = textFlow;

            var fileinfo = assets.getFileInfo(assets.showFloder);
            if (fileinfo)
            {
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

                var fileinfos = fileinfo.children.filter((value) =>
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
                var nodes = fileinfos.map((value) => { return new AssetsFileNode(value); });
                this.filelistData.replaceAll(nodes);
            }
            this.selectedfilechanged();
        }

        private onfilter()
        {
            this.updateShowFloder();
        }

        private selectedfilechanged()
        {
            this.filelistData.source.forEach(element =>
            {
                element.selected = element.fileinfo == editor3DData.selectedObject;
            });
        }

        private onfilelistrightclick()
        {
            var fileinfo = assets.getFileInfo(assets.showFloder);
            if (fileinfo)
            {
                assets.popupmenu(fileinfo);
            }
        }

        private onfloderpathTxtLink(evt: egret.TextEvent)
        {
            assets.showFloder = evt.text;
        }
    }
}