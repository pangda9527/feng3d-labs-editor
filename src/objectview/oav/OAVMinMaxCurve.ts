import { OAVBase } from "./OAVBase";
import { MinMaxCurveView } from "../../ui/components/MinMaxCurveView";

@feng3d.OAVComponent()
export class OAVMinMaxCurve extends OAVBase
{
    public labelLab: eui.Label;
    public minMaxCurveView: MinMaxCurveView;

    constructor(attributeViewInfo: feng3d.AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = "OAVMinMaxCurve";
    }

    initView()
    {
        if (this._attributeViewInfo.editable)
        {
            this.minMaxCurveView.addEventListener(egret.Event.CHANGE, this.onChange, this);
        }

        this.minMaxCurveView.minMaxCurve = this.attributeValue;

        this.minMaxCurveView.touchEnabled = this.minMaxCurveView.touchChildren = this._attributeViewInfo.editable;
    }

    dispose()
    {
        if (this._attributeViewInfo.editable)
        {
            this.minMaxCurveView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
        }
    }

    updateView()
    {

    }

    private onChange()
    {

    }
}