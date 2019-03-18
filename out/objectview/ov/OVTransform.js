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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OVTransform = /** @class */ (function (_super) {
        __extends(OVTransform, _super);
        function OVTransform(objectViewInfo) {
            var _this = _super.call(this) || this;
            _this._objectViewInfo = objectViewInfo;
            _this._space = objectViewInfo.owner;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "OVTransform";
            return _this;
        }
        OVTransform.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
            this.updateView();
        };
        OVTransform.prototype.onAddedToStage = function () {
            var _this = this;
            this._space.on("transformChanged", this.updateView, this);
            //
            this.updateView();
            [this.xTextInput, this.yTextInput, this.zTextInput, this.rxTextInput, this.ryTextInput, this.rzTextInput, this.sxTextInput, this.syTextInput, this.szTextInput,].forEach(function (item) {
                _this.addItemEventListener(item);
            });
        };
        OVTransform.prototype.onRemovedFromStage = function () {
            var _this = this;
            this._space.off("transformChanged", this.updateView, this);
            //
            [this.xTextInput, this.yTextInput, this.zTextInput, this.rxTextInput, this.ryTextInput, this.rzTextInput, this.sxTextInput, this.syTextInput, this.szTextInput,].forEach(function (item) {
                _this.removeItemEventListener(item);
            });
        };
        OVTransform.prototype.addItemEventListener = function (input) {
            input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        OVTransform.prototype.removeItemEventListener = function (input) {
            input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        OVTransform.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        OVTransform.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.updateView();
        };
        OVTransform.prototype.onTextChange = function (event) {
            if (!this._textfocusintxt)
                return;
            var transfrom = this.space;
            var value = 0;
            if (event.currentTarget.text != undefined) {
                value = Number(event.currentTarget.text);
                value = isNaN(value) ? 0 : value;
            }
            switch (event.currentTarget) {
                case this.xTextInput:
                    transfrom.x = value;
                    break;
                case this.yTextInput:
                    transfrom.y = value;
                    break;
                case this.zTextInput:
                    transfrom.z = value;
                    break;
                case this.rxTextInput:
                    transfrom.rx = value;
                    break;
                case this.ryTextInput:
                    transfrom.ry = value;
                    break;
                case this.rzTextInput:
                    transfrom.rz = value;
                    break;
                case this.sxTextInput:
                    transfrom.sx = value ? value : 1;
                    break;
                case this.syTextInput:
                    transfrom.sy = value ? value : 1;
                    break;
                case this.szTextInput:
                    transfrom.sz = value ? value : 1;
                    break;
            }
        };
        Object.defineProperty(OVTransform.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                if (this._space)
                    this._space.off("transformChanged", this.updateView, this);
                this._space = value;
                if (this._space)
                    this._space.on("transformChanged", this.updateView, this);
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        OVTransform.prototype.getAttributeView = function (attributeName) {
            return null;
        };
        OVTransform.prototype.getblockView = function (blockName) {
            return null;
        };
        /**
         * 更新界面
         */
        OVTransform.prototype.updateView = function () {
            if (this._textfocusintxt)
                return;
            var transfrom = this.space;
            if (!transfrom)
                return;
            this.xTextInput.text = "" + transfrom.x;
            this.yTextInput.text = "" + transfrom.y;
            this.zTextInput.text = "" + transfrom.z;
            this.rxTextInput.text = "" + transfrom.rx;
            this.ryTextInput.text = "" + transfrom.ry;
            this.rzTextInput.text = "" + transfrom.rz;
            this.sxTextInput.text = "" + transfrom.sx;
            this.syTextInput.text = "" + transfrom.sy;
            this.szTextInput.text = "" + transfrom.sz;
        };
        OVTransform = __decorate([
            feng3d.OVComponent()
        ], OVTransform);
        return OVTransform;
    }(eui.Component));
    exports.OVTransform = OVTransform;
});
//# sourceMappingURL=OVTransform.js.map