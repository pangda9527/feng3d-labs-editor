import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { MinMaxCurveView } from '../../ui/components/MinMaxCurveView';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVMinMaxCurve extends OAVBase
{
    public labelLab: eui.Label;
    public minMaxCurveView: MinMaxCurveView;

    constructor(attributeViewInfo: AttributeViewInfo)
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
