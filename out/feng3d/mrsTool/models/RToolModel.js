// namespace feng3d { export interface ComponentMap { RToolModel: editor.RToolModel } }
// namespace feng3d { export interface ComponentMap { SectorGameObject: editor.SectorGameObject } }
// namespace feng3d { export interface ComponentMap { CoordinateRotationFreeAxis: editor.CoordinateRotationFreeAxis } }
// namespace feng3d { export interface ComponentMap { CoordinateRotationAxis: editor.CoordinateRotationAxis } }
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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 旋转工具模型组件
     */
    var RToolModel = /** @class */ (function (_super) {
        __extends(RToolModel, _super);
        function RToolModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RToolModel.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "GameObjectRotationModel";
            this.initModels();
        };
        RToolModel.prototype.initModels = function () {
            this.xAxis = Object.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = Object.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = Object.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);
            this.cameraAxis = Object.setValue(new feng3d.GameObject(), { name: "cameraAxis" }).addComponent(CoordinateRotationAxis);
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);
            this.freeAxis = Object.setValue(new feng3d.GameObject(), { name: "freeAxis" }).addComponent(CoordinateRotationFreeAxis);
            this.freeAxis.color.setTo(1, 1, 1);
            this.freeAxis.update();
            this.gameObject.addChild(this.freeAxis.gameObject);
        };
        return RToolModel;
    }(feng3d.Component));
    exports.RToolModel = RToolModel;
    var CoordinateRotationAxis = /** @class */ (function (_super) {
        __extends(CoordinateRotationAxis, _super);
        function CoordinateRotationAxis() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.radius = 80;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            _this.selected = false;
            return _this;
        }
        CoordinateRotationAxis.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initModels();
        };
        CoordinateRotationAxis.prototype.initModels = function () {
            var border = new feng3d.GameObject();
            var model = border.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = Object.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            var mouseHit = Object.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Model);
            this.torusGeometry = model.geometry = Object.setValue(new feng3d.TorusGeometry(), { radius: this.radius, tubeRadius: 2 });
            model.material = new feng3d.Material();
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        };
        CoordinateRotationAxis.prototype.update = function () {
            if (!this.isinit)
                return;
            this.sector.radius = this.radius;
            this.torusGeometry.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            if (this.filterNormal) {
                var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this.filterNormal);
            }
            this.segmentGeometry.segments = [];
            var points = [];
            for (var i = 0; i <= 360; i++) {
                points[i] = new feng3d.Vector3(Math.sin(i * feng3d.FMath.DEG2RAD), Math.cos(i * feng3d.FMath.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0) {
                    var show = true;
                    if (localNormal) {
                        show = points[i - 1].dot(localNormal) > 0 && points[i].dot(localNormal) > 0;
                    }
                    if (show) {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                    }
                    else if (this.selected) {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: this.backColor, endColor: this.backColor });
                    }
                }
            }
        };
        CoordinateRotationAxis.prototype.showSector = function (startPos, endPos) {
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
            var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * feng3d.FMath.RAD2DEG;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * feng3d.FMath.RAD2DEG;
            //
            var min = Math.min(startAngle, endAngle);
            var max = Math.max(startAngle, endAngle);
            if (max - min > 180) {
                min += 360;
            }
            this.sector.update(min, max);
            this.gameObject.addChild(this.sector.gameObject);
        };
        CoordinateRotationAxis.prototype.hideSector = function () {
            if (this.sector.gameObject.parent)
                this.sector.gameObject.parent.removeChild(this.sector.gameObject);
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateRotationAxis.prototype, "selected", void 0);
        __decorate([
            feng3d.watch("update")
        ], CoordinateRotationAxis.prototype, "filterNormal", void 0);
        return CoordinateRotationAxis;
    }(feng3d.Component));
    exports.CoordinateRotationAxis = CoordinateRotationAxis;
    /**
     * 扇形对象
     */
    var SectorGameObject = /** @class */ (function (_super) {
        __extends(SectorGameObject, _super);
        function SectorGameObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.borderColor = new feng3d.Color4(0, 1, 1, 0.6);
            _this.radius = 80;
            _this._start = 0;
            _this._end = 0;
            return _this;
        }
        /**
         * 构建3D对象
         */
        SectorGameObject.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "sector";
            var model = this.gameObject.addComponent(feng3d.Model);
            this.geometry = model.geometry = new feng3d.CustomGeometry();
            model.material = Object.setValue(new feng3d.Material(), { shaderName: "color", uniforms: { u_diffuseInput: new feng3d.Color4(0.5, 0.5, 0.5, 0.2) } });
            model.material.renderParams.enableBlend = true;
            model.material.renderParams.cullFace = feng3d.CullFace.NONE;
            var border = Object.setValue(new feng3d.GameObject(), { name: "border" });
            model = border.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.isinit = true;
            this.update(0, 0);
        };
        SectorGameObject.prototype.update = function (start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = 0; }
            if (!this.isinit)
                return;
            this._start = Math.min(start, end);
            this._end = Math.max(start, end);
            var length = Math.floor(this._end - this._start);
            if (length == 0)
                length = 1;
            var vertexPositionData = [];
            var indices = [];
            vertexPositionData[0] = 0;
            vertexPositionData[1] = 0;
            vertexPositionData[2] = 0;
            for (var i = 0; i < length; i++) {
                vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * feng3d.FMath.DEG2RAD);
                vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * feng3d.FMath.DEG2RAD);
                vertexPositionData[i * 3 + 5] = 0;
                if (i > 0) {
                    indices[(i - 1) * 3] = 0;
                    indices[(i - 1) * 3 + 1] = i;
                    indices[(i - 1) * 3 + 2] = i + 1;
                }
            }
            if (indices.length == 0)
                indices = [0, 0, 0];
            this.geometry.setVAData("a_position", vertexPositionData, 3);
            this.geometry.indices = indices;
            //绘制边界
            var startPoint = new feng3d.Vector3(this.radius * Math.cos((this._start - 0.1) * feng3d.FMath.DEG2RAD), this.radius * Math.sin((this._start - 0.1) * feng3d.FMath.DEG2RAD), 0);
            var endPoint = new feng3d.Vector3(this.radius * Math.cos((this._end + 0.1) * feng3d.FMath.DEG2RAD), this.radius * Math.sin((this._end + 0.1) * feng3d.FMath.DEG2RAD), 0);
            //
            this.segmentGeometry.segments = [
                { start: new feng3d.Vector3(), end: startPoint, startColor: this.borderColor, endColor: this.borderColor },
                { start: new feng3d.Vector3(), end: endPoint, startColor: this.borderColor, endColor: this.borderColor },
            ];
        };
        return SectorGameObject;
    }(feng3d.Component));
    exports.SectorGameObject = SectorGameObject;
    var CoordinateRotationFreeAxis = /** @class */ (function (_super) {
        __extends(CoordinateRotationFreeAxis, _super);
        function CoordinateRotationFreeAxis() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.radius = 80;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            _this.selected = false;
            return _this;
        }
        CoordinateRotationFreeAxis.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initModels();
        };
        CoordinateRotationFreeAxis.prototype.initModels = function () {
            var border = Object.setValue(new feng3d.GameObject(), { name: "border" });
            var model = border.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) }
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = Object.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.gameObject.addChild(this.sector.gameObject);
            this.isinit = true;
            this.update();
        };
        CoordinateRotationFreeAxis.prototype.update = function () {
            if (!this.isinit)
                return;
            this.sector.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            var segments = [];
            var points = [];
            for (var i = 0; i <= 360; i++) {
                points[i] = new feng3d.Vector3(Math.sin(i * feng3d.FMath.DEG2RAD), Math.cos(i * feng3d.FMath.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0) {
                    segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                }
            }
            this.segmentGeometry.segments = segments;
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateRotationFreeAxis.prototype, "selected", void 0);
        return CoordinateRotationFreeAxis;
    }(feng3d.Component));
    exports.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
});
//# sourceMappingURL=RToolModel.js.map