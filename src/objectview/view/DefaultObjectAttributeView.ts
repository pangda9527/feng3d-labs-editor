module feng3d.editor
{

	/**
	 * 默认对象属性界面
	 * @author feng 2016-3-10
	 */
	export class DefaultObjectAttributeView extends eui.Component implements IObjectAttributeView
	{
		private textTemp: string;
		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;
		public label: eui.Label;
		public text: eui.TextInput;


		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/DefaultObjectAttributeView.exml";
		}

		private onComplete()
		{
			this.text.percentWidth = 100;
			this.text.enabled = this.attributeViewInfo.writable;
			this.updateView();
		}


		public get space(): Object
		{
			return this._space;
		}

		public set space(value: Object)
		{
			this._space = value;
			this.updateView();
		}

		public get attributeName(): string
		{
			return this._attributeName;
		}

		public get attributeValue(): Object
		{
			return this._space[this._attributeName];
		}

		public set attributeValue(value: Object)
		{
			if (this._space[this._attributeName] != value)
			{
				this._space[this._attributeName] = value;
			}
			this.updateView();
		}

		/**
		 * 更新界面
		 */
		public updateView(): void
		{
			this.label.text = this._attributeName;
			if (ClassUtils.isBaseType(this.attributeValue))
			{
				this.text.text = String(this.attributeValue);
			} else
			{
				this.text.enabled = false;
				this.text.text = "[" + ClassUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + "]";
			}
		}
	}
}
