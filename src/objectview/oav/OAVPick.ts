namespace feng3d.editor
{
	/**
	 * 挑选（拾取）OAV界面
	 * @author feng 2016-3-10
	 */
    @OAVComponent()
    export class OAVPick extends OAVBase
    {
        public label: eui.Label;
        public text: eui.Label;
        public pickBtn: eui.Button;

        constructor(attributeViewInfo: AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVPick";
        }

        initView()
        {
            this.label.text = this._attributeName;

            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            watcher.watch(this.space, this.attributeName, this.updateView, this);

            var param: { accepttype: keyof DragData; datatype: string; } = <any>this.attributeViewInfo.componentParam;
            drag.register(this,
                (dragsource) =>
                {
                    if (param.datatype) dragsource[param.datatype] = this.attributeValue;
                },
                [param.accepttype],
                (dragSource) =>
                {
                    this.attributeValue = dragSource[param.accepttype];
                });
        }

        dispose()
        {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            drag.unregister(this);
            watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }

        private ontxtClick()
        {
            var param: { accepttype: keyof DragData; datatype: string; } = <any>this.attributeViewInfo.componentParam;
            if (param.accepttype)
            {
                if (param.accepttype == "image")
                {
                    var menus: MenuItem[] = editorAssets.filter((file) =>
                    {
                        return regExps.image.test(file.path);
                    }).reduce((prev, item) =>
                    {
                        prev.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item.path;
                            }
                        }); return prev;
                    }, []);
                    if (menus.length == 0)
                    {
                        menus.push({ label: `没有 ${param.accepttype} 资源` });
                    }
                    menu.popup(menus);
                }
            }
        }

        /**
         * 更新界面
         */
        updateView(): void
        {
            if (this.attributeValue === undefined)
            {
                this.text.text = String(this.attributeValue);
            } else if (!(this.attributeValue instanceof Object))
            {
                this.text.text = String(this.attributeValue);
            } else
            {
                var valuename = this.attributeValue["name"] || "";
                this.text.text = valuename + " (" + ClassUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + ")";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            }
        }

        private onDoubleClick()
        {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editorui.inspectorView.showData(this.attributeValue);
        }
    }
}
