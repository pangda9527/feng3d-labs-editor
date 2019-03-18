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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Main3D_1 = require("./Main3D");
// namespace feng3d { export interface ComponentMap { GroundGrid: editor.GroundGrid } }
/**
 * 地面网格
 */
var GroundGrid = /** @class */ (function (_super) {
    __extends(GroundGrid, _super);
    function GroundGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.num = 100;
        return _this;
    }
    GroundGrid.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        var groundGridObject = Object.setValue(new feng3d.GameObject(), { name: "GroundGrid" });
        groundGridObject.mouseEnabled = false;
        gameObject.addChild(groundGridObject);
        var __this = this;
        Main3D_1.editorCamera.transform.on("transformChanged", update, this);
        var model = groundGridObject.addComponent(feng3d.Model);
        var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
        var material = model.material = Object.setValue(new feng3d.Material(), { shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES } });
        material.renderParams.enableBlend = true;
        update();
        function update() {
            var cameraGlobalPosition = Main3D_1.editorCamera.transform.scenePosition;
            var level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
            var step = Math.pow(10, level - 1);
            var startX = Math.round(cameraGlobalPosition.x / (10 * step)) * 10 * step;
            var startZ = Math.round(cameraGlobalPosition.z / (10 * step)) * 10 * step;
            //设置在原点
            startX = startZ = 0;
            step = 1;
            var halfNum = __this.num / 2;
            var xcolor = new feng3d.Color4(1, 0, 0, 0.5);
            var zcolor = new feng3d.Color4(0, 0, 1, 0.5);
            var color;
            var segments = [];
            for (var i = -halfNum; i <= halfNum; i++) {
                var color0 = new feng3d.Color4().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                color0.a = ((i % 10) == 0) ? 0.5 : 0.1;
                color = (i * step + startZ == 0) ? xcolor : color0;
                segments.push({ start: new feng3d.Vector3(-halfNum * step + startX, 0, i * step + startZ), end: new feng3d.Vector3(halfNum * step + startX, 0, i * step + startZ), startColor: color, endColor: color });
                color = (i * step + startX == 0) ? zcolor : color0;
                segments.push({ start: new feng3d.Vector3(i * step + startX, 0, -halfNum * step + startZ), end: new feng3d.Vector3(i * step + startX, 0, halfNum * step + startZ), startColor: color, endColor: color });
            }
            segmentGeometry.segments = segments;
        }
    };
    __decorate([
        feng3d.oav()
    ], GroundGrid.prototype, "num", void 0);
    return GroundGrid;
}(feng3d.Component));
exports.GroundGrid = GroundGrid;
//# sourceMappingURL=GroundGrid.js.map