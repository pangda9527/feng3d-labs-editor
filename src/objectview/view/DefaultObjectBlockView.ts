namespace feng3d.editor
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

		group: eui.Group;
		titleGroup: eui.Group;
		titleButton: eui.Button;
		contentGroup: eui.Group;

		border: eui.Rect;

		/**
		 * @inheritDoc
		 */
		constructor(blockViewInfo: BlockViewInfo)
		{
			super();

			this._space = blockViewInfo.owner;
			this._blockName = blockViewInfo.name;
			this.itemList = blockViewInfo.itemList;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "DefaultObjectBlockView";
		}

		private onComplete()
		{
			this.titleButton.addEventListener(MouseEvent.CLICK, this.onTitleButtonClick, this);
			this.$updateView();
		}

		private initView(): void
		{
			var h = 0;
			if (this._blockName != null && this._blockName.length > 0)
			{
				this.addChildAt(this.border, 0);
				this.group.addChildAt(this.titleGroup, 0);
			} else
			{
				this.removeChild(this.border);
				this.group.removeChild(this.titleGroup);
			}

			this.attributeViews = [];
			var objectAttributeInfos = this.itemList;
			for (var i = 0; i < objectAttributeInfos.length; i++)
			{
				var displayObject: eui.Component = objectview.getAttributeView(objectAttributeInfos[i]);
				displayObject.percentWidth = 100;
				this.contentGroup.addChild(displayObject);
				this.attributeViews.push(<any>displayObject);
			}

			this.isInitView = true;
		}

		get space(): Object
		{
			return this._space;
		}

		set space(value: Object)
		{
			this._space = value;
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				this.attributeViews[i].space = this._space;
			}

			this.$updateView();
		}

		get blockName(): string
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

		updateView(): void
		{
			this.$updateView();
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				this.attributeViews[i].updateView();
			}
		}

		getAttributeView(attributeName: String): IObjectAttributeView
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

		private onTitleButtonClick()
		{
			this.currentState = this.currentState == "hide" ? "show" : "hide";
		}
	}
}
