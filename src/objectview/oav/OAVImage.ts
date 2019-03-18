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
			this.alpha = 1;
		}

		initView()
		{
			var texture: feng3d.Texture2D = this.space;
			this.image.source = texture.dataURL;

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
