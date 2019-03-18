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
    var OAVFunction = /** @class */ (function (_super) {
        __extends(OAVFunction, _super);
        function OAVFunction(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVFunction";
            return _this;
        }
        OAVFunction.prototype.initView = function () {
            this.button.addEventListener(egret.MouseEvent.CLICK, this.click, this);
        };
        OAVFunction.prototype.dispose = function () {
            this.button.removeEventListener(egret.MouseEvent.CLICK, this.click, this);
        };
        OAVFunction.prototype.updateView = function () {
        };
        OAVFunction.prototype.click = function (event) {
            this._space[this._attributeName]();
        };
        OAVFunction = __decorate([
            feng3d.OAVComponent()
        ], OAVFunction);
        return OAVFunction;
    }(OAVBase_1.OAVBase));
    exports.OAVFunction = OAVFunction;
});
//# sourceMappingURL=OAVFunction.js.map