module feng3d.editor
{
	export class OAVVector3D extends eui.Component implements IObjectAttributeView
	{
		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;

		public label: eui.Label;
		public vector3DView: feng3d.editor.Vector3DView;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/OAVVector3DSkin.exml";
		}

		private onComplete()
		{
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
			this.vector3DView.vm = <any>this.attributeValue;
		}
	}
}