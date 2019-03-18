define(["require", "exports", "../../global/editorui"], function (require, exports, editorui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Maskview = /** @class */ (function () {
        function Maskview() {
        }
        Maskview.prototype.mask = function (displayObject, onMaskClick) {
            if (onMaskClick === void 0) { onMaskClick = null; }
            var maskReck = new eui.Rect();
            maskReck.alpha = 0;
            if (displayObject.stage) {
                onAddedToStage();
            }
            else {
                displayObject.once(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
            }
            function onAddedToStage() {
                maskReck.width = displayObject.stage.stageWidth;
                maskReck.height = displayObject.stage.stageHeight;
                var index = displayObject.parent.getChildIndex(displayObject);
                editorui_1.editorui.popupLayer.addChildAt(maskReck, index);
                //
                maskReck.addEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                feng3d.shortcut.activityState("inModal");
            }
            function removeDisplayObject() {
                if (displayObject.parent)
                    displayObject.parent.removeChild(displayObject);
                onMaskClick && onMaskClick();
            }
            function onRemoveFromStage() {
                maskReck.removeEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                if (maskReck.parent) {
                    maskReck.parent.removeChild(maskReck);
                }
                feng3d.ticker.nextframe(function () {
                    feng3d.shortcut.deactivityState("inModal");
                });
            }
        };
        return Maskview;
    }());
    exports.Maskview = Maskview;
    ;
    exports.maskview = new Maskview();
});
//# sourceMappingURL=Maskview.js.map