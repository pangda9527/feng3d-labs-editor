namespace editor
{
	/**
	 * 挑选（拾取）OAV界面
	 * @author feng 2016-3-10
	 */
    @feng3d.OAVComponent()
    export class OAVTexture2D extends OAVBase
    {
        public image: eui.Image;
        public img_border: eui.Image;
        public pickBtn: eui.Button;
        public label: eui.Label;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVTexture2D";
        }

        initView()
        {
            this.label.text = this._attributeName;

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
                return regExps.image.test(file.path);
            }).reduce((prev, item) =>
            {
                prev.push({
                    label: item.name, click: () =>
                    {
                        var text: feng3d.Texture2D = this.attributeValue;
                        text.url = item.path;
                        this.updateView();
                    }
                }); return prev;
            }, []);
            menus.unshift({
                label: `空`, click: () =>
                {
                    var text: feng3d.Texture2D = this.attributeValue;
                    text.url = "";
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
            var text: feng3d.Texture2D = this.attributeValue;

            this.image.visible = false;
            this.img_border.visible = false;
            var url = text.url;
            if (url)
            {
                fs.readFile(url, (err, data) =>
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
