module feng3d.editor
{
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    export var popupview = {
        popup: popup
    };

    function popup<T>(object: T, closecallback?: (object: T) => void, param?: { width?: number, height?: number })
    {
        param = param || {};
        var view: eui.Component = objectview.getObjectView(object);
        var background = new eui.Rect(param.width || 300, param.height || 300, 0xf0f0f0);
        view.addChildAt(background, 0);
        maskview.mask(view);
        view.x = (editorui.stage.stageWidth - view.width) / 2;
        view.y = (editorui.stage.stageHeight - view.height) / 2;
        editorui.popupLayer.addChild(view);

        view.addEventListener(egret.Event.REMOVED_FROM_STAGE, removefromstage, null);

        function removefromstage()
        {
            view.removeEventListener(egret.Event.REMOVED_FROM_STAGE, removefromstage, null);
            closecallback && closecallback(object);
        }
    }
}