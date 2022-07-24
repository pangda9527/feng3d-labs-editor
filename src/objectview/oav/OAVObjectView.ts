import { OAVComponent, IObjectView, AttributeViewInfo, Feng3dObject, HideFlags, objectview, EventEmitter, IEvent } from 'feng3d';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVObjectView extends OAVBase
{
	group: eui.Group;
	//
	views: IObjectView[];

	constructor(attributeViewInfo: AttributeViewInfo)
	{
		super(attributeViewInfo);
		this.skinName = "OVDefault";

		this.alpha = 1;
	}

	initView()
	{
		var arr = [];
		if (Array.isArray(this.attributeValue))
			arr = this.attributeValue;
		else
			arr.push(this.attributeValue);

		this.views = [];
		arr.forEach(element =>
		{
			var editable = true;
			if (element instanceof Feng3dObject) editable = editable && !Boolean(element.hideFlags & HideFlags.NotEditable);
			var view = objectview.getObjectView(element, { editable: editable });
			view.percentWidth = 100;
			this.group.addChild(view);
			this.views.push(view);
			if (element instanceof EventEmitter)
			{
				element.on("refreshView", this.onRefreshView, this);
			}
		});
	}

	updateView()
	{
	}

	/**
	 * 销毁
	 */
	dispose()
	{
		this.views.forEach(element =>
		{
			this.group.removeChild(element);
			if (element.space instanceof EventEmitter)
			{
				element.space.on("refreshView", this.onRefreshView, this);
			}
		});
		this.views.length = 0;
	}

	private onRefreshView(event: IEvent<any>)
	{
		this.dispose();
		this.initView();
	}
}
