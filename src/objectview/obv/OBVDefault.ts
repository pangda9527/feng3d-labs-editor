import { OBVComponent, IObjectBlockView, IObjectAttributeView, AttributeViewInfo, IObjectView, BlockViewInfo, objectview } from 'feng3d';

/**
 * 默认对象属性块界面
 */
@OBVComponent()
export class OBVDefault extends eui.Component implements IObjectBlockView
{
	private _space: Object;
	private _blockName: string;

	private attributeViews: IObjectAttributeView[];
	private itemList: AttributeViewInfo[];

	group: eui.Group;
	titleGroup: eui.Group;
	titleButton: eui.Button;
	contentGroup: eui.Group;

	border: eui.Rect;

	objectView: IObjectView;

	/**
	 * @inheritDoc
	 */
	constructor(blockViewInfo: BlockViewInfo)
	{
		super();

		this._space = blockViewInfo.owner;
		this._blockName = blockViewInfo.name;
		this.itemList = blockViewInfo.itemList;
		this.skinName = 'OBVDefault';
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
		if (this._blockName && this._blockName.length > 0)
		{
			this.addChildAt(this.border, 0);
			this.group.addChildAt(this.titleGroup, 0);
		}
		else
		{
			this.removeChild(this.border);
			this.group.removeChild(this.titleGroup);
		}

		this.attributeViews = [];
		const objectAttributeInfos = this.itemList;
		for (let i = 0; i < objectAttributeInfos.length; i++)
		{
			const displayObject = objectview.getAttributeView(objectAttributeInfos[i]);
			displayObject.percentWidth = 100;
			displayObject.objectView = this.objectView;
			displayObject.objectBlockView = this;
			this.contentGroup.addChild(displayObject);
			this.attributeViews.push(<any>displayObject);
		}
	}

	dispose()
	{
		for (let i = 0; i < this.attributeViews.length; i++)
		{
			const displayObject = this.attributeViews[i];
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
		for (let i = 0; i < this.attributeViews.length; i++)
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
		for (let i = 0; i < this.attributeViews.length; i++)
		{
			this.attributeViews[i].updateView();
		}
	}

	getAttributeView(attributeName: String)
	{
		for (let i = 0; i < this.attributeViews.length; i++)
		{
			if (this.attributeViews[i].attributeName === attributeName)
			{
				return this.attributeViews[i];
			}
		}

		return null;
	}

	private onTitleButtonClick()
	{
		this.currentState = this.currentState === 'hide' ? 'show' : 'hide';
	}
}
