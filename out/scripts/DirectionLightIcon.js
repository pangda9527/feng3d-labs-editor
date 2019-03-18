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
define(["require", "exports", "../global/EditorData", "./EditorScript", "../feng3d/Main3D"], function (require, exports, EditorData_1, EditorScript_1, Main3D_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // namespace feng3d
    // {
    //     export interface ComponentMap { DirectionLightIcon: editor.DirectionLightIcon; }
    // }
    var DirectionLightIcon = /** @class */ (function (_super) {
        __extends(DirectionLightIcon, _super);
        function DirectionLightIcon() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.__class__ = "editor.DirectionLightIcon";
            return _this;
        }
        DirectionLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        DirectionLightIcon.prototype.initicon = function () {
            var linesize = 10;
            var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
                name: "DirectionLightIcon", components: [{ __class__: "feng3d.BillboardComponent", camera: Main3D_1.editorCamera },
                    {
                        __class__: "feng3d.MeshModel", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false },
                        material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: { s_texture: { __class__: "feng3d.Texture2D", source: { url: EditorData_1.editorData.getEditorAssetPath("assets/3d/icons/sun.png") }, format: feng3d.TextureFormat.RGBA, premulAlpha: true, }, }, renderParams: { enableBlend: true }
                        },
                    },],
            });
            this._textureMaterial = lightIcon.addComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);
            //
            var num = 10;
            var segments = [];
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x, y, linesize * 5) });
            }
            num = 36;
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1) * linesize;
                var y1 = Math.cos(angle1) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{ __class__: "feng3d.HoldSizeComponent", camera: Main3D_1.editorCamera, holdSize: 1 },
                    {
                        __class__: "feng3d.MeshModel",
                        material: { __class__: "feng3d.Material", shaderName: "segment", uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 163 / 255, g: 162 / 255, b: 107 / 255 } }, renderParams: { renderMode: feng3d.RenderMode.LINES } },
                        geometry: { __class__: "feng3d.SegmentGeometry", segments: segments },
                    },],
            });
            this.gameObject.addChild(lightLines);
            this.enabled = true;
        };
        DirectionLightIcon.prototype.update = function () {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this._lightLines.visible = EditorData_1.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
        };
        DirectionLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            _super.prototype.dispose.call(this);
        };
        DirectionLightIcon.prototype.onLightChanged = function (property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        };
        DirectionLightIcon.prototype.onScenetransformChanged = function () {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        };
        DirectionLightIcon.prototype.onMousedown = function () {
            EditorData_1.editorData.selectObject(this.light.gameObject);
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, function () {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        };
        __decorate([
            feng3d.watch("onLightChanged")
        ], DirectionLightIcon.prototype, "light", void 0);
        return DirectionLightIcon;
    }(EditorScript_1.EditorScript));
    exports.DirectionLightIcon = DirectionLightIcon;
});
//# sourceMappingURL=DirectionLightIcon.js.map