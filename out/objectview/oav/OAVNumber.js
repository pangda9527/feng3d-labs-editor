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
define(["require", "exports", "./OAVBase", "../../ui/components/binders/NumberTextInputBinder"], function (require, exports, OAVBase_1, NumberTextInputBinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 默认对象属性界面
     */
    var OAVNumber = /** @class */ (function (_super) {
        __extends(OAVNumber, _super);
        function OAVNumber(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVNumber";
            return _this;
        }
        OAVNumber.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.addBinder(new NumberTextInputBinder_1.NumberTextInputBinder().init({
                space: this.space, attribute: this._attributeName, textInput: this.text, editable: this._attributeViewInfo.editable,
                controller: this.labelLab,
            }));
        };
        OAVNumber = __decorate([
            feng3d.OAVComponent()
        ], OAVNumber);
        return OAVNumber;
    }(OAVBase_1.OAVBase));
    exports.OAVNumber = OAVNumber;
});
//# sourceMappingURL=OAVNumber.js.map