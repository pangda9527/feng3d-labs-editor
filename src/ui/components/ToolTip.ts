import { windowEventProxy } from 'feng3d';
import { editorui } from '../../global/editorui';
import { TipString } from './tipviews/TipString';

export interface ITipView extends egret.DisplayObject
{
    value: any;
}

export class ToolTip
{
    /**
     * 默认 提示界面
     */
    defaultTipview = () => TipString;
    /**
     * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
     */
    tipviewmap = new Map<any, new () => ITipView>();

    private tipmap = new Map<egret.DisplayObject, any>();
    private tipView: ITipView;

    register(displayObject: egret.DisplayObject, tip: any)
    {
        if (!displayObject) return;
        this.tipmap.set(displayObject, tip);
        displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
    }

    unregister(displayObject: egret.DisplayObject)
    {
        if (!displayObject) return;
        this.tipmap.delete(displayObject);
        displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
    }

    private onMouseOver(event: egret.MouseEvent)
    {
        this.removeTipview();

        const displayObject = event.currentTarget;
        const tip = this.tipmap.get(displayObject);
        let TipviewCls = this.tipviewmap.get(tip.constructor);
        if (!TipviewCls)
        {
            TipviewCls = this.defaultTipview();
        }

        this.tipView = new TipviewCls();
        editorui.tooltipLayer.addChild(this.tipView);
        this.tipView.value = tip;
        this.tipView.x = windowEventProxy.clientX;
        this.tipView.y = windowEventProxy.clientY - this.tipView.height;

        //
        displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
    }

    private onMouseOut(event: egret.MouseEvent)
    {
        const displayObject = event.currentTarget;
        displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        this.removeTipview();
    }

    private removeTipview()
    {
        if (this.tipView)
        {
            this.tipView.parent.removeChild(this.tipView);
            this.tipView = null;
        }
    }
}

export const toolTip = new ToolTip();
