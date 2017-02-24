module feng3d.editor
{
	export class OAVTransform extends eui.Component implements eui.UIComponent
	{

		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;

		public pVector3DView: feng3d.editor.Vector3DView;
		public rVector3DView: feng3d.editor.Vector3DView;
		public sVector3DView: feng3d.editor.Vector3DView;

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

			this.pVector3DView.vm = transform.position;
			this.rVector3DView.vm = transform.rotation;
			this.sVector3DView.vm = transform.scale;
		}
	}
}