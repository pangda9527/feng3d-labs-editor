module feng3d.editor
{
    export class MenuItemRenderer extends eui.ItemRenderer
    {
        data: MenuItem;

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
            this.addEventListener(MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false, 1000);

            this.updateView();
        }

        private onRemovedFromStage()
        {
            this.removeEventListener(MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false);
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
        }
    }
}