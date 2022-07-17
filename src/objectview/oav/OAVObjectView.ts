namespace editor
{
	@feng3d.OAVComponent()
	export class OAVObjectView extends OAVBase
	{
		group: eui.Group;
		//
		views: feng3d.IObjectView[];

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
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
				if (element instanceof feng3d.Feng3dObject) editable = editable && !Boolean(element.hideFlags & feng3d.HideFlags.NotEditable);
				var view = feng3d.objectview.getObjectView(element, { editable: editable });
				view.percentWidth = 100;
				this.group.addChild(view);
				this.views.push(view);
				if (element instanceof feng3d.EventEmitter)
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
				if (element.space instanceof feng3d.EventEmitter)
				{
					element.space.on("refreshView", this.onRefreshView, this);
				}
			});
			this.views.length = 0;
		}

		private onRefreshView(event: feng3d.IEvent<any>)
		{
			this.dispose();
			this.initView();
		}
	}
}
