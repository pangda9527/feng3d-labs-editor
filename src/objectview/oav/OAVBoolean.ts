import { OAVBase } from "./OAVBase";

@feng3d.OAVComponent()
export class OAVBoolean extends OAVBase
{
	checkBox: eui.CheckBox;

	constructor(attributeViewInfo: feng3d.AttributeViewInfo)
	{
		super(attributeViewInfo);
		this.skinName = "BooleanAttrViewSkin";
	}

	initView()
	{
		if (this._attributeViewInfo.editable)
			this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
		this.checkBox.enabled = this._attributeViewInfo.editable;
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