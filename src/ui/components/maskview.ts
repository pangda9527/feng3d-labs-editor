module feng3d.editor
{
    export var maskview = {
        mask: mask,
    };

    function mask(displayObject: egret.DisplayObject)
    {
        var maskReck = new eui.Rect();
        maskReck.alpha = 0;
        if (displayObject.stage)
        {
            onAddedToStage();
        } else
        {
            displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
        }

        function onAddedToStage()
        {
            maskReck.width = displayObject.stage.stageWidth;
            maskReck.height = displayObject.stage.stageHeight;
            editorui.popupLayer.addChildAt(maskReck, 0);
            //
            maskReck.addEventListener(MouseEvent.CLICK, removeDisplayObject, null);
            displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
        }

        function removeDisplayObject()
        {
            if (displayObject.parent)
                displayObject.parent.removeChild(displayObject);
        }

        function onRemoveFromStage()
        {
            maskReck.removeEventListener(MouseEvent.CLICK, removeDisplayObject, null);
            displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
            if (maskReck.parent)
            {
                maskReck.parent.removeChild(maskReck);
            }
        }

        function unmask()
        {
            displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
        }
        return unmask;
    }
}