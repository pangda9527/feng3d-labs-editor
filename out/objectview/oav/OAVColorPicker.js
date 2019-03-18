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
    var OAVColorPicker = /** @class */ (function (_super) {
        __extends(OAVColorPicker, _super);
        function OAVColorPicker(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVColorPicker";
            return _this;
        }
        OAVColorPicker.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            this.colorPicker.touchEnabled = this.colorPicker.touchChildren = this.input.enabled = this._attributeViewInfo.editable;
        };
        OAVColorPicker.prototype.dispose = function () {
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVColorPicker.prototype.updateView = function () {
            var color = this.attributeValue;
            this.colorPicker.value = color;
            this.input.text = color.toHexString();
        };
        OAVColorPicker.prototype.onChange = function (event) {
            //
            this.attributeValue = this.colorPicker.value.clone();
            this.input.text = this.attributeValue.toHexString();
        };
        OAVColorPicker.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        OAVColorPicker.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.input.text = this.attributeValue.toHexString();
        };
        OAVColorPicker.prototype.onTextChange = function () {
            if (this._textfocusintxt) {
                var text = this.input.text;
                if (this.attributeValue instanceof feng3d.Color3) {
                    this.colorPicker.value = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                }
                else {
                    this.colorPicker.value = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                }
            }
        };
        OAVColorPicker = __decorate([
            feng3d.OAVComponent()
        ], OAVColorPicker);
        return OAVColorPicker;
    }(OAVBase_1.OAVBase));
    exports.OAVColorPicker = OAVColorPicker;
});
//# sourceMappingURL=OAVColorPicker.js.map