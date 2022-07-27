import { IObjectBlockView, IObjectView, objectview, ObjectViewInfo, OVComponent } from 'feng3d';

declare global
{
	export interface MixinsIObjectView extends eui.Component { }
	export interface MixinsIObjectBlockView extends eui.Component { }
	export interface MixinsIObjectAttributeView extends eui.Component { }
}

/**
 * 默认使用块的对象界面
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
		this.skinName = 'OVDefault';
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number)
	{
		super.$onAddToStage(stage, nestLevel);
		//
		this.invalidateView();
	}

	$onRemoveFromStage()
	{
		super.$onRemoveFromStage();
		this.dispose();
	}

	initview()
	{
		if (this.blockViews) return;
		this.blockViews = [];
		const objectBlockInfos = this._objectViewInfo.objectBlockInfos;
		for (let i = 0; i < objectBlockInfos.length; i++)
		{
			const displayObject = objectview.getBlockView(objectBlockInfos[i]);
			displayObject.percentWidth = 100;
			displayObject.objectView = this;
			this.group.addChild(displayObject);
			this.blockViews.push(displayObject);
		}
	}

	dispose()
	{
		if (!this.blockViews) return;
		for (let i = 0; i < this.blockViews.length; i++)
		{
			const displayObject = this.blockViews[i];
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
		this.invalidateView();
	}

	private invalidateView()
	{
		this.once(egret.Event.ENTER_FRAME, this.updateView, this);
	}

	/**
	 * 更新界面
	 */
	updateView(): void
	{
		if (!this.stage) return;

		this.initview();

		for (let i = 0; i < this.blockViews.length; i++)
		{
			this.blockViews[i].updateView();
		}
	}

	getblockView(blockName: string)
	{
		for (let i = 0; i < this.blockViews.length; i++)
		{
			if (this.blockViews[i].blockName === blockName)
			{
				return this.blockViews[i];
			}
		}

		return null;
	}

	getAttributeView(attributeName: string)
	{
		for (let i = 0; i < this.blockViews.length; i++)
		{
			const attributeView = this.blockViews[i].getAttributeView(attributeName);
			if (attributeView)
			{
				return attributeView;
			}
		}

		return null;
	}
}
