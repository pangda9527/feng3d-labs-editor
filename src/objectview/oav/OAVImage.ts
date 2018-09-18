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
			var imagePath = this.attributeValue;
			if (imagePath)
			{
				assets.readArrayBuffer(imagePath, (err, data) =>
				{
					feng3d.dataTransform.arrayBufferToDataURL(data, (dataurl) =>
					{
						this.image.source = dataurl;
					});
				});
			} else
			{
				this.image.source = null;
			}
			this.addEventListener(egret.Event.RESIZE,this.onResize,this);
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
