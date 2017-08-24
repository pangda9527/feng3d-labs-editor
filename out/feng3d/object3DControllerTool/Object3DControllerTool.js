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
        var Object3DControllerTool = (function (_super) {
            __extends(Object3DControllerTool, _super);
            function Object3DControllerTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                gameObject.serializable = false;
                _this.object3DControllerTarget = editor.Object3DControllerTarget.instance;
                _this.object3DMoveTool = feng3d.GameObject.create("object3DMoveTool").addComponent(editor.Object3DMoveTool);
                _this.object3DRotationTool = feng3d.GameObject.create("object3DRotationTool").addComponent(editor.Object3DRotationTool);
                _this.object3DScaleTool = feng3d.GameObject.create("object3DScaleTool").addComponent(editor.Object3DScaleTool);
                _this.object3DMoveTool.object3DControllerTarget = _this.object3DControllerTarget;
                _this.object3DRotationTool.object3DControllerTarget = _this.object3DControllerTarget;
                _this.object3DScaleTool.object3DControllerTarget = _this.object3DControllerTarget;
                //
                _this.currentTool = _this.object3DMoveTool;
                eui.Watcher.watch(editor.editor3DData, ["object3DOperationID"], _this.onObject3DOperationIDChange, _this);
                feng3d.shortcut.on("object3DMoveTool", _this.onObject3DMoveTool, _this);
                feng3d.shortcut.on("object3DRotationTool", _this.onObject3DRotationTool, _this);
                feng3d.shortcut.on("object3DScaleTool", _this.onObject3DScaleTool, _this);
                eui.Watcher.watch(editor.editor3DData, ["selectedObject"], _this.onSelectedObject3DChange, _this);
                return _this;
            }
            Object3DControllerTool.prototype.onSelectedObject3DChange = function () {
                if (editor.editor3DData.selectedObject) {
                    this.object3DControllerTarget.controllerTargets = [editor.editor3DData.selectedObject.transform];
                    editor.editor3DData.scene3D.gameObject.addChild(this.gameObject);
                }
                else {
                    this.object3DControllerTarget.controllerTargets = null;
                    editor.editor3DData.scene3D.gameObject.removeChild(this.gameObject);
                }
            };
            Object3DControllerTool.prototype.onObject3DOperationIDChange = function () {
                switch (editor.editor3DData.object3DOperationID) {
                    case 0:
                        this.currentTool = this.object3DMoveTool;
                        break;
                    case 1:
                        this.currentTool = this.object3DRotationTool;
                        break;
                    case 2:
                        this.currentTool = this.object3DScaleTool;
                        break;
                }
            };
            Object3DControllerTool.prototype.onObject3DMoveTool = function () {
                editor.editor3DData.object3DOperationID = 0;
            };
            Object3DControllerTool.prototype.onObject3DRotationTool = function () {
                editor.editor3DData.object3DOperationID = 1;
            };
            Object3DControllerTool.prototype.onObject3DScaleTool = function () {
                editor.editor3DData.object3DOperationID = 2;
            };
            Object.defineProperty(Object3DControllerTool.prototype, "currentTool", {
                set: function (value) {
                    if (this._currentTool == value)
                        return;
                    if (this._currentTool) {
                        this.gameObject.removeChild(this._currentTool.gameObject);
                    }
                    this._currentTool = value;
                    if (this._currentTool) {
                        this.gameObject.addChild(this._currentTool.gameObject);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return Object3DControllerTool;
        }(feng3d.Component));
        editor.Object3DControllerTool = Object3DControllerTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DControllerTool.js.map