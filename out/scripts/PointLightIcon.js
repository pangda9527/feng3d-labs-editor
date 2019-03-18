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
var EditorScript_1 = require("./EditorScript");
var Main3D_1 = require("../feng3d/Main3D");
var EditorData_1 = require("../global/EditorData");
var PointLightIcon = /** @class */ (function (_super) {
    __extends(PointLightIcon, _super);
    function PointLightIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PointLightIcon.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        this.initicon();
        this.on("mousedown", this.onMousedown, this);
    };
    PointLightIcon.prototype.initicon = function () {
        var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
            name: "PointLightIcon", components: [
                { __class__: "feng3d.BillboardComponent", camera: Main3D_1.editorCamera },
                {
                    __class__: "feng3d.MeshModel", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    material: {
                        __class__: "feng3d.Material",
                        shaderName: "texture",
                        uniforms: {
                            s_texture: {
                                __class__: "feng3d.Texture2D",
                                source: { url: EditorData_1.editorData.getEditorAssetPath("assets/3d/icons/light.png") },
                                format: feng3d.TextureFormat.RGBA,
                                premulAlpha: true,
                            },
                        },
                        renderParams: { enableBlend: true },
                    },
                },
            ],
        });
        this._textureMaterial = lightIcon.getComponent(feng3d.Model).material;
        this.gameObject.addChild(lightIcon);
        //
        var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
            name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
            components: [{
                    __class__: "feng3d.MeshModel", material: {
                        __class__: "feng3d.Material",
                        shaderName: "segment",
                        uniforms: {
                            u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 },
                        }, renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true, }
                    },
                    geometry: { __class__: "feng3d.SegmentGeometry" },
                }]
        });
        this._segmentGeometry = lightLines.getComponent(feng3d.Model).geometry;
        this.gameObject.addChild(lightLines);
        //
        var lightpoints = this._lightpoints = Object.setValue(new feng3d.GameObject(), {
            name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
            components: [{
                    __class__: "feng3d.MeshModel",
                    geometry: {
                        __class__: "feng3d.PointGeometry",
                        points: [
                            { position: { __class__: "feng3d.Vector3", x: 1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                            { position: { __class__: "feng3d.Vector3", x: -1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                            { position: { __class__: "feng3d.Vector3", y: 1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                            { position: { __class__: "feng3d.Vector3", y: -1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                            { position: { __class__: "feng3d.Vector3", z: 1 }, color: { __class__: "feng3d.Color4", b: 1 } },
                            { position: { __class__: "feng3d.Vector3", z: -1 }, color: { __class__: "feng3d.Color4", b: 1 } }
                        ],
                    },
                    material: {
                        __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { renderMode: feng3d.RenderMode.POINTS, enableBlend: true, },
                    },
                }],
        });
        this._pointGeometry = lightpoints.getComponent(feng3d.Model).geometry;
        this.gameObject.addChild(lightpoints);
        this.enabled = true;
    };
    PointLightIcon.prototype.update = function () {
        if (!this.light)
            return;
        this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
        this._lightLines.transform.scale =
            this._lightpoints.transform.scale =
                new feng3d.Vector3(this.light.range, this.light.range, this.light.range);
        if (EditorData_1.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
            //
            var camerapos = this.gameObject.transform.inverseTransformPoint(Main3D_1.editorCamera.gameObject.transform.scenePosition);
            //
            var segments = [];
            var alpha = 1;
            var backalpha = 0.5;
            var num = 36;
            var point0;
            var point1;
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle);
                var y = Math.cos(angle);
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1);
                var y1 = Math.cos(angle1);
                //
                point0 = new feng3d.Vector3(0, x, y);
                point1 = new feng3d.Vector3(0, x1, y1);
                if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 0, 0, alpha), endColor: new feng3d.Color4(1, 0, 0, alpha) });
                point0 = new feng3d.Vector3(x, 0, y);
                point1 = new feng3d.Vector3(x1, 0, y1);
                if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 1, 0, alpha), endColor: new feng3d.Color4(0, 1, 0, alpha) });
                point0 = new feng3d.Vector3(x, y, 0);
                point1 = new feng3d.Vector3(x1, y1, 0);
                if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 0, 1, alpha), endColor: new feng3d.Color4(0, 0, 1, alpha) });
            }
            this._segmentGeometry.segments = segments;
            this._pointGeometry.points = [];
            var point = new feng3d.Vector3(1, 0, 0);
            if (point.dot(camerapos) < 0)
                alpha = backalpha;
            else
                alpha = 1.0;
            this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
            point = new feng3d.Vector3(-1, 0, 0);
            if (point.dot(camerapos) < 0)
                alpha = backalpha;
            else
                alpha = 1.0;
            this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
            point = new feng3d.Vector3(0, 1, 0);
            if (point.dot(camerapos) < 0)
                alpha = backalpha;
            else
                alpha = 1.0;
            this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
            point = new feng3d.Vector3(0, -1, 0);
            if (point.dot(camerapos) < 0)
                alpha = backalpha;
            else
                alpha = 1.0;
            this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
            point = new feng3d.Vector3(0, 0, 1);
            if (point.dot(camerapos) < 0)
                alpha = backalpha;
            else
                alpha = 1.0;
            this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
            point = new feng3d.Vector3(0, 0, -1);
            if (point.dot(camerapos) < 0)
                alpha = backalpha;
            else
                alpha = 1.0;
            this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
            //
            this._lightLines.visible = true;
            this._lightpoints.visible = true;
        }
        else {
            this._lightLines.visible = false;
            this._lightpoints.visible = false;
        }
    };
    PointLightIcon.prototype.dispose = function () {
        this.enabled = false;
        this._textureMaterial = null;
        //
        this._lightIcon.dispose();
        this._lightLines.dispose();
        this._lightpoints.dispose();
        this._lightIcon = null;
        this._lightLines = null;
        this._lightpoints = null;
        this._segmentGeometry = null;
        _super.prototype.dispose.call(this);
    };
    PointLightIcon.prototype.onLightChanged = function (property, oldValue, value) {
        if (oldValue) {
            oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
        }
        if (value) {
            this.onScenetransformChanged();
            value.on("scenetransformChanged", this.onScenetransformChanged, this);
        }
    };
    PointLightIcon.prototype.onScenetransformChanged = function () {
        this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
    };
    PointLightIcon.prototype.onMousedown = function () {
        EditorData_1.editorData.selectObject(this.light.gameObject);
        // 防止再次调用鼠标拾取
        feng3d.shortcut.activityState("selectInvalid");
        feng3d.ticker.once(100, function () {
            feng3d.shortcut.deactivityState("selectInvalid");
        });
    };
    __decorate([
        feng3d.watch("onLightChanged")
    ], PointLightIcon.prototype, "light", void 0);
    return PointLightIcon;
}(EditorScript_1.EditorScript));
exports.PointLightIcon = PointLightIcon;
//# sourceMappingURL=PointLightIcon.js.map