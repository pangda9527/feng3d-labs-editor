namespace feng3d.editor
{
    export class MenuItemRenderer extends eui.ItemRenderer
    {
        data: MenuItem;
        menuUI: MenuUI;

        protected dataChanged()
        {
            super.dataChanged();
            this.updateView();
        }

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "MenuItemRender";
        }

        private onComplete(): void
        {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {
            this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);
            this.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);

            this.menuUI = <any>this.parent;

            this.updateView();
        }

        private onRemovedFromStage()
        {
            this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
            this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);

            this.menuUI = null;
        }

        private updateView()
        {
            if (!this.data)
                return;
            if (this.data.type == 'separator')
            {
                this.skin.currentState = "separator";
            } else
            {
                this.skin.currentState = "normal";
            }
        }

        private onItemMouseDown(event: egret.TouchEvent): void
        {
            this.data.click && this.data.click();
            this.menuUI.topMenu.remove();
        }

        private onItemMouseOver()
        {
            if (this.data.submenu)
            {
                this.menuUI.subMenuUI = MenuUI.create(this.data.submenu);
            } else
            {
                this.menuUI.subMenuUI = null;
            }
        }
    }
}