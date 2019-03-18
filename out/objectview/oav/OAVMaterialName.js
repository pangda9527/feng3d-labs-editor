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
define(["require", "exports", "./OAVBase"], function (require, exports, OAVBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OAVMaterialName = /** @class */ (function (_super) {
        __extends(OAVMaterialName, _super);
        function OAVMaterialName(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OVMaterial";
            return _this;
        }
        OAVMaterialName.prototype.initView = function () {
            this.shaderComboBox.addEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            feng3d.dispatcher.on("asset.shaderChanged", this.onShaderComboBoxChange, this);
            this.shaderComboBox.touchChildren = this.shaderComboBox.touchEnabled = this._attributeViewInfo.editable;
        };
        OAVMaterialName.prototype.dispose = function () {
            this.shaderComboBox.removeEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            feng3d.dispatcher.off("asset.shaderChanged", this.onShaderComboBoxChange, this);
        };
        OAVMaterialName.prototype.updateView = function () {
            var material = this.space;
            this.nameLabel.text = material.shaderName;
            var data = feng3d.shaderlib.getShaderNames().sort().map(function (v) { return { label: v, value: v }; });
            var selected = data.reduce(function (prevalue, item) {
                if (prevalue)
                    return prevalue;
                if (item.value == material.shaderName)
                    return item;
                return null;
            }, null);
            this.shaderComboBox.dataProvider = data;
            this.shaderComboBox.data = selected;
        };
        OAVMaterialName.prototype.onShaderComboBoxChange = function () {
            this.attributeValue = this.shaderComboBox.data.value;
            this.objectView.space = this.space;
        };
        OAVMaterialName = __decorate([
            feng3d.OAVComponent()
        ], OAVMaterialName);
        return OAVMaterialName;
    }(OAVBase_1.OAVBase));
    exports.OAVMaterialName = OAVMaterialName;
});
//# sourceMappingURL=OAVMaterialName.js.map