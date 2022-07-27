import { shortcut, ticker } from 'feng3d';
import { editorui } from '../../global/editorui';

/**
 * 在界面后面添加一层透明界面，当点击到透明界面时关闭界面。
 */
export class Maskview
{
    mask(displayObject: egret.DisplayObject)
    {
        const maskReck = new eui.Rect();
        maskReck.alpha = 0;
        if (displayObject.stage)
        {
            onAddedToStage();
        }
        else
        {
            displayObject.once(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
        }

        function onAddedToStage()
        {
            maskReck.width = displayObject.stage.stageWidth;
            maskReck.height = displayObject.stage.stageHeight;
            const index = displayObject.parent.getChildIndex(displayObject);
            editorui.popupLayer.addChildAt(maskReck, index);
            //
            maskReck.addEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
            displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);

            shortcut.activityState('inModal');
        }

        function removeDisplayObject()
        {
            if (displayObject.parent)
            { displayObject.parent.removeChild(displayObject); }
        }

        function onRemoveFromStage()
        {
            maskReck.removeEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
            displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
            if (maskReck.parent)
            {
                maskReck.parent.removeChild(maskReck);
            }
            ticker.nextframe(() =>
            {
                shortcut.deactivityState('inModal');
            });
        }
    }
}

export const maskview = new Maskview();
