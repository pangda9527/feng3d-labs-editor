namespace editor
{
    /**
     * 给显示对象注册禁止 Scroll 滚动功能
     * 
     * 当鼠标在指定对象上按下时禁止滚动，鼠标弹起后取消禁止滚动
     */
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