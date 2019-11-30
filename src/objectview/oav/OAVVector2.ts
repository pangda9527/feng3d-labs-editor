namespace editor
{
	/**
	 * Vector2属性界面
	 */
    @feng3d.OAVComponent()
    export class OAVVector2 extends OAVBase
    {
        public labelLab: eui.Label;
        public xLabel: eui.Label;
        public xTextInput: eui.TextInput;
        public yLabel: eui.Label;
        public yTextInput: eui.TextInput;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVVector2";
        }

        initView()
        {
            super.initView();

            this.addBinder(new NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "x", textInput: this.xTextInput, editable: this._attributeViewInfo.editable,
                controller: this.xLabel,
            }));
            this.addBinder(new NumberTextInputBinder().init({
                space: this.attributeValue, attribute: "y", textInput: this.yTextInput, editable: this._attributeViewInfo.editable,
                controller: this.yLabel,
            }));
        }
    }
}