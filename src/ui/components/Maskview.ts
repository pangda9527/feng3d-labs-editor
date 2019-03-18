import { editorui } from "../../global/editorui";

export var maskview: Maskview;

export class Maskview
{
    mask(displayObject: egret.DisplayObject, onMaskClick: () => void = null)
    {
        var maskReck = new eui.Rect();
        maskReck.alpha = 0;
        if (displayObject.stage)
        {
            onAddedToStage();
        } else
        {
            displayObject.once(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
        }

        function onAddedToStage()
        {
            maskReck.width = displayObject.stage.stageWidth;
            maskReck.height = displayObject.stage.stageHeight;
            var index = displayObject.parent.getChildIndex(displayObject);
            editorui.popupLayer.addChildAt(maskReck, index);
            //
            maskReck.addEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
            displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);

            feng3d.shortcut.activityState("inModal");
        }

        function removeDisplayObject()
        {
            if (displayObject.parent)
                displayObject.parent.removeChild(displayObject);

            onMaskClick && onMaskClick();
        }

        function onRemoveFromStage()
        {
            maskReck.removeEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
            displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
            if (maskReck.parent)
            {
                maskReck.parent.removeChild(maskReck);
            }
            feng3d.ticker.nextframe(() =>
            {
                feng3d.shortcut.deactivityState("inModal");
            });
        }
    }
};

maskview = new Maskview();