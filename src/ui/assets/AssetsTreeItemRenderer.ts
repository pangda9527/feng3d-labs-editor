namespace editor
{
    export class AssetsTreeItemRenderer extends TreeItemRenderer
    {
        public contentGroup: eui.Group;
        public disclosureButton: eui.ToggleButton;
        public renameInput: RenameTextInput;

        data: AssetsFile;

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
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
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
                        movefile.moveToDir(this.data.path);
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
            if (this.data.parent != null)
            {
                var othermenus = {
                    rename: {
                        label: "重命名",
                        click: () =>
                        {
                            this.renameInput.edit(() =>
                            {
                                var newName = this.data.name.replace(this.data.label, this.renameInput.text);
                                this.data.rename(newName);
                            });
                        }
                    }
                }
                editorAssets.popupmenu(this.data, othermenus);
            } else
            {
                editorAssets.popupmenu(this.data);
            }
        }
    }
}