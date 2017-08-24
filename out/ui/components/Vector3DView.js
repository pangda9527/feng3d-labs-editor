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
        var Vector3DView = (function (_super) {
            __extends(Vector3DView, _super);
            function Vector3DView() {
                var _this = _super.call(this) || this;
                _this.vm = new feng3d.Vector3D(1, 2, 3);
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Vector3DViewSkin";
                return _this;
            }
            Vector3DView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Vector3DView.prototype.onAddedToStage = function () {
                this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            Vector3DView.prototype.onRemovedFromStage = function () {
                this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            Vector3DView.prototype.onTextChange = function (event) {
                switch (event.currentTarget) {
                    case this.xTextInput:
                        this.vm.x = Number(this.xTextInput.text);
                        break;
                    case this.yTextInput:
                        this.vm.y = Number(this.yTextInput.text);
                        break;
                    case this.zTextInput:
                        this.vm.z = Number(this.zTextInput.text);
                        break;
                }
            };
            return Vector3DView;
        }(eui.Component));
        editor.Vector3DView = Vector3DView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Vector3DView.js.map