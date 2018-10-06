namespace editor
{
	/**
	 * 挑选（拾取）OAV界面
	 */
    @feng3d.OAVComponent()
    export class OAVPick extends OAVBase
    {
        public labelLab: eui.Label;
        public text: eui.Label;
        public pickBtn: eui.Button;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVPick";
        }

        initView()
        {
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);

            if (this._attributeViewInfo.editable)
            {
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);

                var param: { accepttype: keyof DragData; datatype: string; } = <any>this._attributeViewInfo.componentParam;
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

            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        }

        dispose()
        {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);

            drag.unregister(this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }

        private onPickBtnClick()
        {
            var param: { accepttype: keyof DragData; datatype: string; } = <any>this._attributeViewInfo.componentParam;
            if (param.accepttype)
            {
                if (param.accepttype == "texture2d")
                {
                    var menus: MenuItem[] = [];
                    var texture2ds = feng3d.Feng3dAssets.getAssetsByType(feng3d.UrlImageTexture2D);
                    texture2ds.forEach(item =>
                    {
                        menus.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item;
                            }
                        });
                    });
                    menu.popup(menus);
                }
                else if (param.accepttype == "texturecube")
                {
                    var menus: MenuItem[] = [];
                    var textureCubes = feng3d.Feng3dAssets.getAssetsByType(feng3d.TextureCube);
                    textureCubes.forEach(item =>
                    {
                        menus.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item;
                            }
                        });
                    });
                    menu.popup(menus);
                } else if (param.accepttype == "audio")
                {
                    var menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = ""; } }];
                    var audioFiles = feng3d.Feng3dAssets.getAssetsByType(feng3d.AudioFile);
                    audioFiles.forEach(item =>
                    {
                        menus.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item.filePath;
                            }
                        });
                    }, []);
                    menu.popup(menus);
                } else if (param.accepttype == "file_script")
                {
                    var scriptFiles = feng3d.Feng3dAssets.getAssetsByType(feng3d.ScriptFile);

                    var menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = null; } }];
                    scriptFiles.forEach(element =>
                    {
                        menus.push({
                            label: element.name,
                            click: () =>
                            {
                                this.attributeValue = new element.classDefinition();
                            }
                        });
                    });
                    menu.popup(menus);
                } else if (param.accepttype == "material")
                {
                    var materials = feng3d.Feng3dAssets.getAssetsByType(feng3d.Material);
                    var menus: MenuItem[] = [];
                    materials.forEach(element =>
                    {
                        menus.push({
                            label: element.name,
                            click: () =>
                            {
                                this.attributeValue = element;
                            }
                        });
                    });
                    menu.popup(menus);
                } else if (param.accepttype == "geometry")
                {
                    var geometrys = feng3d.Feng3dAssets.getAssetsByType(feng3d.Geometry);
                    var menus: MenuItem[] = [];
                    geometrys.forEach(element =>
                    {
                        menus.push({
                            label: element.name,
                            click: () =>
                            {
                                this.attributeValue = element;
                            }
                        });
                    });
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
                this.text.text = this.attributeValue["name"] || "";
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
