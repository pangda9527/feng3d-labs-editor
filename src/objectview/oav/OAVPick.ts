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
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);

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
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        }

        private ontxtClick()
        {
            var param: { accepttype: keyof DragData; datatype: string; } = <any>this.attributeViewInfo.componentParam;
            if (param.accepttype)
            {
                if (param.accepttype == "image")
                {
                    var menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = ""; } }];
                    editorAssets.filter((file) =>
                    {
                        return regExps.image.test(file.path);
                    }).forEach(item =>
                    {
                        menus.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item.path;
                            }
                        });
                    });
                    menu.popup(menus);
                } else if (param.accepttype == "audio")
                {
                    var menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = ""; } }];
                    editorAssets.filter((file) =>
                    {
                        return regExps.audio.test(file.path);
                    }).forEach(item =>
                    {
                        menus.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item.path;
                            }
                        });
                    }, []);
                    menu.popup(menus);
                } else if (param.accepttype == "file_script")
                {
                    var materialfiles = editorAssets.filter((file) =>
                    {
                        return file.extension == feng3d.AssetExtension.script;
                    })

                    var menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = ""; } }];
                    if (materialfiles.length > 0)
                    {
                        getScriptClassNames(materialfiles, (scriptClassNames) =>
                        {
                            scriptClassNames.forEach(element =>
                            {
                                menus.push({
                                    label: element,
                                    click: () =>
                                    {
                                        this.attributeValue = element;
                                    }
                                });
                            });
                        });
                    }
                    menu.popup(menus);
                } else if (param.accepttype == "material")
                {
                    var materialfiles = editorAssets.filter((file) =>
                    {
                        return file.extension == feng3d.AssetExtension.material;
                    });

                    var menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = null; } }];

                    if (materialfiles.length > 0)
                    {
                        getMaterials(materialfiles, (materials) =>
                        {
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
                        });
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
                this.text.text = valuename + " (" + feng3d.classUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + ")";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            }
        }

        private onDoubleClick()
        {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editorui.inspectorView.showData(this.attributeValue);
        }
    }

    function getScriptClassNames(tsfiles: AssetsFile[], callback: (scriptClassNames: string[]) => void, scriptClassNames: string[] = [])
    {
        if (tsfiles.length == 0)
        {
            callback(scriptClassNames);
            return;
        }
        tsfiles.shift().getScriptClassName((scriptClassName) =>
        {
            scriptClassNames.push(scriptClassName);
            getScriptClassNames(tsfiles, callback, scriptClassNames);
        });
    }

    function getMaterials(tsfiles: AssetsFile[], callback: (materials: feng3d.Material[]) => void, materials: feng3d.Material[] = [])
    {
        if (tsfiles.length == 0)
        {
            callback(materials);
            return;
        }
        tsfiles.shift().getData((material) =>
        {
            materials.push(material);
            getMaterials(tsfiles, callback, materials);
        });
    }
}
