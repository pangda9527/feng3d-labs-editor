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
var CameraIcon = /** @class */ (function (_super) {
    __extends(CameraIcon, _super);
    function CameraIcon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lensChanged = true;
        return _this;
    }
    CameraIcon.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        this.initicon();
        this.on("mousedown", this.onMousedown, this);
    };
    CameraIcon.prototype.initicon = function () {
        var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
            name: "CameraIcon", components: [
                { __class__: "feng3d.BillboardComponent", camera: Main3D_1.editorCamera },
                {
                    __class__: "feng3d.MeshModel", material: {
                        __class__: "feng3d.Material",
                        shaderName: "texture",
                        uniforms: {
                            s_texture: {
                                __class__: "feng3d.Texture2D",
                                source: { url: EditorData_1.editorData.getEditorAssetPath("assets/3d/icons/camera.png") },
                                format: feng3d.TextureFormat.RGBA,
                            }
                        },
                        renderParams: { enableBlend: true, depthMask: false },
                    },
                    geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                },
            ]
        });
        this.gameObject.addChild(lightIcon);
        //
        var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
            name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
            components: [{
                    __class__: "feng3d.MeshModel", material: {
                        __class__: "feng3d.Material",
                        shaderName: "segment",
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
    CameraIcon.prototype.update = function () {
        if (!this.camera)
            return;
        if (EditorData_1.editorData.selectedGameObjects.indexOf(this.camera.gameObject) != -1) {
            if (this._lensChanged) {
                //
                var points = [];
                var segments = [];
                var lens = this.camera.lens;
                var near = lens.near;
                var far = lens.far;
                var aspect = lens.aspect;
                if (lens instanceof feng3d.PerspectiveLens) {
                    var fov = lens.fov;
                    var tan = Math.tan(fov * Math.PI / 360);
                    //
                    var nearLeft = -tan * near * aspect;
                    var nearRight = tan * near * aspect;
                    var nearTop = tan * near;
                    var nearBottom = -tan * near;
                    var farLeft = -tan * far * aspect;
                    var farRight = tan * far * aspect;
                    var farTop = tan * far;
                    var farBottom = -tan * far;
                    //
                }
                else if (lens instanceof feng3d.OrthographicLens) {
                    var size = lens.size;
                    //
                    var nearLeft = -size * aspect;
                    var nearRight = size;
                    var nearTop = size;
                    var nearBottom = -size;
                    var farLeft = -size;
                    var farRight = size;
                    var farTop = size;
                    var farBottom = -size;
                }
                points.push({ position: new feng3d.Vector3(0, farBottom, far) }, { position: new feng3d.Vector3(0, farTop, far) }, { position: new feng3d.Vector3(farLeft, 0, far) }, { position: new feng3d.Vector3(farRight, 0, far) });
                segments.push({ start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearRight, nearBottom, near) }, { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearLeft, nearTop, near) }, { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(nearRight, nearTop, near) }, { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(nearRight, nearTop, near) }, 
                //
                { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(farLeft, farBottom, far) }, { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(farLeft, farTop, far) }, { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(farRight, farBottom, far) }, { start: new feng3d.Vector3(nearRight, nearTop, near), end: new feng3d.Vector3(farRight, farTop, far) }, 
                //
                { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farRight, farBottom, far) }, { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farLeft, farTop, far) }, { start: new feng3d.Vector3(farLeft, farTop, far), end: new feng3d.Vector3(farRight, farTop, far) }, { start: new feng3d.Vector3(farRight, farBottom, far), end: new feng3d.Vector3(farRight, farTop, far) });
                this._pointGeometry.points = points;
                this._segmentGeometry.segments = segments;
                this._lensChanged = false;
            }
            //
            this._lightLines.visible = true;
            this._lightpoints.visible = true;
        }
        else {
            this._lightLines.visible = false;
            this._lightpoints.visible = false;
        }
    };
    CameraIcon.prototype.dispose = function () {
        this.enabled = false;
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
    CameraIcon.prototype.onCameraChanged = function (property, oldValue, value) {
        if (oldValue) {
            oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            oldValue.off("lensChanged", this.onLensChanged, this);
        }
        if (value) {
            this.onScenetransformChanged();
            value.on("scenetransformChanged", this.onScenetransformChanged, this);
            value.on("lensChanged", this.onLensChanged, this);
        }
    };
    CameraIcon.prototype.onLensChanged = function () {
        this._lensChanged = true;
    };
    CameraIcon.prototype.onScenetransformChanged = function () {
        this.transform.localToWorldMatrix = this.camera.transform.localToWorldMatrix;
    };
    CameraIcon.prototype.onMousedown = function () {
        EditorData_1.editorData.selectObject(this.camera.gameObject);
        // 防止再次调用鼠标拾取
        feng3d.shortcut.activityState("selectInvalid");
        feng3d.ticker.once(100, function () {
            feng3d.shortcut.deactivityState("selectInvalid");
        });
    };
    __decorate([
        feng3d.watch("onCameraChanged")
    ], CameraIcon.prototype, "camera", void 0);
    return CameraIcon;
}(EditorScript_1.EditorScript));
exports.CameraIcon = CameraIcon;
//# sourceMappingURL=CameraIcon.js.map