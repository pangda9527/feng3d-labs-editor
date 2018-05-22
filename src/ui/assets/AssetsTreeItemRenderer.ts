namespace feng3d.editor
{
    export class AssetsTreeItemRenderer extends TreeItemRenderer
    {
        public contentGroup: eui.Group;
        public disclosureButton: eui.ToggleButton;
        public renameInput: RenameTextInput;

        data: AssetsTreeNode;

        constructor()
        {
            super();
            this.skinName = "AssetsTreeItemRenderer";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            this.renameInput.addEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            this.renameInput.removeEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        dataChanged()
        {
            super.dataChanged();

            

            if (this.data)
            {
                this.renameInput.text = this.data.label;

                var accepttypes = [];
                drag.register(this, (dragsource) =>
                {
                    dragsource.file = this.data.path;
                }, ["file"], (dragdata) =>
                    {
                        var movefile = editorAssets.getFile(dragdata.file);
                        movefile.move(this.data.path);
                    });
            } else
            {
                drag.unregister(this);
            }
        }
        private onclick()
        {
            editorAssets.showFloder = this.data.path;
        }

        private onrightclick(e)
        {
            editorAssets.popupmenu(this.data.assetsFile);
        }

        private onnameLabelclick()
        {
            if (this.data.parent == null)
                return;

            if (this.data.selected && !windowEventProxy.rightmouse)
            {
                this.renameInput.edit(() =>
                {
                    var newName = this.data.assetsFile.name.replace(this.data.label, this.renameInput.text);
                    this.data.assetsFile.rename(newName);
                });
            }
        }
    }
}