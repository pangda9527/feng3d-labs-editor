namespace editor
{
	/**
	 * 默认对象属性块界面
	 */
	@feng3d.OBVComponent()
	export class OBVDefault extends eui.Component implements feng3d.IObjectBlockView
	{
		private _space: Object;
		private _blockName: string;

		private attributeViews: feng3d.IObjectAttributeView[];
		private itemList: feng3d.AttributeViewInfo[];

		group: eui.Group;
		titleGroup: eui.Group;
		titleButton: eui.Button;
		contentGroup: eui.Group;

		border: eui.Rect;

		objectView: feng3d.IObjectView;

		/**
		 * @inheritDoc
		 */
		constructor(blockViewInfo: feng3d.BlockViewInfo)
		{
			super();

			this._space = blockViewInfo.owner;
			this._blockName = blockViewInfo.name;
			this.itemList = blockViewInfo.itemList;
			this.skinName = "OBVDefault";
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number)
		{
			super.$onAddToStage(stage, nestLevel);

			this.initView();
			this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
		}

		$onRemoveFromStage()
		{
			super.$onRemoveFromStage();

			this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
			this.dispose();
		}

		initView(): void
		{
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
				var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
				displayObject.percentWidth = 100;
				displayObject.objectView = this.objectView;
				displayObject.objectBlockView = this;
				this.contentGroup.addChild(displayObject);
				this.attributeViews.push(<any>displayObject);
			}
		}

		dispose()
		{
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				var displayObject = this.attributeViews[i];
				displayObject.objectView = null;
				displayObject.objectBlockView = null;
				this.contentGroup.removeChild(displayObject);
			}
			this.attributeViews.length = 0;
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
		}

		get blockName(): string
		{
			return this._blockName;
		}

		updateView(): void
		{
			for (var i = 0; i < this.attributeViews.length; i++)
			{
				this.attributeViews[i].updateView();
			}
		}

		getAttributeView(attributeName: String)
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
