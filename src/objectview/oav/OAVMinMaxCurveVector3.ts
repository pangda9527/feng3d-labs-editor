import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { MinMaxCurveVector3View } from '../../ui/components/MinMaxCurveVector3View';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVMinMaxCurveVector3 extends OAVBase
{
    public labelLab: eui.Label;
    public minMaxCurveVector3View: MinMaxCurveVector3View;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = "OAVMinMaxCurveVector3";
    }

    initView()
    {
        if (this._attributeViewInfo.editable)
        {
            this.minMaxCurveVector3View.addEventListener(egret.Event.CHANGE, this.onChange, this);
        }

        this.minMaxCurveVector3View.minMaxCurveVector3 = this.attributeValue;

        this.minMaxCurveVector3View.touchEnabled = this.minMaxCurveVector3View.touchChildren = this._attributeViewInfo.editable;
    }

    dispose()
    {
        if (this._attributeViewInfo.editable)
        {
            this.minMaxCurveVector3View.removeEventListener(egret.Event.CHANGE, this.onChange, this);
        }
    }

    updateView()
    {

    }

    private onChange()
    {

    }
}
