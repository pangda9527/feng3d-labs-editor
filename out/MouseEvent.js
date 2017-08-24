var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.MouseEvent = egret.TouchEvent;
        //映射事件名称
        editor.MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
        editor.MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
        editor.MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
        editor.MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
        editor.MouseEvent.MOUSE_OUT = "mouseout";
        editor.MouseEvent.MOUSE_OVER = "mouseover";
        //
        //解决TextInput.text绑定Number是不显示0的bug
        var p = egret.DisplayObject.prototype;
        var old = p.dispatchEvent;
        p.dispatchEvent = function (event) {
            if (event.type == editor.MouseEvent.MOUSE_OVER) {
                //鼠标已经在对象上时停止over冒泡
                if (this.isMouseOver) {
                    event.stopPropagation();
                    return true;
                }
                this.isMouseOver = true;
            }
            if (event.type == editor.MouseEvent.MOUSE_OUT) {
                //如果再次mouseover的对象是该对象的子对象时停止out事件冒泡
                var overDisplayObject = editor.mouseEventEnvironment.overDisplayObject;
                while (overDisplayObject) {
                    if (this == overDisplayObject) {
                        event.stopPropagation();
                        return true;
                    }
                    overDisplayObject = overDisplayObject.parent;
                }
                this.isMouseOver = false;
            }
            return old.call(this, event);
        };
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=MouseEvent.js.map