module feng3d.editor
{
	export class BooleanAttrView extends eui.Component implements feng3d.IObjectAttributeView
	{
		private _space: any;
		private _attributeName: string;
		private _attributeType: string;
		public label: eui.Label;
		public checkBox: eui.CheckBox;

		public constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/BooleanAttrView.exml";
		}

		private onComplete(): void
		{
			this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
			this.label.text = this._attributeName + ":";
			this.updateView();
		}

		public get space(): any
		{
			return this._space;
		}

		public set space(value: any)
		{
			this._space = value;
			this.updateView();
		}

		public updateView()
		{
			this.checkBox["selected"] = this.attributeValue;
		}

		protected onChange(event: egret.Event)
		{
			this.attributeValue = this.checkBox["selected"];
		}

		public get attributeName(): string
		{
			return this._attributeName;
		}

		public get attributeValue(): any
		{
			return this._space[this._attributeName];
		}

		public set attributeValue(value: any)
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
