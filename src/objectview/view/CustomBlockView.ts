module feng3d.editor
{
	export class CustomBlockView extends eui.Component implements IObjectBlockView
	{
		private _space: any;
		private _blockName: string;
		public label: eui.Label;

		public constructor(blockViewInfo: BlockViewInfo)
		{
			super();
			this._blockName = blockViewInfo.name;
			this._space = blockViewInfo.owner;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/CustomBlockView.exml";
		}

		private onComplete()
		{
			this.label.text = "自定义块界面_(blockName:" + this._blockName + ")";
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

		public get blockName(): string
		{
			return this._blockName;
		}

		public updateView()
		{
		}

		public getAttributeView(attributeName: string): IObjectAttributeView
		{
			return null;
		}

	}
}