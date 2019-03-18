"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var editorui_1 = require("../../global/editorui");
var Maskview_1 = require("./Maskview");
/**
 * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
 */
var Popupview = /** @class */ (function () {
    function Popupview() {
    }
    Popupview.prototype.popupObject = function (object, closecallback, x, y, width, height) {
        var view = feng3d.objectview.getObjectView(object);
        var background = new eui.Rect(width || 300, height || 300, 0xf0f0f0);
        view.addChildAt(background, 0);
        //
        this.popupView(view, function () {
            closecallback && closecallback(object);
        }, x, y, width, height);
    };
    Popupview.prototype.popupView = function (view, closecallback, x, y, width, height) {
        editorui_1.editorui.popupLayer.addChild(view);
        if (width !== undefined)
            view.width = width;
        if (height !== undefined)
            view.height = height;
        var x0 = (editorui_1.editorui.stage.stageWidth - view.width) / 2;
        var y0 = (editorui_1.editorui.stage.stageHeight - view.height) / 2;
        if (x !== undefined) {
            x0 = x;
        }
        if (y !== undefined) {
            y0 = y;
        }
        x0 = feng3d.FMath.clamp(x0, 0, editorui_1.editorui.popupLayer.stage.stageWidth - view.width);
        y0 = feng3d.FMath.clamp(y0, 0, editorui_1.editorui.popupLayer.stage.stageHeight - view.height);
        view.x = x0;
        view.y = y0;
        Maskview_1.maskview.mask(view, function () {
            closecallback && closecallback();
        });
    };
    return Popupview;
}());
exports.Popupview = Popupview;
;
exports.popupview = new Popupview();
//# sourceMappingURL=Popupview.js.map