var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Feng3dView = (function (_super) {
            __extends(Feng3dView, _super);
            function Feng3dView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Feng3dViewSkin";
                return _this;
            }
            Feng3dView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Feng3dView.prototype.onAddedToStage = function () {
                this.canvas = document.getElementById("glcanvas");
                this.addEventListener(egret.Event.RESIZE, this.onResize, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                this.onResize();
            };
            Feng3dView.prototype.onRemovedFromStage = function () {
                this.canvas = null;
                this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            };
            Feng3dView.prototype.onResize = function () {
                if (!this.stage)
                    return;
                var lt = this.localToGlobal(0, 0);
                var rb = this.localToGlobal(this.width, this.height);
                var bound1 = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
                // var bound2 = this.getTransformedBounds(this.stage);
                var bound = bound1;
                var style = this.canvas.style;
                style.position = "absolute";
                style.left = bound.x + "px";
                style.top = bound.y + "px";
                style.width = bound.width + "px";
                style.height = bound.height + "px";
                if (bound.contains(feng3d.input.clientX, feng3d.input.clientY)) {
                    feng3d.shortcut.activityState("mouseInView3D");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInView3D");
                }
            };
            return Feng3dView;
        }(eui.Component));
        editor.Feng3dView = Feng3dView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Feng3dView.js.map