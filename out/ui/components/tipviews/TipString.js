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
/**
 * String 提示框
 */
var TipString = /** @class */ (function (_super) {
    __extends(TipString, _super);
    function TipString() {
        var _this = _super.call(this) || this;
        _this.value = "";
        _this.skinName = "TipString";
        _this.touchChildren = _this.touchEnabled = false;
        return _this;
    }
    TipString.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.txtLab.text = String(this.value);
    };
    TipString.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
    };
    TipString.prototype.valuechanged = function () {
        if (this.txtLab) {
            this.txtLab.text = String(this.value);
        }
    };
    __decorate([
        feng3d.watch("valuechanged")
    ], TipString.prototype, "value", void 0);
    return TipString;
}(eui.Component));
exports.TipString = TipString;
//# sourceMappingURL=TipString.js.map