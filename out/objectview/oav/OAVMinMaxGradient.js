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
var editor;
(function (editor) {
    var OAVMinMaxGradient = /** @class */ (function (_super) {
        __extends(OAVMinMaxGradient, _super);
        function OAVMinMaxGradient(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMinMaxGradient";
            return _this;
        }
        OAVMinMaxGradient.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxGradientView.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxGradientView.minMaxGradient = this.attributeValue;
            this.minMaxGradientView.touchEnabled = this.minMaxGradientView.touchChildren = this._attributeViewInfo.editable;
        };
        OAVMinMaxGradient.prototype.dispose = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxGradientView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        };
        OAVMinMaxGradient.prototype.updateView = function () {
        };
        OAVMinMaxGradient.prototype.onChange = function () {
        };
        OAVMinMaxGradient = __decorate([
            feng3d.OAVComponent()
        ], OAVMinMaxGradient);
        return OAVMinMaxGradient;
    }(OAVBase));
    editor.OAVMinMaxGradient = OAVMinMaxGradient;
})(editor || (editor = {}));
//# sourceMappingURL=OAVMinMaxGradient.js.map