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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ParticleComponentView = /** @class */ (function (_super) {
        __extends(ParticleComponentView, _super);
        /**
         * 对象界面数据
         */
        function ParticleComponentView(component) {
            var _this = _super.call(this) || this;
            _this.component = component;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ParticleComponentView";
            return _this;
        }
        /**
         * 更新界面
         */
        ParticleComponentView.prototype.updateView = function () {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        };
        ParticleComponentView.prototype.onComplete = function () {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage)
                this.onAddToStage();
        };
        ParticleComponentView.prototype.onAddToStage = function () {
            this.updateView();
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
        };
        ParticleComponentView.prototype.onRemovedFromStage = function () {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
        };
        ParticleComponentView.prototype.updateEnableCB = function () {
            this.enabledCB.selected = this.component.enabled;
        };
        ParticleComponentView.prototype.onEnableCBChange = function () {
            this.component.enabled = this.enabledCB.selected;
        };
        return ParticleComponentView;
    }(eui.Component));
    exports.ParticleComponentView = ParticleComponentView;
});
//# sourceMappingURL=ParticleComponentView.js.map