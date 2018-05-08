namespace feng3d.editor
{
	@OAVComponent()
	export class BooleanAttrView extends OAVBase
	{
		label: eui.Label;
		checkBox: eui.CheckBox;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);
			this.skinName = "BooleanAttrViewSkin";
		}

		initView()
		{
			this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
		}

		dispose()
		{
			this.checkBox.removeEventListener(egret.Event.CHANGE, this.onChange, this);
		}

		updateView()
		{
			this.checkBox.selected = this.attributeValue;
		}

		protected onChange(event: egret.Event)
		{
			this.attributeValue = this.checkBox.selected;
		}
	}
}
