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

        public hasChildren = false;


        private updateView()
        {
            this.disclosureButton.visible = this.hasChildren;
            this.contentGroup.x = this.depth * this.indentation;
            this.disclosureButton.selected = this.isOpen;
        }

        public depth: number = 0;
        public isOpen: boolean = false;

        constructor()
        {
            super();
            this.skinName = "TreeItemRendererSkin";
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onItemMouseDown, this, false, 1000);
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