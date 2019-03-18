namespace editor
{
	/**
	 * 默认对象属性界面
	 */
	@feng3d.OAVComponent()
	export class OAVNumber extends OAVBase
	{
		public labelLab: eui.Label;
		public text: eui.TextInput;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);

			this.skinName = "OAVNumber";
		}

		initView()
		{
			super.initView();

			this.addBinder(new NumberTextInputBinder().init({
				space: this.space, attribute: this._attributeName, textInput: this.text, editable: this._attributeViewInfo.editable,
				controller: this.labelLab,
			}));
		}
	}
}