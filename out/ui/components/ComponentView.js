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
define(["require", "exports", "./Menu"], function (require, exports, Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComponentView = /** @class */ (function (_super) {
        __extends(ComponentView, _super);
        /**
         * 对象界面数据
         */
        function ComponentView(component) {
            var _this = _super.call(this) || this;
            _this.component = component;
            component.on("refreshView", _this.onRefreshView, _this);
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ComponentSkin";
            return _this;
        }
        /**
         * 更新界面
         */
        ComponentView.prototype.updateView = function () {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        };
        ComponentView.prototype.onComplete = function () {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.componentIcon = this.accordion["componentIcon"];
            this.helpBtn = this.accordion["helpBtn"];
            this.operationBtn = this.accordion["operationBtn"];
            if (this.component instanceof feng3d.Transform) {
                this.componentIcon.source = "Transform_png";
            }
            else if (this.component instanceof feng3d.Water) {
                this.componentIcon.source = "Water_png";
            }
            else if (this.component instanceof feng3d.Terrain) {
                this.componentIcon.source = "Terrain_png";
            }
            else if (this.component instanceof feng3d.Model) {
                this.componentIcon.source = "Model_png";
            }
            else if (this.component instanceof feng3d.ScriptComponent) {
                this.componentIcon.source = "ScriptComponent_png";
            }
            else if (this.component instanceof feng3d.Camera) {
                this.componentIcon.source = "Camera_png";
            }
            else if (this.component instanceof feng3d.AudioSource) {
                this.componentIcon.source = "AudioSource_png";
            }
            else if (this.component instanceof feng3d.SpotLight) {
                this.componentIcon.source = "SpotLight_png";
            }
            else if (this.component instanceof feng3d.PointLight) {
                this.componentIcon.source = "PointLight_png";
            }
            else if (this.component instanceof feng3d.DirectionalLight) {
                this.componentIcon.source = "DirectionalLight_png";
            }
            else if (this.component instanceof feng3d.FPSController) {
                this.componentIcon.source = "FPSController_png";
            }
            else if (this.component instanceof feng3d.AudioListener) {
                this.componentIcon.source = "AudioListener_png";
            }
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage)
                this.onAddToStage();
        };
        ComponentView.prototype.onDeleteButton = function (event) {
            if (this.component.gameObject)
                this.component.gameObject.removeComponent(this.component);
        };
        ComponentView.prototype.onAddToStage = function () {
            this.initScriptView();
            this.updateView();
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
            this.operationBtn.addEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
            this.helpBtn.addEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
            feng3d.dispatcher.on("asset.scriptChanged", this.onScriptChanged, this);
        };
        ComponentView.prototype.onRemovedFromStage = function () {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
            this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
            this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
            feng3d.dispatcher.off("asset.scriptChanged", this.onScriptChanged, this);
        };
        ComponentView.prototype.onRefreshView = function () {
            this.accordion.removeContent(this.componentView);
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
        };
        ComponentView.prototype.updateEnableCB = function () {
            if (this.component instanceof feng3d.Behaviour) {
                this.enabledCB.selected = this.component.enabled;
                this.enabledCB.visible = true;
            }
            else {
                this.enabledCB.visible = false;
            }
        };
        ComponentView.prototype.onEnableCBChange = function () {
            if (this.component instanceof feng3d.Behaviour) {
                this.component.enabled = this.enabledCB.selected;
            }
        };
        ComponentView.prototype.initScriptView = function () {
            // 初始化Script属性面板
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.watch(this.component, "scriptName", this.onScriptChanged, this);
                var component = this.component;
                if (component.scriptInstance) {
                    this.scriptView = feng3d.objectview.getObjectView(component.scriptInstance, { autocreate: false });
                    this.accordion.addContent(this.scriptView);
                }
            }
        };
        ComponentView.prototype.removeScriptView = function () {
            // 移除Script属性面板
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.unwatch(this.component, "scriptName", this.onScriptChanged, this);
            }
            if (this.scriptView) {
                if (this.scriptView.parent)
                    this.scriptView.parent.removeChild(this.scriptView);
            }
        };
        ComponentView.prototype.onOperationBtnClick = function () {
            var _this = this;
            var menus = [];
            if (!(this.component instanceof feng3d.Transform)) {
                menus.push({
                    label: "移除组件",
                    click: function () {
                        if (_this.component.gameObject)
                            _this.component.gameObject.removeComponent(_this.component);
                    }
                });
            }
            Menu_1.menu.popup(menus);
        };
        ComponentView.prototype.onHelpBtnClick = function () {
            window.open("http://feng3d.gitee.io/#/script");
        };
        ComponentView.prototype.onScriptChanged = function () {
            var _this = this;
            setTimeout(function () {
                _this.removeScriptView();
                _this.initScriptView();
            }, 10);
        };
        return ComponentView;
    }(eui.Component));
    exports.ComponentView = ComponentView;
});
//# sourceMappingURL=ComponentView.js.map