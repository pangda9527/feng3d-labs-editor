module feng3d
{
	/**
	 * 默认基础对象界面
	 * @author feng 2016-3-11
	 */
	export class DefaultBaseObjectView extends eui.Component implements IObjectView
	{
		private _space: Object;

		public label: eui.Label;

		constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = objectViewInfo.owner;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/DefaultBaseObjectView.exml";
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

		public getAttributeView(attributeName: String): IObjectAttributeView
		{
			return null;
		}

		public getblockView(blockName: String): IObjectBlockView
		{
			return null;
		}

		/**
		 * 更新界面
		 */
		public updateView(): void
		{
			this.label.text = String(this._space);
		}
	}
}
