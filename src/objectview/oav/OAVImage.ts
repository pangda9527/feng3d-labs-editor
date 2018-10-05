namespace editor
{
	@feng3d.OAVComponent()
	export class OAVImage extends OAVBase
	{
		public image: eui.Image;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);
			this.skinName = "OAVImage";
		}

		initView()
		{
			var texture: feng3d.UrlImageTexture2D = this.space;
			this.image.source = feng3dScreenShot.drawTexture(texture);

			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
		}

		dispose()
		{
		}

		updateView()
		{
		}

		onResize()
		{
			this.image.width = this.width;
			this.image.height = this.width;
			this.height = this.width;
		}
	}
}
