var egret;
(function (egret) {
    egret.MouseEvent = egret.TouchEvent;
    (function () {
        //映射事件名称
        egret.MouseEvent.MOUSE_DOWN = "mousedown";
        egret.MouseEvent.MIDDLE_MOUSE_DOWN = "middlemousedown";
        egret.MouseEvent.MOUSE_UP = "mouseup";
        egret.MouseEvent.MIDDLE_MOUSE_UP = "middlemouseup";
        egret.MouseEvent.RIGHT_MOUSE_UP = "rightmouseup";
        egret.MouseEvent.MOUSE_MOVE = "mousemove";
        egret.MouseEvent.CLICK = "click";
        egret.MouseEvent.MIDDLE_Click = "middleclick";
        egret.MouseEvent.MOUSE_OUT = "mouseout";
        egret.MouseEvent.RIGHT_MOUSE_DOWN = "rightmousedown";
        egret.MouseEvent.RIGHT_CLICK = "rightclick";
        egret.MouseEvent.DOUBLE_CLICK = "dblclick";
        //
    })();
    var overDisplayObject;
    egret.mouseEventEnvironment = function () {
        var webTouchHandler;
        var canvas;
        var touch;
        // 鼠标按下时选中对象
        var mousedownObject;
        // /**
        //  * 鼠标按下的按钮编号
        //  */
        // var mousedownButton: number;
        webTouchHandler = getWebTouchHandler();
        canvas = webTouchHandler.canvas;
        touch = webTouchHandler.touch;
        webTouchHandler.canvas.addEventListener("mousemove", onMouseMove);
        feng3d.windowEventProxy.on("mousedown", function (e) {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            // mousedownButton = e.button;
            mousedownObject = target;
            if (e.button == 0) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_DOWN, true, true, x, y);
            }
            else if (e.button == 1) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_DOWN, true, true, x, y);
            }
            else if (e.button == 2) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_DOWN, true, true, x, y);
            }
        });
        feng3d.windowEventProxy.on("mouseup", function (e) {
            //右键按下
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            if (e.button == 0) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.CLICK, true, true, x, y);
                }
            }
            else if (e.button == 1) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_Click, true, true, x, y);
                }
            }
            else if (e.button == 2) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_CLICK, true, true, x, y);
                }
            }
            mousedownObject = null;
        });
        feng3d.windowEventProxy.on("dblclick", function (e) {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.DOUBLE_CLICK, true, true, x, y);
        });
        // 调试，查看鼠标下的对象
        feng3d.windowEventProxy.on("keyup", function (e) {
            if (e.key == "p") {
                var location = webTouchHandler.getLocation(e);
                var target = touch["findTarget"](location.x, location.y);
                var arr = [target];
                while (target.parent) {
                    target = target.parent;
                    arr.push(target);
                }
                window["earr"] = arr;
                console.log(arr);
            }
        });
        function onMouseMove(event) {
            var location = webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_MOVE, true, true, x, y);
            if (target == overDisplayObject)
                return;
            var preOverDisplayObject = overDisplayObject;
            overDisplayObject = target;
            if (preOverDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, egret.MouseEvent.MOUSE_OUT, true, true, x, y);
            }
            if (overDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(overDisplayObject, egret.MouseEvent.MOUSE_OVER, true, true, x, y);
            }
        }
        function getWebTouchHandler() {
            var list = document.querySelectorAll(".egret-player");
            var length = list.length;
            var player = null;
            for (var i = 0; i < length; i++) {
                var container = list[i];
                player = container["egret-player"];
                if (player)
                    break;
            }
            return player.webTouchHandler;
        }
    };
})(egret || (egret = {}));
//# sourceMappingURL=MouseEvent.js.map