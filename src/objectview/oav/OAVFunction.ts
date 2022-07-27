import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVFunction extends OAVBase
{
declare public labelLab: eui.Label;
    public button: eui.Button;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = 'OAVFunction';
    }

    initView()
    {
        this.button.addEventListener(egret.MouseEvent.CLICK, this.click, this);
    }

    dispose()
    {
        this.button.removeEventListener(egret.MouseEvent.CLICK, this.click, this);
    }

    updateView()
    {

    }

    protected click(_event: egret.Event)
    {
        this._space[this._attributeName]();
    }
}
