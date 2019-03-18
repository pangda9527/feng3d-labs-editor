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
define(["require", "exports", "./EditorScript", "../feng3d/Main3D", "../global/EditorData"], function (require, exports, EditorScript_1, Main3D_1, EditorData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpotLightIcon = /** @class */ (function (_super) {
        __extends(SpotLightIcon, _super);
        function SpotLightIcon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpotLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        SpotLightIcon.prototype.initicon = function () {
            var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
                name: "SpotLightIcon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: Main3D_1.editorCamera },
                    {
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.Texture2D",
                                    source: { url: EditorData_1.editorData.getEditorAssetPath("assets/3d/icons/spot.png") },
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                }
                            },
                            renderParams: { enableBlend: true },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this._textureMaterial = lightIcon.getComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material", shaderName: "segment",
                            uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                            renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    },
                ],
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = Object.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.MeshModel",
                        material: { __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        };
        SpotLightIcon.prototype.update = function () {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            if (EditorData_1.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                var points = [];
                var segments = [];
                var num = 36;
                var point0;
                var point1;
                var radius = this.light.range * Math.tan(this.light.angle * feng3d.FMath.DEG2RAD * 0.5);
                var distance = this.light.range;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(x * radius, y * radius, distance);
                    point1 = new feng3d.Vector3(x1 * radius, y1 * radius, distance);
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                }
                //
                points.push({ position: new feng3d.Vector3(0, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, -radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, -radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(-radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(-radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                this._pointGeometry.points = points;
                this._segmentGeometry.segments = segments;
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        };
        SpotLightIcon.prototype.dispose = function () {
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
        SpotLightIcon.prototype.onLightChanged = function (property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        };
        SpotLightIcon.prototype.onScenetransformChanged = function () {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        };
        SpotLightIcon.prototype.onMousedown = function () {
            EditorData_1.editorData.selectObject(this.light.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, function () {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        };
        __decorate([
            feng3d.watch("onLightChanged")
        ], SpotLightIcon.prototype, "light", void 0);
        return SpotLightIcon;
    }(EditorScript_1.EditorScript));
    exports.SpotLightIcon = SpotLightIcon;
});
//# sourceMappingURL=SpotLightIcon.js.map