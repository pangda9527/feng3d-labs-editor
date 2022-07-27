import { objectview, mathUtil } from 'feng3d';
import { editorui } from '../../global/editorui';
import { maskview } from './Maskview';
import { WindowView } from './WindowView';

export interface PopupviewParam<T>
{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    /**
     * 默认为true
     */
    mode?: boolean;

    closecallback?: (object: T) => void;
}

/**
 * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
 */
export class Popupview
{
    /**
     * 弹出一个 objectview
     *
     * @param object
     * @param closecallback
     * @param param
     */
    popupObject<T>(object: T, param: PopupviewParam<T> = {})
    {
        const view: eui.Component = objectview.getObjectView(object);
        const background = new eui.Rect(param.width || 300, param.height || 300, 0xf0f0f0);
        view.addChildAt(background, 0);

        //
        if (param.closecallback)
        {
            const closecallback = param.closecallback;
            param.closecallback = () =>
            {
                closecallback && closecallback(object);
            };
        }
        this.popupView(view, param);
    }

    /**
     * 弹出一个界面
     *
     * @param view
     * @param param
     */
    popupView(view: eui.Component, param: PopupviewParam<any> = {})
    {
        editorui.popupLayer.addChild(view);

        if (param.width !== undefined)
            { view.width = param.width; }

        if (param.height !== undefined)
            { view.height = param.height; }

        let x0 = (editorui.stage.stageWidth - view.width) / 2;
        let y0 = (editorui.stage.stageHeight - view.height) / 2;
        if (param.x !== undefined)
        {
            x0 = param.x;
        }
        if (param.y !== undefined)
        {
            y0 = param.y;
        }

        x0 = mathUtil.clamp(x0, 0, editorui.popupLayer.stage.stageWidth - view.width);
        y0 = mathUtil.clamp(y0, 0, editorui.popupLayer.stage.stageHeight - view.height);

        view.x = x0;
        view.y = y0;

        if (param.closecallback)
        {
            view.addEventListener(egret.Event.REMOVED_FROM_STAGE, param.closecallback, null);
        }

        if (param.mode !== false) maskview.mask(view);
    }

    /**
     * 弹出一个包含objectview的窗口
     *
     * @param object
     * @param closecallback
     * @param param
     */
    popupObjectWindow<T>(object: T, param: PopupviewParam<T> = {})
    {
        const view: eui.Component = objectview.getObjectView(object);

        const window = new WindowView();
        window.contenGroup.addChild(view);
        window.title = `${object.constructor['name']}`;

        //
        if (param.closecallback)
        {
            const closecallback = param.closecallback;
            param.closecallback = () =>
            {
                closecallback && closecallback(object);
            };
        }
        this.popupView(window, param);
    }

    /**
     * 弹出一个包含给出界面的窗口
     *
     * @param view
     * @param closecallback
     * @param param
     */
    popupViewWindow(view: egret.DisplayObject, param: PopupviewParam<any> = {})
    {
        const window = new WindowView();
        window.contenGroup.addChild(view);
        //
        this.popupView(window, param);
    }
}

/**
 * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
 */
 export const popupview = new Popupview();
