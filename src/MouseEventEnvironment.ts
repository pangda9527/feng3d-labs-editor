module feng3d.editor
{
    export type MouseEventE = egret.TouchEvent;
    export var MouseEventE: {
        prototype: TouchEvent;
        new (): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: string;
        /** 鼠标弹起 */
        MOUSE_UP: string;
        /** 鼠标移动 */
        MOUSE_MOVE: string;
        /** 鼠标单击 */
        CLICK: string;
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
    } = <any>egret.TouchEvent;

    //映射事件名称
    MouseEventE.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
    MouseEventE.MOUSE_UP = egret.TouchEvent.TOUCH_END;
    MouseEventE.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
    MouseEventE.CLICK = egret.TouchEvent.TOUCH_TAP;
    MouseEventE.MOUSE_OUT = "mouseout";
    MouseEventE.MOUSE_OVER = "mouseover";
    //

    //解决TextInput.text绑定Number是不显示0的bug
    var p = egret.DisplayObject.prototype;
    var old = p.dispatchEvent;
    p.dispatchEvent = function (event: egret.Event): boolean
    {

        if (event.type == MouseEventE.MOUSE_OVER)
        {
            //鼠标已经在对象上时停止over冒泡
            if (this.isMouseOver)
            {
                event.stopPropagation();
                return true;
            }
            this.isMouseOver = true;
        }
        if (event.type == MouseEventE.MOUSE_OUT)
        {
            //如果再次mouseover的对象是该对象的子对象时停止out事件冒泡
            var overDisplayObject = mouseEventEnvironment.overDisplayObject;
            while (overDisplayObject)
            {
                if (this == overDisplayObject)
                {
                    event.stopPropagation();
                    return true;
                }
                overDisplayObject = overDisplayObject.parent;
            }
            this.isMouseOver = false;
        }
        return old.call(this, event);
    };

    export var mouseEventEnvironment: MouseEventEnvironment;

    export class MouseEventEnvironment
    {
        private webTouchHandler: { canvas: HTMLCanvasElement, touch: egret.sys.TouchHandler, getLocation(event: any): Point }
        private canvas: HTMLCanvasElement;
        private touch: egret.sys.TouchHandler;

        public overDisplayObject: egret.DisplayObject;

        constructor()
        {

            this.webTouchHandler = this.getWebTouchHandler();
            this.canvas = this.webTouchHandler.canvas;
            this.touch = this.webTouchHandler.touch;

            this.webTouchHandler.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        }

        private onMouseMove(event: MouseEvent)
        {
            var location = this.webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;

            var target: egret.DisplayObject = this.touch["findTarget"](x, y);
            if (target == this.overDisplayObject)
                return;
            var preOverDisplayObject = this.overDisplayObject;
            this.overDisplayObject = target;
            if (preOverDisplayObject)
            {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, MouseEventE.MOUSE_OUT, true, true, x, y);
            }
            if (this.overDisplayObject)
            {
                egret.TouchEvent.dispatchTouchEvent(this.overDisplayObject, MouseEventE.MOUSE_OVER, true, true, x, y);
            }
        }

        private getWebTouchHandler()
        {
            var list = document.querySelectorAll(".egret-player");
            var length = list.length;
            var player = null;
            for (var i = 0; i < length; i++)
            {
                var container = <HTMLDivElement>list[i];
                player = container["egret-player"];
                if (player)
                    break;
            }
            return player.webTouchHandler;
        }
    }
}