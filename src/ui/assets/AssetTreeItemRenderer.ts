namespace editor
{
    export class AssetTreeItemRenderer extends TreeItemRenderer
    {
        public contentGroup: eui.Group;
        public disclosureButton: eui.ToggleButton;

        data: AssetNode;

        constructor()
        {
            super();
            this.skinName = "AssetTreeItemRenderer";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            MouseOnDisableScroll.register(this);

            feng3d.watcher.watch(editorAsset, "showFloder", this.showFloderChanged, this);
            this.showFloderChanged();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            MouseOnDisableScroll.unRegister(this);

            feng3d.watcher.unwatch(editorAsset, "showFloder", this.showFloderChanged, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                var folder = <feng3d.FolderAsset>this.data.asset;
                drag.register(this, (dragsource) =>
                {
                    dragsource.assetNodes = [this.data];
                }, ["assetNodes"], (dragdata) =>
                    {
                        dragdata.assetNodes.forEach(v =>
                        {
                            editorRS.moveAsset(v.asset, folder, (err) =>
                            {
                                if (!err)
                                {
                                    this.data.addChild(v);
                                } else
                                {
                                    feng3d.dispatcher.dispatch("message.error", err.message);
                                }
                            });
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
            this.selected = this.data ? editorAsset.showFloder == this.data : false;
        }

        private onclick()
        {
            editorAsset.showFloder = this.data;
        }

        private onrightclick(e)
        {
            if (this.data.parent != null)
            {
                editorAsset.popupmenu(this.data);
            } else
            {
                editorAsset.popupmenu(this.data);
            }
        }
    }
}