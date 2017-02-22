module feng3d
{

	export class CustomObjectView extends eui.Component implements IObjectView
	{
		private _space: any;
		public label: eui.Label;

		public constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = objectViewInfo.owner;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/CustomObjectView.exml";
		}

		private onComplete()
		{
			this.label.text = "自定义对象界面_" + egret.getQualifiedClassName(this._space);
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
		}

		public getAttributeView(attributeName: string): IObjectAttributeView
		{
			return null;
		}

		public getblockView(blockName: string): IObjectBlockView
		{
			return null;
		}

	}
}
