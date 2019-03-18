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
eui.Component.prototype["addBinder"] = function () {
    var _this = this;
    var binders = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        binders[_i] = arguments[_i];
    }
    this._binders = this._binders || [];
    binders.forEach(function (v) {
        _this._binders.push(v);
    });
};
var old$onRemoveFromStage = eui.Component.prototype.$onRemoveFromStage;
eui.Component.prototype["$onRemoveFromStage"] = function () {
    if (this._binders) {
        this._binders.forEach(function (v) { return v.dispose(); });
        this._binders.length = 0;
    }
    old$onRemoveFromStage.call(this);
};
var TextInputBinder = /** @class */ (function (_super) {
    __extends(TextInputBinder, _super);
    function TextInputBinder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 是否可编辑
         */
        _this.editable = true;
        /**
         * 绑定属性值转换为文本
         */
        _this.toText = function (v) { return v; };
        /**
         * 文本转换为绑定属性值
         */
        _this.toValue = function (v) { return v; };
        return _this;
    }
    TextInputBinder.prototype.init = function (v) {
        Object.assign(this, v);
        //
        this.initView();
        this.updateView();
        //
        return this;
    };
    TextInputBinder.prototype.dispose = function () {
        feng3d.watcher.unwatch(this.space, this.attribute, this.onValueChanged, this);
        //
        this.textInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
        this.textInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        this.textInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
    };
    TextInputBinder.prototype.initView = function () {
        //
        if (this.editable) {
            feng3d.watcher.watch(this.space, this.attribute, this.onValueChanged, this);
            this.textInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.textInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        this.textInput.enabled = this.editable;
    };
    TextInputBinder.prototype.onValueChanged = function () {
        var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
        objectViewEvent.space = this.space;
        objectViewEvent.attributeName = this.attribute;
        objectViewEvent.attributeValue = this.space[this.attribute];
        this.textInput.dispatchEvent(objectViewEvent);
        this.dispatch("valueChanged");
        this.updateView();
    };
    TextInputBinder.prototype.updateView = function () {
        if (!this._textfocusintxt) {
            this.textInput.text = this.toText.call(this, this.space[this.attribute]);
        }
    };
    TextInputBinder.prototype.onTextChange = function () {
        this.space[this.attribute] = this.toValue.call(this, this.textInput.text);
    };
    TextInputBinder.prototype.ontxtfocusin = function () {
        this._textfocusintxt = true;
    };
    TextInputBinder.prototype.ontxtfocusout = function () {
        this._textfocusintxt = false;
        this.updateView();
    };
    return TextInputBinder;
}(feng3d.EventDispatcher));
exports.TextInputBinder = TextInputBinder;
//# sourceMappingURL=TextInputBinder.js.map