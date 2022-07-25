import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { MinMaxGradientView } from '../../ui/components/MinMaxGradientView';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVMinMaxGradient extends OAVBase
{
    public labelLab: eui.Label;
    public minMaxGradientView: MinMaxGradientView;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = 'OAVMinMaxGradient';
    }

    initView()
    {
        if (this._attributeViewInfo.editable)
        {
            this.minMaxGradientView.addEventListener(egret.Event.CHANGE, this.onChange, this);
        }

        this.minMaxGradientView.minMaxGradient = this.attributeValue;

        this.minMaxGradientView.touchEnabled = this.minMaxGradientView.touchChildren = this._attributeViewInfo.editable;
    }

    dispose()
    {
        if (this._attributeViewInfo.editable)
        {
            this.minMaxGradientView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
        }
    }

    updateView()
    {

    }

    private onChange()
    {

    }
}
