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
define(["require", "exports", "./MToolModel"], function (require, exports, MToolModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // namespace feng3d { export interface ComponentMap { SToolModel: editor.SToolModel } }
    // namespace feng3d { export interface ComponentMap { CoordinateCube: editor.CoordinateCube } }
    // namespace feng3d { export interface ComponentMap { CoordinateScaleCube: editor.CoordinateScaleCube } }
    /**
     * 缩放工具模型组件
     */
    var SToolModel = /** @class */ (function (_super) {
        __extends(SToolModel, _super);
        function SToolModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SToolModel.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "GameObjectScaleModel";
            this.initModels();
        };
        SToolModel.prototype.initModels = function () {
            this.xCube = Object.setValue(new feng3d.GameObject(), { name: "xCube" }).addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);
            this.yCube = Object.setValue(new feng3d.GameObject(), { name: "yCube" }).addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);
            this.zCube = Object.setValue(new feng3d.GameObject(), { name: "zCube" }).addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);
            this.oCube = Object.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(MToolModel_1.CoordinateCube);
            this.oCube.gameObject.transform.scale = new feng3d.Vector3(1.2, 1.2, 1.2);
            this.gameObject.addChild(this.oCube.gameObject);
        };
        return SToolModel;
    }(feng3d.Component));
    exports.SToolModel = SToolModel;
    var CoordinateScaleCube = /** @class */ (function (_super) {
        __extends(CoordinateScaleCube, _super);
        function CoordinateScaleCube() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            _this.length = 100;
            //
            _this.selected = false;
            //
            _this.scaleValue = 1;
            return _this;
        }
        CoordinateScaleCube.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            var xLine = new feng3d.GameObject();
            var model = xLine.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = Object.setValue(new feng3d.GameObject(), { name: "coordinateCube" }).addComponent(MToolModel_1.CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);
            var mouseHit = Object.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Model);
            model.geometry = Object.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length - 4 });
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        };
        CoordinateScaleCube.prototype.update = function () {
            if (!this.isinit)
                return;
            this.coordinateCube.color = this.color;
            this.coordinateCube.selectedColor = this.selectedColor;
            this.coordinateCube.update();
            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.scaleValue * this.length, 0), startColor: this.color, endColor: this.color }];
            //
            this.coordinateCube.transform.y = this.length * this.scaleValue;
            this.coordinateCube.selected = this.selected;
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateScaleCube.prototype, "selected", void 0);
        __decorate([
            feng3d.watch("update")
        ], CoordinateScaleCube.prototype, "scaleValue", void 0);
        return CoordinateScaleCube;
    }(feng3d.Component));
    exports.CoordinateScaleCube = CoordinateScaleCube;
});
//# sourceMappingURL=SToolModel.js.map