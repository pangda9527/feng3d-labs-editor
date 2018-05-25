namespace editor
{
    export class MenuItemRenderer extends eui.ItemRenderer
    {
        data: MenuItem;
        menuUI: MenuUI;

        public selectedRect: eui.Rect;

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
            this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);

            this.menuUI = <any>this.parent;

            this.updateView();
        }

        private onRemovedFromStage()
        {
            this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
            this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);

            this.menuUI = null;
        }

        private updateView()
        {
            if (!this.data)
                return;
            if (this.data.type == 'separator')
            {
                this.skin.currentState = "separator";
            }
            else if (this.data.submenu)
            {
                this.skin.currentState = "sub";
            }
            else
            {
                this.skin.currentState = "normal";
            }
            this.selectedRect.visible = false;
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
                var rect = this.getTransformedBounds(this.stage);
                if (rect.right + 300 > this.stage.stageWidth)
                    rect.x -= rect.width + 150;
                this.menuUI.subMenuUI = MenuUI.create(this.data.submenu, rect.right, rect.top);
                this.menuUI.subMenuUI.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            } else
            {
                this.menuUI.subMenuUI = null;
            }
            this.selectedRect.visible = true;
        }

        private onItemMouseOut()
        {
            if (!this.menuUI.subMenuUI)
                this.selectedRect.visible = false;
        }

        private onsubMenuUIRemovedFromeStage(e: egret.Event)
        {
            var current = e.currentTarget;
            current.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            this.selectedRect.visible = false;
        }
    }
}