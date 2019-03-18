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
define(["require", "exports", "../scripts/DirectionLightIcon", "../scripts/PointLightIcon", "../scripts/SpotLightIcon", "../scripts/CameraIcon"], function (require, exports, DirectionLightIcon_1, PointLightIcon_1, SpotLightIcon_1, CameraIcon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // namespace feng3d { export interface ComponentMap { EditorComponent: EditorComponent } }
    var EditorComponent = /** @class */ (function (_super) {
        __extends(EditorComponent, _super);
        function EditorComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.directionLightIconMap = new Map();
            _this.pointLightIconMap = new Map();
            _this.spotLightIconMap = new Map();
            _this.cameraIconMap = new Map();
            return _this;
        }
        Object.defineProperty(EditorComponent.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            set: function (v) {
                var _this = this;
                if (this._scene) {
                    this.scene.off("addComponent", this.onAddComponent, this);
                    this.scene.off("removeComponent", this.onRemoveComponent, this);
                    this.scene.getComponentsInChildren(feng3d.Component).forEach(function (element) {
                        _this.removeComponent(element);
                    });
                }
                this._scene = v;
                if (this._scene) {
                    this.scene.getComponentsInChildren(feng3d.Component).forEach(function (element) {
                        _this.addComponent(element);
                    });
                    this.scene.on("addComponent", this.onAddComponent, this);
                    this.scene.on("removeComponent", this.onRemoveComponent, this);
                    this.scene.on("addChild", this.onAddChild, this);
                    this.scene.on("removeChild", this.onRemoveChild, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        EditorComponent.prototype.init = function (gameobject) {
            _super.prototype.init.call(this, gameobject);
        };
        /**
         * 销毁
         */
        EditorComponent.prototype.dispose = function () {
            this.scene = null;
            _super.prototype.dispose.call(this);
        };
        EditorComponent.prototype.onAddChild = function (event) {
            var _this = this;
            var components = event.data.getComponentsInChildren();
            components.forEach(function (v) {
                _this.addComponent(v);
            });
        };
        EditorComponent.prototype.onRemoveChild = function (event) {
            var _this = this;
            var components = event.data.getComponentsInChildren();
            components.forEach(function (v) {
                _this.removeComponent(v);
            });
        };
        EditorComponent.prototype.onAddComponent = function (event) {
            this.addComponent(event.data);
        };
        EditorComponent.prototype.onRemoveComponent = function (event) {
            this.removeComponent(event.data);
        };
        EditorComponent.prototype.addComponent = function (component) {
            if (component instanceof feng3d.DirectionalLight) {
                var directionLightIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "DirectionLightIcon", }).addComponent(DirectionLightIcon_1.DirectionLightIcon), { light: component, });
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(component, directionLightIcon);
            }
            else if (component instanceof feng3d.PointLight) {
                var pointLightIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "PointLightIcon" }).addComponent(PointLightIcon_1.PointLightIcon), { light: component });
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(component, pointLightIcon);
            }
            else if (component instanceof feng3d.SpotLight) {
                var spotLightIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "SpotLightIcon" }).addComponent(SpotLightIcon_1.SpotLightIcon), { light: component });
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(component, spotLightIcon);
            }
            else if (component instanceof feng3d.Camera) {
                var cameraIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "CameraIcon" }).addComponent(CameraIcon_1.CameraIcon), { camera: component });
                this.gameObject.addChild(cameraIcon.gameObject);
                this.cameraIconMap.set(component, cameraIcon);
            }
        };
        EditorComponent.prototype.removeComponent = function (component) {
            if (component instanceof feng3d.DirectionalLight) {
                Object.setValue(this.directionLightIconMap.get(component), { light: null }).gameObject.remove();
                this.directionLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.PointLight) {
                Object.setValue(this.pointLightIconMap.get(component), { light: null }).gameObject.remove();
                this.pointLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.SpotLight) {
                Object.setValue(this.spotLightIconMap.get(component), { light: null }).gameObject.remove();
                this.spotLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.Camera) {
                Object.setValue(this.cameraIconMap.get(component), { camera: null }).gameObject.remove();
                this.cameraIconMap.delete(component);
            }
        };
        return EditorComponent;
    }(feng3d.Component));
    exports.EditorComponent = EditorComponent;
});
//# sourceMappingURL=EditorComponent.js.map