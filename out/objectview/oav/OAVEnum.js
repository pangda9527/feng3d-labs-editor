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
    var OAVEnum = /** @class */ (function (_super) {
        __extends(OAVEnum, _super);
        function OAVEnum(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVEnum";
            return _this;
        }
        Object.defineProperty(OAVEnum.prototype, "enumClass", {
            set: function (obj) {
                this.list = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (isNaN(Number(key)))
                            this.list.push({ label: key, value: obj[key] });
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        OAVEnum.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.combobox.addEventListener(egret.Event.CHANGE, this.onComboxChange, this);
            }
            this.combobox.touchEnabled = this.combobox.touchChildren = this._attributeViewInfo.editable;
        };
        OAVEnum.prototype.dispose = function () {
            this.combobox.removeEventListener(egret.Event.CHANGE, this.onComboxChange, this);
        };
        OAVEnum.prototype.updateView = function () {
            var _this = this;
            this.combobox.dataProvider = this.list;
            if (this.list) {
                this.combobox.data = this.list.reduce(function (prevalue, item) {
                    if (prevalue)
                        return prevalue;
                    if (item.value == _this.attributeValue)
                        return item;
                    return null;
                }, null);
            }
        };
        OAVEnum.prototype.onComboxChange = function () {
            this.attributeValue = this.combobox.data.value;
        };
        OAVEnum = __decorate([
            feng3d.OAVComponent()
        ], OAVEnum);
        return OAVEnum;
    }(OAVBase_1.OAVBase));
    exports.OAVEnum = OAVEnum;
});
//# sourceMappingURL=OAVEnum.js.map