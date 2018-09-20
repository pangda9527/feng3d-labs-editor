namespace editor
{
	/**
	 * 挑选（拾取）OAV界面
	 */
    @feng3d.OAVComponent()
    export class OAVTexture2D extends OAVBase
    {
        public image: eui.Image;
        public img_border: eui.Image;
        public pickBtn: eui.Button;
        public labelLab: eui.Label;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVTexture2D";
        }

        initView()
        {
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        }

        dispose()
        {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }

        private ontxtClick()
        {
            var menus: MenuItem[] = [{
                label: `None`, click: () =>
                {
                    this.attributeValue = new feng3d.UrlImageTexture2D();
                    this.updateView();
                }
            }];
            var texture2ds = feng3d.Feng3dAssets.getAssetsByType(feng3d.Texture2D);
            texture2ds.forEach(texture2d =>
            {
                menus.push({
                    label: texture2d.name, click: () =>
                    {
                        this.attributeValue = texture2d;
                        this.updateView();
                    }
                });
            });
            menu.popup(menus);
        }

        /**
         * 更新界面
         */
        updateView(): void
        {
            var text: feng3d.UrlImageTexture2D = this.attributeValue;

            this.image.visible = false;
            this.img_border.visible = false;
            var url = text.url;
            if (url)
            {
                assets.readArrayBuffer(url, (err, data) =>
                {
                    feng3d.dataTransform.arrayBufferToDataURL(data, (dataurl) =>
                    {
                        this.image.source = dataurl;
                        this.image.visible = true;
                        this.img_border.visible = true;
                    });
                });
            } else
            {
                this.image.source = "";
            }
        }

        private onDoubleClick()
        {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editorui.inspectorView.showData(this.attributeValue);
        }
    }
}
