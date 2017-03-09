module feng3d.editor
{
    export class TreeItemRenderer extends eui.ItemRenderer
    {
        public contentGroup: eui.Group;
        public disclosureButton: eui.ToggleButton;

        /**
		 * 子节点相对父节点的缩进值，以像素为单位。默认17。
		 */
        public indentation = 17
        public data: { depth: number, isOpen: boolean, hasChildren: boolean };

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "TreeItemRendererSkin";
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onItemMouseDown, this, false, 1000);
        }

        private onComplete(): void
        {
            eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
            eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
            eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
            eui.Watcher.watch(this, ["indentation"], this.updateView, this);
        }

        private updateView()
        {
            this.disclosureButton.visible = this.data ? this.data.hasChildren : false;
            this.contentGroup.x = (this.data ? this.data.depth : 0) * this.indentation;
            this.disclosureButton.selected = this.data ? this.data.isOpen : false;
        }

        private onItemMouseDown(event: egret.TouchEvent): void
        {
            if (event.target == this.disclosureButton)
            {
                event.stopImmediatePropagation();
            }
        }
    }
}