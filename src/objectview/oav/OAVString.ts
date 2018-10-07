namespace editor
{
    @feng3d.OAVComponent()
    export class OAVString extends OAVBase
    {
        public txtInput: eui.TextInput;

        private binders: UIBinder[] = [];

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVString";
        }

        initView()
        {
            this.binders.push(
                new TextInputBinder().init({ space: this.space, attribute: this._attributeName, textInput: this.txtInput })
            );

            this.txtInput.enabled = this._attributeViewInfo.editable;
        }

        dispose()
        {
            this.binders.forEach(v => v.dispose());
            this.binders.length = 0;
        }
    }
}