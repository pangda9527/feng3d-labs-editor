"use strict";
// namespace feng3d { export interface ComponentMap { MToolModel: editor.MToolModel } }
// namespace feng3d { export interface ComponentMap { CoordinateAxis: editor.CoordinateAxis } }
// namespace feng3d { export interface ComponentMap { CoordinatePlane: editor.CoordinatePlane } }
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 移动工具模型组件
 */
var MToolModel = /** @class */ (function (_super) {
    __extends(MToolModel, _super);
    function MToolModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MToolModel.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        this.gameObject.name = "GameObjectMoveModel";
        this.initModels();
    };
    MToolModel.prototype.initModels = function () {
        this.xAxis = Object.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateAxis);
        this.xAxis.color.setTo(1, 0, 0, 1);
        this.xAxis.transform.rz = -90;
        this.gameObject.addChild(this.xAxis.gameObject);
        this.yAxis = Object.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateAxis);
        this.yAxis.color.setTo(0, 1, 0, 1);
        this.gameObject.addChild(this.yAxis.gameObject);
        this.zAxis = Object.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateAxis);
        this.zAxis.color.setTo(0, 0, 1, 1);
        this.zAxis.transform.rx = 90;
        this.gameObject.addChild(this.zAxis.gameObject);
        this.yzPlane = Object.setValue(new feng3d.GameObject(), { name: "yzPlane" }).addComponent(CoordinatePlane);
        this.yzPlane.color.setTo(1, 0, 0, 0.2);
        this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
        this.yzPlane.borderColor.setTo(1, 0, 0, 1);
        this.yzPlane.transform.rz = 90;
        this.gameObject.addChild(this.yzPlane.gameObject);
        this.xzPlane = Object.setValue(new feng3d.GameObject(), { name: "xzPlane" }).addComponent(CoordinatePlane);
        this.xzPlane.color.setTo(0, 1, 0, 0.2);
        this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
        this.xzPlane.borderColor.setTo(0, 1, 0, 1);
        this.gameObject.addChild(this.xzPlane.gameObject);
        this.xyPlane = Object.setValue(new feng3d.GameObject(), { name: "xyPlane" }).addComponent(CoordinatePlane);
        this.xyPlane.color.setTo(0, 0, 1, 0.2);
        this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
        this.xyPlane.borderColor.setTo(0, 0, 1, 1);
        this.xyPlane.transform.rx = -90;
        this.gameObject.addChild(this.xyPlane.gameObject);
        this.oCube = Object.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(CoordinateCube);
        this.gameObject.addChild(this.oCube.gameObject);
    };
    return MToolModel;
}(feng3d.Component));
exports.MToolModel = MToolModel;
var CoordinateAxis = /** @class */ (function (_super) {
    __extends(CoordinateAxis, _super);
    function CoordinateAxis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = new feng3d.Color4(1, 0, 0, 0.99);
        _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
        _this.length = 100;
        //
        _this.selected = false;
        return _this;
    }
    CoordinateAxis.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        var xLine = new feng3d.GameObject();
        var model = xLine.addComponent(feng3d.Model);
        var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
        segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.length, 0) });
        this.segmentMaterial = model.material = Object.setValue(new feng3d.Material(), { shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true } });
        this.gameObject.addChild(xLine);
        //
        this.xArrow = new feng3d.GameObject();
        model = this.xArrow.addComponent(feng3d.Model);
        model.geometry = Object.setValue(new feng3d.ConeGeometry(), { bottomRadius: 5, height: 18 });
        this.material = model.material = Object.setValue(new feng3d.Material(), { shaderName: "color" });
        this.material.renderParams.enableBlend = true;
        this.xArrow.transform.y = this.length;
        this.gameObject.addChild(this.xArrow);
        var mouseHit = Object.setValue(new feng3d.GameObject(), { name: "hitCoordinateAxis" });
        model = mouseHit.addComponent(feng3d.Model);
        model.geometry = Object.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length });
        //model.material = materialFactory.create("color");
        mouseHit.transform.y = 20 + (this.length - 20) / 2;
        mouseHit.visible = false;
        mouseHit.mouseEnabled = true;
        this.gameObject.addChild(mouseHit);
        this.isinit = true;
        this.update();
    };
    CoordinateAxis.prototype.update = function () {
        if (!this.isinit)
            return;
        var color = this.selected ? this.selectedColor : this.color;
        this.segmentMaterial.uniforms.u_segmentColor = color;
        //
        this.material.uniforms.u_diffuseInput = color;
    };
    __decorate([
        feng3d.watch("update")
    ], CoordinateAxis.prototype, "selected", void 0);
    return CoordinateAxis;
}(feng3d.Component));
exports.CoordinateAxis = CoordinateAxis;
var CoordinateCube = /** @class */ (function (_super) {
    __extends(CoordinateCube, _super);
    function CoordinateCube() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isinit = false;
        _this.color = new feng3d.Color4(1, 1, 1, 0.99);
        _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
        //
        _this.selected = false;
        return _this;
    }
    CoordinateCube.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        //
        this.oCube = new feng3d.GameObject();
        var model = this.oCube.addComponent(feng3d.Model);
        model.geometry = Object.setValue(new feng3d.CubeGeometry(), { width: 8, height: 8, depth: 8 });
        this.colorMaterial = model.material = Object.setValue(new feng3d.Material(), { shaderName: "color" });
        this.colorMaterial.renderParams.enableBlend = true;
        this.oCube.mouseEnabled = true;
        this.gameObject.addChild(this.oCube);
        this.isinit = true;
        this.update();
    };
    CoordinateCube.prototype.update = function () {
        if (!this.isinit)
            return;
        this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
    };
    __decorate([
        feng3d.watch("update")
    ], CoordinateCube.prototype, "selected", void 0);
    return CoordinateCube;
}(feng3d.Component));
exports.CoordinateCube = CoordinateCube;
var CoordinatePlane = /** @class */ (function (_super) {
    __extends(CoordinatePlane, _super);
    function CoordinatePlane() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = new feng3d.Color4(1, 0, 0, 0.2);
        _this.borderColor = new feng3d.Color4(1, 0, 0, 0.99);
        _this.selectedColor = new feng3d.Color4(1, 0, 0, 0.5);
        _this.selectedborderColor = new feng3d.Color4(1, 1, 0, 0.99);
        _this._width = 20;
        //
        _this.selected = false;
        return _this;
    }
    Object.defineProperty(CoordinatePlane.prototype, "width", {
        //
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    CoordinatePlane.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        var plane = Object.setValue(new feng3d.GameObject(), { name: "plane" });
        var model = plane.addComponent(feng3d.Model);
        plane.transform.x = plane.transform.z = this._width / 2;
        model.geometry = Object.setValue(new feng3d.PlaneGeometry(), { width: this._width, height: this._width });
        this.colorMaterial = model.material = Object.setValue(new feng3d.Material(), { shaderName: "color" });
        this.colorMaterial.renderParams.cullFace = feng3d.CullFace.NONE;
        this.colorMaterial.renderParams.enableBlend = true;
        plane.mouseEnabled = true;
        this.gameObject.addChild(plane);
        var border = Object.setValue(new feng3d.GameObject(), { name: "border" });
        model = border.addComponent(feng3d.Model);
        this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
        var material = model.material = Object.setValue(new feng3d.Material(), {
            shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
            uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
        });
        material.renderParams.enableBlend = true;
        this.gameObject.addChild(border);
        this.isinit = true;
        this.update();
    };
    CoordinatePlane.prototype.update = function () {
        if (!this.isinit)
            return;
        this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
        var color = this.selected ? this.selectedborderColor : this.borderColor;
        this.segmentGeometry.segments = [{ start: new feng3d.Vector3(0, 0, 0), end: new feng3d.Vector3(this._width, 0, 0), startColor: color, endColor: color }];
        color = this.selected ? this.selectedborderColor : this.borderColor;
        this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, 0), end: new feng3d.Vector3(this._width, 0, this._width), startColor: color, endColor: color });
        color = this.selected ? this.selectedborderColor : this.borderColor;
        this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, this._width), end: new feng3d.Vector3(0, 0, this._width), startColor: color, endColor: color });
        color = this.selected ? this.selectedborderColor : this.borderColor;
        this.segmentGeometry.segments.push({ start: new feng3d.Vector3(0, 0, this._width), end: new feng3d.Vector3(0, 0, 0), startColor: color, endColor: color });
    };
    __decorate([
        feng3d.watch("update")
    ], CoordinatePlane.prototype, "selected", void 0);
    return CoordinatePlane;
}(feng3d.Component));
exports.CoordinatePlane = CoordinatePlane;
//# sourceMappingURL=MToolModel.js.map