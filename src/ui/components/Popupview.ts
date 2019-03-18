namespace editor
{
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    export var popupview: Popupview;

    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    export class Popupview
    {

        popupObject<T>(object: T, closecallback?: (object: T) => void, x?: number, y?: number, width?: number, height?: number)
        {
            var view: eui.Component = feng3d.objectview.getObjectView(object);
            var background = new eui.Rect(width || 300, height || 300, 0xf0f0f0);
            view.addChildAt(background, 0);

            //
            this.popupView(view, () =>
            {
                closecallback && closecallback(object);
            }, x, y, width, height);
        }

        popupView(view: eui.Component, closecallback?: () => void, x?: number, y?: number, width?: number, height?: number)
        {
            editorui.popupLayer.addChild(view);

            if (width !== undefined)
                view.width = width;

            if (height !== undefined)
                view.height = height;

            var x0 = (editorui.stage.stageWidth - view.width) / 2;
            var y0 = (editorui.stage.stageHeight - view.height) / 2;
            if (x !== undefined)
            {
                x0 = x;
            }
            if (y !== undefined)
            {
                y0 = y;
            }

            x0 = feng3d.FMath.clamp(x0, 0, editorui.popupLayer.stage.stageWidth - view.width);
            y0 = feng3d.FMath.clamp(y0, 0, editorui.popupLayer.stage.stageHeight - view.height);

            view.x = x0;
            view.y = y0;

            maskview.mask(view, () =>
            {
                closecallback && closecallback();
            });
        }
    };

    popupview = new Popupview();
}