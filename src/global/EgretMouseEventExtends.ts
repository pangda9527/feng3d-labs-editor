namespace egret
{
    // 扩展鼠标事件，增加鼠标 按下、弹起、移动、点击、移入、移出、右击、双击事件
    export type MouseEvent = egret.TouchEvent;
    export var MouseEvent: {
        prototype: TouchEvent;
        new(): TouchEvent;
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
        /** 右键点击 */
        RIGHT_CLICK: "rightclick";
        /** 双击 */
        DOUBLE_CLICK: "dblclick";
    } = <any>egret.TouchEvent;
    (() =>
    {
        //映射事件名称
        MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
        MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
        MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
        MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
        MouseEvent.MOUSE_OUT = "mouseout";
        MouseEvent.RIGHT_CLICK = "rightclick";
        MouseEvent.DOUBLE_CLICK = "dblclick";
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
                var displayObject = overDisplayObject;
                while (displayObject)
                {
                    if (this == displayObject)
                    {
                        event.stopPropagation();
                        return true;
                    }
                    displayObject = displayObject.parent;
                }
                this.isMouseOver = false;
            }
            return old.call(this, event);
        };
    })();

    var overDisplayObject: egret.DisplayObject;
    export var mouseEventEnvironment = () =>
    {
        var webTouchHandler: { canvas: HTMLCanvasElement, touch: egret.sys.TouchHandler, getLocation(event: any): egret.Point }
        var canvas: HTMLCanvasElement;
        var touch: egret.sys.TouchHandler;

        var rightmousedownObject: egret.DisplayObject;
        webTouchHandler = getWebTouchHandler();
        canvas = webTouchHandler.canvas;
        touch = webTouchHandler.touch;

        webTouchHandler.canvas.addEventListener("mousemove", onMouseMove);

        feng3d.windowEventProxy.on("mousedown", (e) =>
        {
            //右键按下
            if (e.button != 2) return;
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;

            rightmousedownObject = touch["findTarget"](x, y);
        });
        feng3d.windowEventProxy.on("mouseup", (e) =>
        {
            //右键按下
            if (e.button != 2) return;

            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;

            var target: egret.DisplayObject = touch["findTarget"](x, y);
            if (target == rightmousedownObject)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.RIGHT_CLICK, true, true, x, y);
                rightmousedownObject = null;
            }
        });
        feng3d.windowEventProxy.on("dblclick", (e) =>
        {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;

            var target: egret.DisplayObject = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.DOUBLE_CLICK, true, true, x, y);
        });

        // 调试，查看鼠标下的对象
        feng3d.windowEventProxy.on("keyup", (e) =>
        {
            if (e.key == "p")
            {
                var location = webTouchHandler.getLocation(e);
                var target: egret.DisplayObject = touch["findTarget"](location.x, location.y)
                var arr = [target];
                while (target.parent)
                {
                    target = target.parent;
                    arr.push(target);
                }
                window["earr"] = arr;
                console.log(arr);
            }
        });

        function onMouseMove(event)
        {
            var location = webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;

            var target: egret.DisplayObject = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.MOUSE_MOVE, true, true, x, y);
            if (target == overDisplayObject)
                return;
            var preOverDisplayObject = overDisplayObject;
            overDisplayObject = target;
            if (preOverDisplayObject)
            {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, MouseEvent.MOUSE_OUT, true, true, x, y);
            }
            if (overDisplayObject)
            {
                egret.TouchEvent.dispatchTouchEvent(overDisplayObject, MouseEvent.MOUSE_OVER, true, true, x, y);
            }
        }

        function getWebTouchHandler()
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
    };
}