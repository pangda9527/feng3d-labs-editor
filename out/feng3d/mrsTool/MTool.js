"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var MRSToolBase_1 = require("./MRSToolBase");
var MToolModel_1 = require("./models/MToolModel");
var Main3D_1 = require("../Main3D");
var MRSToolTarget_1 = require("./MRSToolTarget");
// namespace feng3d { export interface ComponentMap { MTool: editor.MTool } }
/**
 * 位移工具
 */
var MTool = /** @class */ (function (_super) {
    __extends(MTool, _super);
    function MTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 用于判断是否改变了XYZ
         */
        _this.changeXYZ = new feng3d.Vector3();
        return _this;
    }
    MTool.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        this.toolModel = new feng3d.GameObject().addComponent(MToolModel_1.MToolModel);
    };
    MTool.prototype.onAddedToScene = function () {
        _super.prototype.onAddedToScene.call(this);
        this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.yzPlane.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.xzPlane.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.xyPlane.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
    };
    MTool.prototype.onRemovedFromScene = function () {
        _super.prototype.onRemovedFromScene.call(this);
        this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.yzPlane.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.xzPlane.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.xyPlane.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
    };
    MTool.prototype.onItemMouseDown = function (event) {
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
        //
        switch (event.currentTarget) {
            case this.toolModel.xAxis:
                this.selectedItem = this.toolModel.xAxis;
                this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                this.changeXYZ.init(1, 0, 0);
                break;
            case this.toolModel.yAxis:
                this.selectedItem = this.toolModel.yAxis;
                this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                this.changeXYZ.init(0, 1, 0);
                break;
            case this.toolModel.zAxis:
                this.selectedItem = this.toolModel.zAxis;
                this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                this.changeXYZ.init(0, 0, 1);
                break;
            case this.toolModel.yzPlane:
                this.selectedItem = this.toolModel.yzPlane;
                this.movePlane3D.fromPoints(po, py, pz);
                this.changeXYZ.init(0, 1, 1);
                break;
            case this.toolModel.xzPlane:
                this.selectedItem = this.toolModel.xzPlane;
                this.movePlane3D.fromPoints(po, px, pz);
                this.changeXYZ.init(1, 0, 1);
                break;
            case this.toolModel.xyPlane:
                this.selectedItem = this.toolModel.xyPlane;
                this.movePlane3D.fromPoints(po, px, py);
                this.changeXYZ.init(1, 1, 0);
                break;
            case this.toolModel.oCube:
                this.selectedItem = this.toolModel.oCube;
                this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                this.changeXYZ.init(1, 1, 1);
                break;
        }
        //
        this.startSceneTransform = globalMatrix3D.clone();
        this.startPlanePos = this.getLocalMousePlaneCross();
        this.startPos = this.toolModel.transform.position;
        MRSToolTarget_1.mrsToolTarget.startTranslation();
        //
        feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
    };
    MTool.prototype.onMouseMove = function () {
        var crossPos = this.getLocalMousePlaneCross();
        var addPos = crossPos.subTo(this.startPlanePos);
        addPos.x *= this.changeXYZ.x;
        addPos.y *= this.changeXYZ.y;
        addPos.z *= this.changeXYZ.z;
        var sceneTransform = this.startSceneTransform.clone();
        sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
        var sceneAddpos = sceneTransform.position.subTo(this.startSceneTransform.position);
        MRSToolTarget_1.mrsToolTarget.translation(sceneAddpos);
    };
    MTool.prototype.onMouseUp = function () {
        _super.prototype.onMouseUp.call(this);
        feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
        MRSToolTarget_1.mrsToolTarget.stopTranslation();
        this.startPos = null;
        this.startPlanePos = null;
        this.startSceneTransform = null;
    };
    MTool.prototype.updateToolModel = function () {
        //鼠标按下时不更新
        if (this.ismouseDown)
            return;
        var cameraPos = Main3D_1.editorCamera.transform.scenePosition;
        var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
        this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
        this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
        this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
        this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
        this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
        this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
    };
    return MTool;
}(MRSToolBase_1.MRSToolBase));
exports.MTool = MTool;
//# sourceMappingURL=MTool.js.map