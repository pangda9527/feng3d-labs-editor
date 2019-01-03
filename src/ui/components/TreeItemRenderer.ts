namespace editor
{
    export class TreeItemRenderer extends eui.ItemRenderer
    {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;

        /**
		 * 子结点相对父结点的缩进值，以像素为单位。默认17。
		 */
        indentation = 17
        data: TreeNode;

        private watchers: eui.Watcher[] = [];

        constructor()
        {
            super();
            this.skinName = "TreeItemRendererSkin";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel)

            //
            this.disclosureButton.addEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);

            this.watchers.push(
                eui.Watcher.watch(this, ["data", "depth"], this.updateView, this),
                eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this),
                eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this),
                eui.Watcher.watch(this, ["indentation"], this.updateView, this)
            );

            this.updateView();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();

            while (this.watchers.length > 0)
            {
                this.watchers.pop().unwatch();
            }

            //
            this.disclosureButton.removeEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
        }

        private onDisclosureButtonClick()
        {
            if (this.data)
                this.data.isOpen = !this.data.isOpen;
        }

        private updateView()
        {
            this.disclosureButton.visible = this.data ? (this.data.children && this.data.children.length > 0) : false;
            this.contentGroup.left = (this.data ? this.data.depth : 0) * this.indentation;
            this.disclosureButton.selected = this.data ? this.data.isOpen : false;
        }
    }
}