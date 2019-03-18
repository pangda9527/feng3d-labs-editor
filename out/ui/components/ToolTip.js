"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var editorui_1 = require("../../global/editorui");
var TipString_1 = require("./tipviews/TipString");
var ToolTip = /** @class */ (function () {
    function ToolTip() {
        /**
         * 默认 提示界面
         */
        this.defaultTipview = function () { return TipString_1.TipString; };
        /**
         * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
         */
        this.tipviewmap = new Map();
        this.tipmap = new Map();
    }
    ToolTip.prototype.register = function (displayObject, tip) {
        if (!displayObject)
            return;
        this.tipmap.set(displayObject, tip);
        displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
    };
    ToolTip.prototype.unregister = function (displayObject) {
        if (!displayObject)
            return;
        this.tipmap.delete(displayObject);
        displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
    };
    ToolTip.prototype.onMouseOver = function (event) {
        this.removeTipview();
        var displayObject = event.currentTarget;
        var tip = this.tipmap.get(displayObject);
        var tipviewcls = this.tipviewmap.get(tip.constructor);
        if (!tipviewcls)
            tipviewcls = this.defaultTipview();
        this.tipView = new tipviewcls();
        editorui_1.editorui.tooltipLayer.addChild(this.tipView);
        this.tipView.value = tip;
        this.tipView.x = feng3d.windowEventProxy.clientX;
        this.tipView.y = feng3d.windowEventProxy.clientY - this.tipView.height;
        //
        displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
    };
    ToolTip.prototype.onMouseOut = function (event) {
        var displayObject = event.currentTarget;
        displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        this.removeTipview();
    };
    ToolTip.prototype.removeTipview = function () {
        if (this.tipView) {
            this.tipView.parent.removeChild(this.tipView);
            this.tipView = null;
        }
    };
    return ToolTip;
}());
exports.ToolTip = ToolTip;
exports.toolTip = new ToolTip();
//# sourceMappingURL=ToolTip.js.map