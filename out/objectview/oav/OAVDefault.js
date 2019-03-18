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
var OAVBase_1 = require("./OAVBase");
var Drag_1 = require("../../ui/drag/Drag");
/**
 * 默认对象属性界面
 */
var OAVDefault = /** @class */ (function (_super) {
    __extends(OAVDefault, _super);
    function OAVDefault(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.skinName = "OAVDefault";
        return _this;
    }
    Object.defineProperty(OAVDefault.prototype, "dragparam", {
        set: function (param) {
            var _this = this;
            if (param) {
                //
                Drag_1.drag.register(this, function (dragsource) {
                    if (param.datatype)
                        dragsource[param.datatype] = _this.attributeValue;
                }, [param.accepttype], function (dragSource) {
                    _this.attributeValue = dragSource[param.accepttype];
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    OAVDefault.prototype.initView = function () {
        this.text.percentWidth = 100;
        this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
        this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        if (this._attributeViewInfo.editable)
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
    };
    OAVDefault.prototype.dispose = function () {
        Drag_1.drag.unregister(this);
        if (this._attributeViewInfo.editable)
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
        this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
    };
    OAVDefault.prototype.ontxtfocusin = function () {
        this._textfocusintxt = true;
    };
    OAVDefault.prototype.ontxtfocusout = function () {
        this._textfocusintxt = false;
    };
    /**
     * 更新界面
     */
    OAVDefault.prototype.updateView = function () {
        this.text.enabled = this._attributeViewInfo.editable;
        var value = this.attributeValue;
        if (value === undefined) {
            this.text.text = String(value);
        }
        else if (!(value instanceof Object)) {
            this.text.text = String(value);
        }
        else {
            var valuename = value["name"] || "";
            this.text.text = valuename + " (" + value.constructor.name + ")";
            this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.text.enabled = false;
        }
    };
    OAVDefault.prototype.onDoubleClick = function () {
        feng3d.dispatcher.dispatch("inspector.showData", this.attributeValue);
    };
    OAVDefault.prototype.onTextChange = function () {
        if (this._textfocusintxt) {
            switch (this._attributeType) {
                case "String":
                    this.attributeValue = this.text.text;
                    break;
                case "number":
                    var num = Number(this.text.text);
                    num = isNaN(num) ? 0 : num;
                    this.attributeValue = num;
                    break;
                case "Boolean":
                    this.attributeValue = Boolean(this.text.text);
                    break;
                default:
                    throw "\u65E0\u6CD5\u5904\u7406\u7C7B\u578B" + this._attributeType + "!";
            }
        }
    };
    OAVDefault = __decorate([
        feng3d.OAVComponent()
    ], OAVDefault);
    return OAVDefault;
}(OAVBase_1.OAVBase));
exports.OAVDefault = OAVDefault;
//# sourceMappingURL=OAVDefault.js.map