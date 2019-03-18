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
var editorui_1 = require("../../global/editorui");
var Maskview_1 = require("./Maskview");
/**
 * 下拉列表
 */
var ComboBox = /** @class */ (function (_super) {
    __extends(ComboBox, _super);
    function ComboBox() {
        var _this = _super.call(this) || this;
        /**
         * 数据
         */
        _this.dataProvider = [];
        _this.skinName = "ComboBoxSkin";
        return _this;
    }
    Object.defineProperty(ComboBox.prototype, "data", {
        /**
         * 选中数据
         */
        get: function () {
            return this._data;
        },
        set: function (v) {
            this._data = v;
            if (this.label) {
                if (this._data)
                    this.label.text = this._data.label;
                else
                    this.label.text = "";
            }
        },
        enumerable: true,
        configurable: true
    });
    ComboBox.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.init();
        this.updateview();
        this.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        this.list.addEventListener(egret.Event.CHANGE, this.onlistChange, this);
    };
    ComboBox.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        this.list.removeEventListener(egret.Event.CHANGE, this.onlistChange, this);
    };
    ComboBox.prototype.init = function () {
        this.list = new eui.List();
        this.list.itemRenderer = eui.ItemRenderer;
    };
    ComboBox.prototype.updateview = function () {
        if (this.data == null && this.dataProvider != null)
            this.data = this.dataProvider[0];
        if (this.data)
            this.label.text = this.data.label;
        else
            this.label.text = "";
    };
    ComboBox.prototype.onClick = function () {
        if (!this.dataProvider)
            return;
        this.list.dataProvider = new eui.ArrayCollection(this.dataProvider);
        var rect = this.getTransformedBounds(this.stage);
        this.list.x = rect.left;
        this.list.y = rect.bottom;
        this.list.selectedIndex = this.dataProvider.indexOf(this.data);
        editorui_1.editorui.popupLayer.addChild(this.list);
        Maskview_1.maskview.mask(this.list);
    };
    ComboBox.prototype.onlistChange = function () {
        this.data = this.list.selectedItem;
        this.updateview();
        if (this.list.parent)
            this.list.parent.removeChild(this.list);
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    return ComboBox;
}(eui.Component));
exports.ComboBox = ComboBox;
//# sourceMappingURL=ComboBox.js.map