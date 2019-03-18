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
    var OAVMinMaxCurveVector3 = /** @class */ (function (_super) {
        __extends(OAVMinMaxCurveVector3, _super);
        function OAVMinMaxCurveVector3(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMinMaxCurveVector3";
            return _this;
        }
        OAVMinMaxCurveVector3.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveVector3View.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxCurveVector3View.minMaxCurveVector3 = this.attributeValue;
            this.minMaxCurveVector3View.touchEnabled = this.minMaxCurveVector3View.touchChildren = this._attributeViewInfo.editable;
        };
        OAVMinMaxCurveVector3.prototype.dispose = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveVector3View.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        };
        OAVMinMaxCurveVector3.prototype.updateView = function () {
        };
        OAVMinMaxCurveVector3.prototype.onChange = function () {
        };
        OAVMinMaxCurveVector3 = __decorate([
            feng3d.OAVComponent()
        ], OAVMinMaxCurveVector3);
        return OAVMinMaxCurveVector3;
    }(OAVBase));
    editor.OAVMinMaxCurveVector3 = OAVMinMaxCurveVector3;
})(editor || (editor = {}));
//# sourceMappingURL=OAVMinMaxCurveVector3.js.map