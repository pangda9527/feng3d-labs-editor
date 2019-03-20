namespace editor
{
    export class MouseOnDisableScroll
    {
        static register(sprite: egret.DisplayObject)
        {
            if (!sprite) return;
            sprite.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }

        static unRegister(sprite: egret.DisplayObject)
        {
            if (!sprite) return;
            sprite.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }

        private static onMouseDown(e: egret.MouseEvent)
        {
            feng3d.shortcut.activityState("disableScroll");
            //
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        }

        private static onStageMouseUp()
        {
            feng3d.windowEventProxy.off("mouseup", this.onStageMouseUp, this);

            feng3d.shortcut.deactivityState("disableScroll");
        }
    }
}