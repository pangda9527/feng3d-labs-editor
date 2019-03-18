var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./MRSToolBase", "./models/SToolModel", "../Main3D", "./MRSToolTarget"], function (require, exports, MRSToolBase_1, SToolModel_1, Main3D_1, MRSToolTarget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // namespace feng3d { export interface ComponentMap { STool: editor.STool } }
    var STool = /** @class */ (function (_super) {
        __extends(STool, _super);
        function STool() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 用于判断是否改变了XYZ
             */
            _this.changeXYZ = new feng3d.Vector3();
            return _this;
        }
        STool.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.toolModel = new feng3d.GameObject().addComponent(SToolModel_1.SToolModel);
        };
        STool.prototype.onAddedToScene = function () {
            _super.prototype.onAddedToScene.call(this);
            this.toolModel.xCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
        };
        STool.prototype.onRemovedFromScene = function () {
            _super.prototype.onRemovedFromScene.call(this);
            this.toolModel.xCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
        };
        STool.prototype.onItemMouseDown = function (event) {
            if (!feng3d.shortcut.getState("mouseInView3D"))
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            _super.prototype.onItemMouseDown.call(this, event);
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix3D.transformVector(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix3D.transformVector(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = Main3D_1.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new feng3d.Plane3D();
            switch (event.currentTarget) {
                case this.toolModel.xCube:
                    this.selectedItem = this.toolModel.xCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.init(1, 0, 0);
                    break;
                case this.toolModel.yCube:
                    this.selectedItem = this.toolModel.yCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.init(0, 1, 0);
                    break;
                case this.toolModel.zCube:
                    this.selectedItem = this.toolModel.zCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.init(0, 0, 1);
                    break;
                case this.toolModel.oCube:
                    this.selectedItem = this.toolModel.oCube;
                    this.startMousePos = Main3D_1.engine.mousePos.clone();
                    this.changeXYZ.init(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            MRSToolTarget_1.mrsToolTarget.startScale();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        };
        STool.prototype.onMouseMove = function () {
            var addPos = new feng3d.Vector3();
            var addScale = new feng3d.Vector3();
            if (this.selectedItem == this.toolModel.oCube) {
                var currentMouse = Main3D_1.engine.mousePos;
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.init(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / (Main3D_1.engine.viewRect.height);
                addScale.init(scale, scale, scale);
            }
            else {
                var crossPos = this.getLocalMousePlaneCross();
                var offset = crossPos.subTo(this.startPlanePos);
                if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0) {
                    addScale.x = offset.x / this.startPlanePos.x;
                }
                if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0) {
                    addScale.y = offset.y / this.startPlanePos.y;
                }
                if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0) {
                    addScale.z = offset.z / this.startPlanePos.z;
                }
                addScale.x += 1;
                addScale.y += 1;
                addScale.z += 1;
            }
            MRSToolTarget_1.mrsToolTarget.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        };
        STool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            MRSToolTarget_1.mrsToolTarget.stopScale();
            this.startPlanePos = null;
            this.startSceneTransform = null;
            //
            this.toolModel.xCube.scaleValue = 1;
            this.toolModel.yCube.scaleValue = 1;
            this.toolModel.zCube.scaleValue = 1;
        };
        return STool;
    }(MRSToolBase_1.MRSToolBase));
    exports.STool = STool;
});
//# sourceMappingURL=STool.js.map