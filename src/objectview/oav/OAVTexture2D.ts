namespace editor
{
	/**
	 * 挑选（拾取）OAV界面
	 */
    @feng3d.OAVComponent()
    export class OAVTexture2D extends OAVBase
    {
        public image: eui.Image;
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

            if (this._attributeViewInfo.editable)
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
            var menus: MenuItem[] = [];
            var texture2ds = feng3d.rs.getLoadedAssetDatasByType(feng3d.Texture2D);
            texture2ds.forEach(texture2d =>
            {
                menus.push({
                    label: texture2d.name, click: () =>
                    {
                        this.attributeValue = texture2d;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
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
            var texture: feng3d.Texture2D = this.attributeValue;
            this.image.source = texture.dataURL;
        }

        private onDoubleClick()
        {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editorData.selectObject(this.attributeValue);
        }
    }
}
