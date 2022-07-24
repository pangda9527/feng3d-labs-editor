import { OAVComponent, AttributeViewInfo, watcher } from 'feng3d';
import { OAVBase } from './OAVBase';

/**
 * 默认对象属性界面
 */
@OAVComponent()
export class OAVMultiText extends OAVBase
{
    public txtLab: eui.Label;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = "OAVMultiText";
    }

    initView()
    {
        if (this._attributeViewInfo.editable)
            watcher.watch(this.space, this._attributeName, this.updateView, this);
    }

    dispose()
    {
        watcher.unwatch(this.space, this._attributeName, this.updateView, this);
    }

    updateView()
    {
        this.txtLab.text = this.attributeValue;
    }
}
