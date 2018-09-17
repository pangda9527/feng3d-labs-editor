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
            var menus: MenuItem[] = editorAssets.filter((file) =>
            {
                return file.extension == feng3d.AssetExtension.texture2d;
            }).reduce((prev, item) =>
            {
                prev.push({
                    label: item.name, click: () =>
                    {
                        item.getData((texture2d: feng3d.UrlImageTexture2D) =>
                        {
                            this.attributeValue = texture2d;
                            this.updateView();
                        });
                    }
                }); return prev;
            }, []);
            menus.unshift({
                label: `空`, click: () =>
                {
                    this.attributeValue = new feng3d.UrlImageTexture2D();
                    this.updateView();
                }
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
                assets.readFileAsArrayBuffer(url, (err, data) =>
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

            feng3d.assets.readFileAsImage
        }

        private onDoubleClick()
        {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editorui.inspectorView.showData(this.attributeValue);
        }
    }
}
