namespace feng3d.editor
{
	@OVAComponent()
	export class BooleanAttrView extends eui.Component implements feng3d.IObjectAttributeView
	{
		private _space: any;
		private _attributeName: string;
		private _attributeType: string;
		label: eui.Label;
		checkBox: eui.CheckBox;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "BooleanAttrViewSkin";
		}

		private onComplete(): void
		{
			this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
			this.label.text = this._attributeName;
			this.updateView();
		}

		get space(): any
		{
			return this._space;
		}

		set space(value: any)
		{
			this._space = value;
			this.updateView();
		}

		updateView()
		{
			this.checkBox["selected"] = this.attributeValue;
		}

		protected onChange(event: egret.Event)
		{
			this.attributeValue = this.checkBox["selected"];
		}

		get attributeName(): string
		{
			return this._attributeName;
		}

		get attributeValue(): any
		{
			return this._space[this._attributeName];
		}

		set attributeValue(value: any)
		{
			if (this._space[this._attributeName] != value)
			{
				this._space[this._attributeName] = value;
				var objectViewEvent = <any>new ObjectViewEvent(ObjectViewEvent.VALUE_CHANGE, true);
				objectViewEvent.space = this._space;
				objectViewEvent.attributeName = this._attributeName;
				objectViewEvent.attributeValue = this.attributeValue;
				this.dispatchEvent(objectViewEvent);
			}
		}
	}
}
