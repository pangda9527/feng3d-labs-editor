namespace editor
{
    export class AssetsTreeItemRenderer extends TreeItemRenderer
    {
        public contentGroup: eui.Group;
        public disclosureButton: eui.ToggleButton;

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

            feng3d.watcher.watch(editorAssets, "showFloder", this.showFloderChanged, this);
            this.showFloderChanged();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            feng3d.watcher.unwatch(editorAssets, "showFloder", this.showFloderChanged, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                drag.register(this, (dragsource) =>
                {
                    dragsource.assetsFiles = [this.data];
                }, ["assetsFiles"], (dragdata) =>
                    {
                        dragdata.assetsFiles.forEach(v =>
                        {
                            this.data.addChild(v);
                        });
                    });
            } else
            {
                drag.unregister(this);
            }
            this.showFloderChanged();
        }

        private showFloderChanged()
        {
            this.selected = this.data ? editorAssets.showFloder == this.data : false;
        }

        private onclick()
        {
            editorAssets.showFloder = this.data;
        }

        private onrightclick(e)
        {
            if (this.data.parent != null)
            {
                editorAssets.popupmenu(this.data);
            } else
            {
                editorAssets.popupmenu(this.data);
            }
        }
    }
}