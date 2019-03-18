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
    var OAVGameObjectName = /** @class */ (function (_super) {
        __extends(OAVGameObjectName, _super);
        function OAVGameObjectName(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVGameObjectName";
            return _this;
        }
        OAVGameObjectName.prototype.initView = function () {
            this.visibleCB.addEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.addEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVGameObjectName.prototype.dispose = function () {
            this.visibleCB.removeEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.removeEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVGameObjectName.prototype.updateView = function () {
            this.visibleCB.selected = this.space.visible;
            this.mouseEnabledCB.selected = this.space.mouseEnabled;
            this.nameInput.text = this.space.name;
        };
        OAVGameObjectName.prototype.onVisibleCBClick = function () {
            this.space.visible = !this.space.visible;
        };
        OAVGameObjectName.prototype.onMouseEnabledCBClick = function () {
            this.space.mouseEnabled = !this.space.mouseEnabled;
        };
        OAVGameObjectName.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        OAVGameObjectName.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
        };
        OAVGameObjectName.prototype.onTextChange = function () {
            if (this._textfocusintxt) {
                this.space.name = this.nameInput.text;
            }
        };
        OAVGameObjectName = __decorate([
            feng3d.OAVComponent()
        ], OAVGameObjectName);
        return OAVGameObjectName;
    }(OAVBase_1.OAVBase));
    exports.OAVGameObjectName = OAVGameObjectName;
});
//# sourceMappingURL=OAVGameObjectName.js.map