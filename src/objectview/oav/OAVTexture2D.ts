namespace feng3d.editor
{
	/**
	 * 挑选（拾取）OAV界面
	 * @author feng 2016-3-10
	 */
    @OAVComponent()
    export class OAVTexture2D extends OAVBase
    {
        public image: eui.Image;
        public img_border: eui.Image;
        public pickBtn: eui.Button;
        public label: eui.Label;

        constructor(attributeViewInfo: AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVTexture2D";
        }

        initView()
        {
            this.label.text = this._attributeName;

            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            watcher.watch(this.space, this.attributeName, this.updateView, this);
        }

        dispose()
        {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }

        private ontxtClick()
        {
            var menus: MenuItem[] = editorAssets.filter((file) =>
            {
                return regExps.image.test(file.path);
            }).reduce((prev, item) =>
            {
                prev.push({
                    label: item.name, click: () =>
                    {
                        var text: Texture2D = this.attributeValue;
                        text.url = item.path;
                        this.updateView();
                    }
                }); return prev;
            }, []);
            if (menus.length == 0)
            {
                menus.push({ label: `没有 图片 资源` });
            }
            menu.popup(menus);
        }

        /**
         * 更新界面
         */
        updateView(): void
        {
            var text: Texture2D = this.attributeValue;

            this.image.visible = false;
            this.img_border.visible = false;
            var url = text.url;
            if (url)
            {
                fs.readFile(url, (err, data) =>
                {
                    dataTransform.arrayBufferToDataURL(data, (dataurl) =>
                    {
                        this.image.source = dataurl;
                        this.image.visible = true;
                        this.img_border.visible = true;
                    });
                });
            }

            assets.readFileAsImage
        }

        private onDoubleClick()
        {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editorui.inspectorView.showData(this.attributeValue);
        }
    }
}
