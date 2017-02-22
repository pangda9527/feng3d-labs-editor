module feng3d
{
	/**
	 * 默认对象属性块界面
	 * @author feng 2016-3-22
	 */
	export class DefaultObjectBlockView extends eui.Component implements IObjectBlockView
	{
		private _space: Object;
		private _blockName: string;

		private attributeViews: IObjectAttributeView[];
		private itemList: AttributeViewInfo[];
		private isInitView: boolean;

		public blockTitle: eui.Label;
		public group: eui.Group;

		/**
		 * @inheritDoc
		 */
		constructor(blockViewInfo: BlockViewInfo)
		{
			super();

			this._space = blockViewInfo.owner;
			this._blockName = blockViewInfo.name;
			this.itemList = blockViewInfo.itemList;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "resource/custom_skins/DefaultObjectBlockView.exml";

		}

		private onComplete()
		{
			this.$updateView();
		}

		private initView(): void
		{
			var h = 0;
			if (this._blockName != null && this._blockName.length > 0)
			{
				this.blockTitle.text = this._blockName;
				this.group.addChildAt(this.blockTitle, 0);
			} else
			{
				this.group.removeChild(this.blockTitle);
			}

			this.attributeViews = [];
			var objectAttributeInfos = this.itemList;
			for (var i = 0; i < objectAttributeInfos.length; i++)
			{
				var displayObject = ObjectView.getAttributeView(objectAttributeInfos[i]);
				this.group.addChild(displayObject);
				this.attributeViews.push(<any>displayObject);
			}

			this.isInitView = true;
		}

		public get space(): Object
		{
			return this._space;
		}

		public set space(value: Object)
		{
			this._space = value;
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				this.attributeViews[i].space = this._space;
			}

			this.$updateView();
		}

		public get blockName(): string
		{
			return this._blockName;
		}

		/**
		 * 更新自身界面
		 */
		private $updateView(): void
		{
			if (!this.isInitView)
			{
				this.initView();
			}
		}

		public updateView(): void
		{
			this.$updateView();
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				this.attributeViews[i].updateView();
			}
		}

		public getAttributeView(attributeName: String): IObjectAttributeView
		{
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				if (this.attributeViews[i].attributeName == attributeName)
				{
					return this.attributeViews[i];
				}
			}
			return null;
		}
	}
}
