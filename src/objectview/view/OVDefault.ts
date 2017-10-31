module feng3d
{
	export interface IObjectView extends eui.Component { }
}

module feng3d.editor
{

	/**
	 * 默认使用块的对象界面
	 * @author feng 2016-3-22
	 */
	@OVComponent()
	export class OVDefault extends eui.Component implements IObjectView
	{
		private _space: Object;
		private _objectViewInfo: ObjectViewInfo;
		private blockViews: IObjectBlockView[];

		group: eui.Group;

		/**
		 * 对象界面数据
		 */
		constructor(objectViewInfo: ObjectViewInfo)
		{
			super();

			this._objectViewInfo = objectViewInfo;
			this._space = objectViewInfo.owner;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OVDefault";
		}

		private onComplete()
		{
			//
			this.blockViews = [];
			var objectBlockInfos: BlockViewInfo[] = this._objectViewInfo.objectBlockInfos;
			for (var i = 0; i < objectBlockInfos.length; i++)
			{
				var displayObject: eui.Component = objectview.getBlockView(objectBlockInfos[i]);
				displayObject.percentWidth = 100;
				this.group.addChild(displayObject);
				this.blockViews.push(<any>displayObject);
			}

			this.$updateView();
		}

		get space(): Object
		{
			return this._space;
		}

		set space(value: Object)
		{
			this._space = value;
			for (var i = 0; i < this.blockViews.length; i++)
			{
				this.blockViews[i].space = this._space;
			}

			this.$updateView();
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			this.$updateView();

			for (var i = 0; i < this.blockViews.length; i++)
			{
				this.blockViews[i].updateView();
			}
		}

		/**
		 * 更新自身界面
		 */
		private $updateView(): void
		{

		}

		getblockView(blockName: string): IObjectBlockView
		{
			for (var i = 0; i < this.blockViews.length; i++)
			{
				if (this.blockViews[i].blockName == blockName)
				{
					return this.blockViews[i];
				}
			}
			return null;
		}

		getAttributeView(attributeName: string): IObjectAttributeView
		{
			for (var i = 0; i < this.blockViews.length; i++)
			{
				var attributeView: IObjectAttributeView = this.blockViews[i].getAttributeView(attributeName);
				if (attributeView != null)
				{
					return attributeView;
				}
			}
			return null;
		}
	}
}
