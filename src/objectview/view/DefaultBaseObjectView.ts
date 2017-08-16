namespace feng3d.editor
{
	/**
	 * 默认基础对象界面
	 * @author feng 2016-3-11
	 */
	export class DefaultBaseObjectView extends eui.Component implements IObjectView
	{
		private _space: Object;

		label: eui.Label;

		constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = objectViewInfo.owner;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "DefaultBaseObjectView";
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
			this.label.text = String(this._space);
		}
	}
}
