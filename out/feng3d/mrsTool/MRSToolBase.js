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
var Main3D_1 = require("../Main3D");
var MRSToolTarget_1 = require("./MRSToolTarget");
var MRSToolBase = /** @class */ (function (_super) {
    __extends(MRSToolBase, _super);
    function MRSToolBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ismouseDown = false;
        return _this;
    }
    MRSToolBase.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        var holdSizeComponent = this.gameObject.addComponent(feng3d.HoldSizeComponent);
        holdSizeComponent.holdSize = 1;
        holdSizeComponent.camera = Main3D_1.editorCamera;
        //
        this.on("addedToScene", this.onAddedToScene, this);
        this.on("removedFromScene", this.onRemovedFromScene, this);
    };
    MRSToolBase.prototype.onAddedToScene = function () {
        MRSToolTarget_1.mrsToolTarget.controllerTool = this.transform;
        //
        feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
        feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        feng3d.ticker.onframe(this.updateToolModel, this);
    };
    MRSToolBase.prototype.onRemovedFromScene = function () {
        MRSToolTarget_1.mrsToolTarget.controllerTool = null;
        //
        feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
        feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        feng3d.ticker.offframe(this.updateToolModel, this);
    };
    MRSToolBase.prototype.onItemMouseDown = function (event) {
        feng3d.shortcut.activityState("inTransforming");
    };
    Object.defineProperty(MRSToolBase.prototype, "toolModel", {
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
    Object.defineProperty(MRSToolBase.prototype, "selectedItem", {
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
    MRSToolBase.prototype.updateToolModel = function () {
    };
    MRSToolBase.prototype.onMouseDown = function () {
        this.selectedItem = null;
        this.ismouseDown = true;
    };
    MRSToolBase.prototype.onMouseUp = function () {
        this.ismouseDown = false;
        this.movePlane3D = null;
        this.startSceneTransform = null;
        feng3d.ticker.nextframe(function () {
            feng3d.shortcut.deactivityState("inTransforming");
        });
    };
    /**
     * 获取鼠标射线与移动平面的交点（模型空间）
     */
    MRSToolBase.prototype.getLocalMousePlaneCross = function () {
        //射线与平面交点
        var crossPos = this.getMousePlaneCross();
        //把交点从世界转换为模型空间
        var inverseGlobalMatrix3D = this.startSceneTransform.clone();
        inverseGlobalMatrix3D.invert();
        crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
        return crossPos;
    };
    MRSToolBase.prototype.getMousePlaneCross = function () {
        var line3D = Main3D_1.editorCamera.getMouseRay3D();
        //射线与平面交点
        var crossPos = this.movePlane3D.intersectWithLine3D(line3D);
        return crossPos;
    };
    return MRSToolBase;
}(feng3d.Component));
exports.MRSToolBase = MRSToolBase;
//# sourceMappingURL=MRSToolBase.js.map