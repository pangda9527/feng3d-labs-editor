namespace editor
{
	@feng3d.OAVComponent()
	export class OAVCubeMap extends OAVBase
	{
		public px: eui.Image;
		public py: eui.Image;
		public pz: eui.Image;
		public nx: eui.Image;
		public ny: eui.Image;
		public nz: eui.Image;
		public pxGroup: eui.Group;
		public pxBtn: eui.Button;
		public pyGroup: eui.Group;
		public pyBtn: eui.Button;
		public pzGroup: eui.Group;
		public pzBtn: eui.Button;
		public nxGroup: eui.Group;
		public nxBtn: eui.Button;
		public nyGroup: eui.Group;
		public nyBtn: eui.Button;
		public nzGroup: eui.Group;
		public nzBtn: eui.Button;


		private images: eui.Image[];
		private btns: eui.Button[];

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);
			this.skinName = "OAVCubeMap";
			this.alpha = 1;
		}

		initView()
		{
			this.images = [this.px, this.py, this.pz, this.nx, this.ny, this.nz];
			this.btns = [this.pxBtn, this.pyBtn, this.pzBtn, this.nxBtn, this.nyBtn, this.nzBtn];

			// var param: { accepttype: keyof DragData; datatype?: string; } = { accepttype: "image" };
			for (let i = 0; i < propertys.length; i++)
			{
				this.updateImage(i)
				// drag.register(image,
				// 	(dragsource) => { },
				// 	[param.accepttype],
				// 	(dragSource) =>
				// 	{
				// 		this.attributeValue = dragSource[param.accepttype];
				// 	});
				this.btns[i].addEventListener(egret.MouseEvent.CLICK, this.onImageClick, this);
				this.btns[i].enabled = this._attributeViewInfo.editable;
				// this.btns[i].touchChildren = this.btns[i].touchEnabled = this._attributeViewInfo.editable;
			}

			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
		}

		private updateImage(i: number)
		{
			var textureCube: feng3d.TextureCube = this.space;
			const imagePath = textureCube[propertys[i]];
			const image = this.images[i];
			if (imagePath)
			{
				editorRS.fs.readArrayBuffer(imagePath, (err, data) =>
				{
					feng3d.dataTransform.arrayBufferToDataURL(data, (dataurl) =>
					{
						image.source = dataurl;
					});
				});
			} else
			{
				image.source = null;
			}
		}

		private onImageClick(e: egret.MouseEvent)
		{
			var index = this.btns.indexOf(e.currentTarget);
			if (index != -1)
			{
				var textureCube: feng3d.TextureCube = this.space;
				var texture2ds = feng3d.rs.getAssetsByType(feng3d.UrlImageTexture2D);
				var menus: MenuItem[] = [{
					label: `None`, click: () =>
					{
						textureCube[propertys[index]] = "";
						this.updateImage(index);
						this.dispatchValueChange(index);
					}
				}];
				texture2ds.forEach(d =>
				{
					menus.push({
						label: d.name, click: () =>
						{
							textureCube[propertys[index]] = d.url;
							this.updateImage(index);
							this.dispatchValueChange(index);
						}
					});
				});
				menu.popup(menus);
			}
		}

		private dispatchValueChange(index: number)
		{
			var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
			objectViewEvent.space = this._space;
			objectViewEvent.attributeName = propertys[index];
			this.dispatchEvent(objectViewEvent);
		}

		dispose()
		{
		}

		updateView()
		{
		}

		onResize()
		{
			var w4 = Math.round(this.width / 4);
			this.px.width = this.py.width = this.pz.width = this.nx.width = this.ny.width = this.nz.width = w4;
			this.px.height = this.py.height = this.pz.height = this.nx.height = this.ny.height = this.nz.height = w4;
			//
			this.pxGroup.width = this.pyGroup.width = this.pzGroup.width = this.nxGroup.width = this.nyGroup.width = this.nzGroup.width = w4;
			this.pxGroup.height = this.pyGroup.height = this.pzGroup.height = this.nxGroup.height = this.nyGroup.height = this.nzGroup.height = w4;
			//
			this.pxGroup.x = w4 * 2;
			this.pxGroup.y = w4;
			//
			this.pyGroup.x = w4;
			//
			this.pzGroup.x = w4;
			this.pzGroup.y = w4;
			//
			this.nxGroup.y = w4;
			//
			this.nyGroup.x = w4;
			this.nyGroup.y = w4 * 2;
			//
			this.nzGroup.x = w4 * 3;
			this.nzGroup.y = w4;
			//
			this.height = w4 * 3;
		}
	}
	var propertys = ["positive_x_url", "positive_y_url", "positive_z_url", "negative_x_url", "negative_y_url", "negative_z_url"];
}
