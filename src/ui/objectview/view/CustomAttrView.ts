module feng3d.editor
{

	export class CustomAttrView extends eui.Component implements IObjectAttributeView
	{
		private _space: any;
		private _attributeName: string;
		private _attributeType: string;
		public label: eui.Label;

		public constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();

			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/CustomAttrView.exml";
		}

		private onComplete()
		{
			this.label.text = "自定义属性界面_" + this._attributeName;
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
				var objectViewEvent: ObjectViewEvent = <any>new ObjectViewEvent(ObjectViewEvent.VALUE_CHANGE, true);
				objectViewEvent.space = this._space;
				objectViewEvent.attributeName = this._attributeName;
				objectViewEvent.attributeValue = this.attributeValue;
				this.dispatchEvent(objectViewEvent);
			}
		}

		public updateView()
		{
		}

	}
}