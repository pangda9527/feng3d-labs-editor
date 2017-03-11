module feng3d.editor
{
    export type MouseEvent = egret.TouchEvent;
    export var MouseEvent: {
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
    MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
    MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
    MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
    MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
    MouseEvent.MOUSE_OUT = "mouseout";
    MouseEvent.MOUSE_OVER = "mouseover";
    //

    //解决TextInput.text绑定Number是不显示0的bug
    var p = egret.DisplayObject.prototype;
    var old = p.dispatchEvent;
    p.dispatchEvent = function (event: egret.Event): boolean
    {

        if (event.type == MouseEvent.MOUSE_OVER)
        {
            //鼠标已经在对象上时停止over冒泡
            if (this.isMouseOver)
            {
                event.stopPropagation();
                return true;
            }
            this.isMouseOver = true;
        }
        if (event.type == MouseEvent.MOUSE_OUT)
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
}