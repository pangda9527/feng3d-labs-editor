
@feng3d.OAVComponent()
export class OAVString extends OAVBase
{
    public txtInput: eui.TextInput;

    constructor(attributeViewInfo: feng3d.AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = "OAVString";
    }

    initView()
    {
        this.addBinder(
            new TextInputBinder().init({ space: this.space, attribute: this._attributeName, textInput: this.txtInput, editable: this._attributeViewInfo.editable, })
        );
    }
}
