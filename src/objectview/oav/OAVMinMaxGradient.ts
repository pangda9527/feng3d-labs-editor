
@feng3d.OAVComponent()
export class OAVMinMaxGradient extends OAVBase
{
    public labelLab: eui.Label;
    public minMaxGradientView: editor.MinMaxGradientView;

    constructor(attributeViewInfo: feng3d.AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = "OAVMinMaxGradient";
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
