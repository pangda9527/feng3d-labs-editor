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
var OAVBase_1 = require("./OAVBase");
var OAVAccordionObjectView = /** @class */ (function (_super) {
    __extends(OAVAccordionObjectView, _super);
    /**
     * 对象界面数据
     */
    function OAVAccordionObjectView(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.skinName = "ParticleComponentView";
        return _this;
    }
    /**
     * 更新界面
     */
    OAVAccordionObjectView.prototype.updateView = function () {
        this.updateEnableCB();
        if (this.componentView)
            this.componentView.updateView();
    };
    OAVAccordionObjectView.prototype.initView = function () {
        var componentName = feng3d.classUtils.getQualifiedClassName(this.attributeValue).split(".").pop();
        this.accordion.titleName = componentName;
        this.componentView = feng3d.objectview.getObjectView(this.attributeValue, { autocreate: false, excludeAttrs: ["enabled"] });
        this.accordion.addContent(this.componentView);
        this.enabledCB = this.accordion["enabledCB"];
        this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
        feng3d.watcher.watch(this.attributeValue, "enabled", this.updateEnableCB, this);
        this.updateView();
    };
    OAVAccordionObjectView.prototype.dispose = function () {
        this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
        feng3d.watcher.unwatch(this.attributeValue, "enabled", this.updateEnableCB, this);
    };
    OAVAccordionObjectView.prototype.updateEnableCB = function () {
        this.enabledCB.selected = this.attributeValue.enabled;
    };
    OAVAccordionObjectView.prototype.onEnableCBChange = function () {
        this.attributeValue.enabled = this.enabledCB.selected;
    };
    OAVAccordionObjectView = __decorate([
        feng3d.OAVComponent()
    ], OAVAccordionObjectView);
    return OAVAccordionObjectView;
}(OAVBase_1.OAVBase));
exports.OAVAccordionObjectView = OAVAccordionObjectView;
//# sourceMappingURL=OAVAccordionObjectView.js.map