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
var OAVDefault_1 = require("./OAVDefault");
var OAVArray = /** @class */ (function (_super) {
    __extends(OAVArray, _super);
    function OAVArray(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.skinName = "OAVArray";
        return _this;
    }
    Object.defineProperty(OAVArray.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAVArray.prototype, "attributeName", {
        get: function () {
            return this._attributeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAVArray.prototype, "attributeValue", {
        get: function () {
            return this._space[this._attributeName];
        },
        set: function (value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
            }
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    OAVArray.prototype.initView = function () {
        this.attributeViews = [];
        var attributeValue = this.attributeValue;
        this.sizeTxt.text = this.attributeValue.length.toString();
        for (var i = 0; i < attributeValue.length; i++) {
            var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
            displayObject.percentWidth = 100;
            this.contentGroup.addChild(displayObject);
            this.attributeViews[i] = displayObject;
        }
        this.currentState = "hide";
        this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
    };
    OAVArray.prototype.dispose = function () {
        this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
        this.attributeViews = [];
        for (var i = 0; i < this.attributeViews.length; i++) {
            var displayObject = this.attributeViews[i];
            this.contentGroup.removeChild(displayObject);
        }
        this.attributeViews = null;
    };
    OAVArray.prototype.onTitleButtonClick = function () {
        this.currentState = this.currentState == "hide" ? "show" : "hide";
    };
    OAVArray.prototype.onsizeTxtfocusout = function () {
        var size = parseInt(this.sizeTxt.text);
        var attributeValue = this.attributeValue;
        var attributeViews = this.attributeViews;
        if (size != attributeValue.length) {
            for (var i = 0; i < attributeViews.length; i++) {
                if (attributeViews[i].parent) {
                    attributeViews[i].parent.removeChild(attributeViews[i]);
                }
            }
            attributeValue.length = size;
            for (var i = 0; i < size; i++) {
                if (attributeValue[i] == null && this._attributeViewInfo.componentParam)
                    attributeValue[i] = feng3d.lazy.getvalue(this._attributeViewInfo.componentParam.defaultItem);
                if (attributeViews[i] == null) {
                    var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
                    attributeViews[i] = displayObject;
                    displayObject.percentWidth = 100;
                }
                this.contentGroup.addChild(attributeViews[i]);
            }
        }
    };
    OAVArray = __decorate([
        feng3d.OAVComponent()
    ], OAVArray);
    return OAVArray;
}(OAVBase_1.OAVBase));
exports.OAVArray = OAVArray;
var OAVArrayItem = /** @class */ (function (_super) {
    __extends(OAVArrayItem, _super);
    function OAVArrayItem(arr, index, componentParam) {
        var _this = this;
        var attributeViewInfo = {
            name: index + "",
            editable: true,
            componentParam: componentParam,
            owner: arr,
            type: "number",
        };
        _this = _super.call(this, attributeViewInfo) || this;
        return _this;
    }
    OAVArrayItem.prototype.initView = function () {
        _super.prototype.initView.call(this);
        this.labelLab.width = 60;
    };
    return OAVArrayItem;
}(OAVDefault_1.OAVDefault));
exports.OAVArrayItem = OAVArrayItem;
//# sourceMappingURL=OAVArray.js.map