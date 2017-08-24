var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MouseEventEnvironment = (function () {
            function MouseEventEnvironment() {
                this.webTouchHandler = this.getWebTouchHandler();
                this.canvas = this.webTouchHandler.canvas;
                this.touch = this.webTouchHandler.touch;
                this.webTouchHandler.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
            }
            MouseEventEnvironment.prototype.onMouseMove = function (event) {
                var location = this.webTouchHandler.getLocation(event);
                var x = location.x;
                var y = location.y;
                var target = this.touch["findTarget"](x, y);
                if (target == this.overDisplayObject)
                    return;
                var preOverDisplayObject = this.overDisplayObject;
                this.overDisplayObject = target;
                if (preOverDisplayObject) {
                    egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, editor.MouseEvent.MOUSE_OUT, true, true, x, y);
                }
                if (this.overDisplayObject) {
                    egret.TouchEvent.dispatchTouchEvent(this.overDisplayObject, editor.MouseEvent.MOUSE_OVER, true, true, x, y);
                }
            };
            MouseEventEnvironment.prototype.getWebTouchHandler = function () {
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
            };
            return MouseEventEnvironment;
        }());
        editor.MouseEventEnvironment = MouseEventEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=MouseEventEnvironment.js.map