namespace egret
{
    // 扩展鼠标事件，增加鼠标 按下、弹起、移动、点击、移入、移出、右击、双击事件
    export type MouseEvent = egret.TouchEvent;
    export var MouseEvent: {
        prototype: TouchEvent;
        new(): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: "mousedown";
        MOUSE_MIDDLE_DOWN: "mousemiddledown";
        /** 鼠标弹起 */
        MOUSE_UP: "mouseup";
        MIDDLE_MOUSE_UP: "middlemouseup";
        RIGHT_MOUSE_UP: "rightmouseup";
        /** 鼠标移动 */
        MOUSE_MOVE: "mousemove";
        /** 鼠标单击 */
        CLICK: "click";
        MIDDLE_Click: "middleclick";
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
        /** 右键按下 */
        RIGHT_MOUSE_DOWN: "rightmousedown";
        /** 右键点击 */
        RIGHT_CLICK: "rightclick";
        /** 双击 */
        DOUBLE_CLICK: "dblclick";
    } = <any>egret.TouchEvent;
    (() =>
    {
        //映射事件名称
        MouseEvent.MOUSE_DOWN = "mousedown";
        MouseEvent.MOUSE_MIDDLE_DOWN = "mousemiddledown";
        MouseEvent.MOUSE_UP = "mouseup";
        MouseEvent.MIDDLE_MOUSE_UP = "middlemouseup";
        MouseEvent.RIGHT_MOUSE_UP = "rightmouseup";
        MouseEvent.MOUSE_MOVE = "mousemove";
        MouseEvent.CLICK = "click";
        MouseEvent.MIDDLE_Click = "middleclick";
        MouseEvent.MOUSE_OUT = "mouseout";
        MouseEvent.RIGHT_MOUSE_DOWN = "rightmousedown";
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

        // 鼠标按下时选中对象
        var mousedownObject: egret.DisplayObject;
        // /**
        //  * 鼠标按下的按钮编号
        //  */
        // var mousedownButton: number;
        webTouchHandler = getWebTouchHandler();
        canvas = webTouchHandler.canvas;
        touch = webTouchHandler.touch;

        webTouchHandler.canvas.addEventListener("mousemove", onMouseMove);

        feng3d.windowEventProxy.on("mousedown", (e) =>
        {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;

            var target = touch["findTarget"](x, y);

            // mousedownButton = e.button;
            mousedownObject = target;

            if (e.button == 0)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.MOUSE_DOWN, true, true, x, y);
            } else if (e.button == 1)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.MOUSE_MIDDLE_DOWN, true, true, x, y);
            } else if (e.button == 2)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.RIGHT_MOUSE_DOWN, true, true, x, y);
            }
        });

        feng3d.windowEventProxy.on("mouseup", (e) =>
        {
            //右键按下
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;

            var target: egret.DisplayObject = touch["findTarget"](x, y);

            if (e.button == 0)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.MOUSE_UP, true, true, x, y);
                if (mousedownObject == target)
                {
                    egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.CLICK, true, true, x, y);
                }
            } else if (e.button == 1)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.MIDDLE_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target)
                {
                    egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.MIDDLE_Click, true, true, x, y);
                }
            } else if (e.button == 2)
            {
                egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.RIGHT_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target)
                {
                    egret.TouchEvent.dispatchTouchEvent(target, MouseEvent.RIGHT_CLICK, true, true, x, y);
                }
            }
            mousedownObject = null;
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