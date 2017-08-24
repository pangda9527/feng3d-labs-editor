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
        var Object3DControllerToolBase = (function (_super) {
            __extends(Object3DControllerToolBase, _super);
            function Object3DControllerToolBase(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.ismouseDown = false;
                var holdSizeComponent = _this.gameObject.addComponent(feng3d.HoldSizeComponent);
                holdSizeComponent.holdSize = 1;
                holdSizeComponent.camera = editor.editor3DData.camera;
                //
                _this.gameObject.on("addedToScene", _this.onAddedToScene, _this);
                _this.gameObject.on("removedFromScene", _this.onRemovedFromScene, _this);
                return _this;
            }
            Object3DControllerToolBase.prototype.onAddedToScene = function () {
                this.updateToolModel();
                this._object3DControllerTarget.controllerTool = this.transform;
                //
                feng3d.input.on("mousedown", this.onMouseDown, this);
                feng3d.input.on("mouseup", this.onMouseUp, this);
                this.transform.on("scenetransformChanged", this.onScenetransformChanged, this);
                editor.editor3DData.camera.transform.on("scenetransformChanged", this.onCameraScenetransformChanged, this);
            };
            Object3DControllerToolBase.prototype.onRemovedFromScene = function () {
                this._object3DControllerTarget.controllerTool = null;
                //
                feng3d.input.off("mousedown", this.onMouseDown, this);
                feng3d.input.off("mouseup", this.onMouseUp, this);
                this.transform.off("scenetransformChanged", this.onScenetransformChanged, this);
                editor.editor3DData.camera.transform.off("scenetransformChanged", this.onCameraScenetransformChanged, this);
            };
            Object.defineProperty(Object3DControllerToolBase.prototype, "toolModel", {
                get: function () {
                    return this._toolModel;
                },
                set: function (value) {
                    if (this._toolModel)
                        this.gameObject.removeChild(this._toolModel.gameObject);
                    this._toolModel = value;
                    ;
                    if (this._toolModel) {
                        this.gameObject.addChild(this._toolModel.gameObject);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerToolBase.prototype, "selectedItem", {
                get: function () {
                    return this._selectedItem;
                },
                set: function (value) {
                    if (this._selectedItem == value)
                        return;
                    if (this._selectedItem)
                        this._selectedItem.selected = false;
                    this._selectedItem = value;
                    if (this._selectedItem)
                        this._selectedItem.selected = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerToolBase.prototype, "object3DControllerTarget", {
                get: function () {
                    return this._object3DControllerTarget;
                },
                set: function (value) {
                    this._object3DControllerTarget = value;
                },
                enumerable: true,
                configurable: true
            });
            Object3DControllerToolBase.prototype.updateToolModel = function () {
            };
            Object3DControllerToolBase.prototype.onMouseDown = function () {
                this.selectedItem = null;
                this.ismouseDown = true;
            };
            Object3DControllerToolBase.prototype.onMouseUp = function () {
                this.ismouseDown = false;
                this.movePlane3D = null;
                this.startSceneTransform = null;
            };
            Object3DControllerToolBase.prototype.onScenetransformChanged = function () {
                this.updateToolModel();
            };
            Object3DControllerToolBase.prototype.onCameraScenetransformChanged = function () {
                this.updateToolModel();
            };
            /**
             * 获取鼠标射线与移动平面的交点（模型空间）
             */
            Object3DControllerToolBase.prototype.getLocalMousePlaneCross = function () {
                //射线与平面交点
                var crossPos = this.getMousePlaneCross();
                //把交点从世界转换为模型空间
                var inverseGlobalMatrix3D = this.startSceneTransform.clone();
                inverseGlobalMatrix3D.invert();
                crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
                return crossPos;
            };
            Object3DControllerToolBase.prototype.getMousePlaneCross = function () {
                var line3D = editor.editor3DData.camera.getMouseRay3D();
                //射线与平面交点
                var crossPos = this.movePlane3D.lineCross(line3D);
                return crossPos;
            };
            return Object3DControllerToolBase;
        }(feng3d.Component));
        editor.Object3DControllerToolBase = Object3DControllerToolBase;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DControllerToolBase.js.map