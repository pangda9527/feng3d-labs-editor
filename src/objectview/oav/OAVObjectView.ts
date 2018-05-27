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
		}

		initView()
		{
			var arr = [];
			if (this.attributeValue instanceof Array)
				arr = this.attributeValue;
			else
				arr.push(this.attributeValue);

			this.views = [];
			arr.forEach(element =>
			{
				var view = feng3d.objectview.getObjectView(element);
				view.percentWidth = 100;
				this.group.addChild(view);
				this.views.push(view);
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
			});
			this.views = null;
		}
	}
}
