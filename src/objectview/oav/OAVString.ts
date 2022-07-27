import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { TextInputBinder } from '../../ui/components/binders/TextInputBinder';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVString extends OAVBase
{
    public txtInput: eui.TextInput;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = 'OAVString';
    }

    initView()
    {
        this.addBinder(
            new TextInputBinder().init({ space: this.space, attribute: this._attributeName, textInput: this.txtInput, editable: this._attributeViewInfo.editable })
        );
    }
}
