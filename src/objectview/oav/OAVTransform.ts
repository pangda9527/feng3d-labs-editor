module feng3d.editor
{
	export class OAVTransform extends eui.Component implements eui.UIComponent
	{
		public titleButton: eui.Button;
		public titleLabel: eui.Label;
		public transformView: feng3d.editor.TransformView;

		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OAVTransformSKin";
		}

		private onComplete(): void
		{
			this.titleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleButtonClick, this);
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
			var transform: Transform = <any>this.attributeValue;
			this.transformView.vm = transform;
		}

		private onTitleButtonClick()
		{
			this.currentState = this.currentState == "hide" ? "show" : "hide";
		}
	}
}