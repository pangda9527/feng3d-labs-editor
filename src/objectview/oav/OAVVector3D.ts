namespace feng3d.editor
{
	@OAVComponent()
	export class OAVVector3D extends eui.Component implements IObjectAttributeView
	{
		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;

		label: eui.Label;
		vector3DView: feng3d.editor.Vector3DView;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OAVVector3DSkin";
		}

		private onComplete()
		{
			this.vector3DView.vm = <any>this.attributeValue;
			eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");

			if (this.attributeViewInfo.componentParam)
			{
				for (var key in this.attributeViewInfo.componentParam)
				{
					if (this.attributeViewInfo.componentParam.hasOwnProperty(key))
					{
						this.vector3DView[key] = this.attributeViewInfo.componentParam[key];
					}
				}
			}

			this.updateView();
		}

		get space(): Object
		{
			return this._space;
		}

		set space(value: Object)
		{
			this._space = value;
			this.updateView();
		}

		get attributeName(): string
		{
			return this._attributeName;
		}

		get attributeValue(): Object
		{
			return this._space[this._attributeName];
		}

		set attributeValue(value: Object)
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
		updateView(): void
		{
		}
	}
}