namespace feng3d.editor
{
	/**
	 * 默认基础对象界面
	 * @author feng 2016-3-11
	 */
	@OVComponent()
	export class OVBaseDefault extends eui.Component implements IObjectView
	{
		public label: eui.Label;
		public image: eui.Image;
		//
		private _space: Object;

		constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = objectViewInfo.owner;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OVBaseDefault";
		}

		private onComplete(): void
		{
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

		getAttributeView(attributeName: String): IObjectAttributeView
		{
			return null;
		}

		getblockView(blockName: String): IObjectBlockView
		{
			return null;
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			this.image.visible = false;
			this.label.visible = true;
			var value = this._space;
			if (typeof value == "string" && value.indexOf("data:image") != -1)
			{
				this.image.visible = true;
				this.label.visible = false;
				this.image.source = value;
			} else
			{
				this.label.text = String(this._space);
			}
		}
	}
}
