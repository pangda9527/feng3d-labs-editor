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
Object.defineProperty(exports, "__esModule", { value: true });
var NumberTextInputBinder_1 = require("./NumberTextInputBinder");
var NumberSliderTextInputBinder = /** @class */ (function (_super) {
    __extends(NumberSliderTextInputBinder, _super);
    function NumberSliderTextInputBinder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberSliderTextInputBinder.prototype.initView = function () {
        _super.prototype.initView.call(this);
        if (this.editable) {
            this.slider.addEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
        }
        this.slider.enabled = this.slider.touchEnabled = this.slider.touchChildren = this.editable;
    };
    NumberSliderTextInputBinder.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.slider.removeEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
    };
    NumberSliderTextInputBinder.prototype.updateView = function () {
        _super.prototype.updateView.call(this);
        this.slider.minimum = isNaN(this.minValue) ? Number.MIN_VALUE : this.minValue;
        this.slider.maximum = isNaN(this.maxValue) ? Number.MAX_VALUE : this.maxValue;
        this.slider.snapInterval = this.step;
        this.slider.value = this.space[this.attribute];
    };
    NumberSliderTextInputBinder.prototype._onSliderChanged = function () {
        this.space[this.attribute] = this.slider.value;
    };
    return NumberSliderTextInputBinder;
}(NumberTextInputBinder_1.NumberTextInputBinder));
exports.NumberSliderTextInputBinder = NumberSliderTextInputBinder;
//# sourceMappingURL=NumberSliderTextInputBinder.js.map