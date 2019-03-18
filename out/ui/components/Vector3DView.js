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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector3DView = /** @class */ (function (_super) {
        __extends(Vector3DView, _super);
        function Vector3DView() {
            var _this = _super.call(this) || this;
            _this._vm = new feng3d.Vector3(1, 2, 3);
            _this._showw = false;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "Vector3DViewSkin";
            return _this;
        }
        Object.defineProperty(Vector3DView.prototype, "vm", {
            get: function () {
                return this._vm;
            },
            set: function (v) {
                if (v)
                    this._vm = v;
                else
                    this._vm = new feng3d.Vector3(1, 2, 3);
                this.showw = v instanceof feng3d.Vector4;
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3DView.prototype, "showw", {
            set: function (value) {
                if (this._showw == value)
                    return;
                this._showw = value;
                this.skin.currentState = this._showw ? "showw" : "default";
            },
            enumerable: true,
            configurable: true
        });
        Vector3DView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        Vector3DView.prototype.onAddedToStage = function () {
            var _this = this;
            this.skin.currentState = this._showw ? "showw" : "default";
            this.updateView();
            [this.xTextInput, this.yTextInput, this.zTextInput, this.wTextInput].forEach(function (item) {
                _this.addItemEventListener(item);
            });
        };
        Vector3DView.prototype.onRemovedFromStage = function () {
            var _this = this;
            [this.xTextInput, this.yTextInput, this.zTextInput, this.wTextInput].forEach(function (item) {
                _this.removeItemEventListener(item);
            });
        };
        Vector3DView.prototype.addItemEventListener = function (input) {
            input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        Vector3DView.prototype.removeItemEventListener = function (input) {
            input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        Vector3DView.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        Vector3DView.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.updateView();
        };
        Vector3DView.prototype.updateView = function () {
            if (this._textfocusintxt)
                return;
            if (!this.xTextInput)
                return;
            this.xTextInput.text = "" + this.vm.x;
            this.yTextInput.text = "" + this.vm.y;
            this.zTextInput.text = "" + this.vm.z;
            if (this.vm instanceof feng3d.Vector4)
                this.wTextInput.text = "" + this.vm.w;
        };
        Vector3DView.prototype.onTextChange = function (event) {
            if (!this._textfocusintxt)
                return;
            switch (event.currentTarget) {
                case this.xTextInput:
                    this.vm.x = Number(this.xTextInput.text);
                    break;
                case this.yTextInput:
                    this.vm.y = Number(this.yTextInput.text);
                    break;
                case this.zTextInput:
                    this.vm.z = Number(this.zTextInput.text);
                    break;
                case this.wTextInput:
                    if (this.vm instanceof feng3d.Vector4)
                        this.wTextInput.text = "" + this.vm.w;
                    break;
            }
        };
        return Vector3DView;
    }(eui.Component));
    exports.Vector3DView = Vector3DView;
});
//# sourceMappingURL=Vector3DView.js.map