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
/**
 * 区域选择框
 */
var AreaSelectRect = /** @class */ (function (_super) {
    __extends(AreaSelectRect, _super);
    function AreaSelectRect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fillAlpha = 0.5;
        _this.fillColor = 0x8888ff;
        return _this;
    }
    /**
     * 显示
     * @param start 起始位置
     * @param end 结束位置
     */
    AreaSelectRect.prototype.show = function (start, end) {
        var minX = Math.min(start.x, end.x);
        var maxX = Math.max(start.x, end.x);
        var minY = Math.min(start.y, end.y);
        var maxY = Math.max(start.y, end.y);
        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        editorui_1.editorui.popupLayer.addChild(this);
    };
    /**
     * 隐藏
     */
    AreaSelectRect.prototype.hide = function () {
        this.parent && this.parent.removeChild(this);
    };
    return AreaSelectRect;
}(eui.Rect));
exports.AreaSelectRect = AreaSelectRect;
exports.areaSelectRect = new AreaSelectRect();
//# sourceMappingURL=AreaSelectRect.js.map