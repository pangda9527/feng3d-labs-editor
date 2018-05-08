namespace feng3d.editor
{
	@OAVComponent()
	export class OAVObjectView extends OAVBase
	{
		group: eui.Group;
		//
		view: eui.Component;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);
			this.skinName = "OVDefault";
		}

		initView()
		{
			this.view = objectview.getObjectView(this.attributeValue);
			this.view.percentWidth = 100;
			this.group.addChild(this.view);
		}

		updateView()
		{
		}
	}
}
