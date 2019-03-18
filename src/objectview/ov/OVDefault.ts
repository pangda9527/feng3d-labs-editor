namespace feng3d
{
	export interface IObjectView extends eui.Component { }
	export interface IObjectBlockView extends eui.Component { }
	export interface IObjectAttributeView extends eui.Component { }
}

namespace editor
{
	/**
	 * 默认使用块的对象界面
	 */
	@feng3d.OVComponent()
	export class OVDefault extends eui.Component implements feng3d.IObjectView
	{
		private _space: Object;
		private _objectViewInfo: feng3d.ObjectViewInfo;
		private blockViews: feng3d.IObjectBlockView[];

		group: eui.Group;

		/**
		 * 对象界面数据
		 */
		constructor(objectViewInfo: feng3d.ObjectViewInfo)
		{
			super();

			this._objectViewInfo = objectViewInfo;
			this._space = objectViewInfo.owner;
			this.skinName = "OVDefault";
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number)
		{
			super.$onAddToStage(stage, nestLevel);
			//
			this.initview();
			this.updateView();
		}

		$onRemoveFromStage()
		{
			super.$onRemoveFromStage();
			this.dispose();
		}

		initview()
		{
			this.blockViews = [];
			var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
			for (var i = 0; i < objectBlockInfos.length; i++)
			{
				var displayObject = feng3d.objectview.getBlockView(objectBlockInfos[i]);
				displayObject.percentWidth = 100;
				displayObject.objectView = this;
				this.group.addChild(displayObject);
				this.blockViews.push(displayObject);
			}
		}

		dispose()
		{
			if (!this.blockViews) return;
			for (var i = 0; i < this.blockViews.length; i++)
			{
				var displayObject = this.blockViews[i];
				displayObject.objectView = null;
				this.group.removeChild(displayObject);
			}
			this.blockViews = null;
		}

		get space(): Object
		{
			return this._space;
		}

		set space(value: Object)
		{
			this._space = value;
			this.dispose();
			this.initview();
			this.updateView();
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			if (!this.stage) return;

			for (var i = 0; i < this.blockViews.length; i++)
			{
				this.blockViews[i].updateView();
			}
		}

		getblockView(blockName: string)
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

		getAttributeView(attributeName: string)
		{
			for (var i = 0; i < this.blockViews.length; i++)
			{
				var attributeView = this.blockViews[i].getAttributeView(attributeName);
				if (attributeView != null)
				{
					return attributeView;
				}
			}
			return null;
		}
	}
}
