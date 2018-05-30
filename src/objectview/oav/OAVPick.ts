namespace editor
{
	/**
	 * 挑选（拾取）OAV界面
	 * @author feng 2016-3-10
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
                    menus.unshift({
                        label: `空`, click: () =>
                        {
                            this.attributeValue = "";
                        }
                    });
                    menu.popup(menus);
                } else if (param.accepttype == "audio")
                {
                    var menus: MenuItem[] = editorAssets.filter((file) =>
                    {
                        return regExps.audio.test(file.path);
                    }).reduce((prev, item) =>
                    {
                        prev.push({
                            label: item.name, click: () =>
                            {
                                this.attributeValue = item.path;
                            }
                        }); return prev;
                    }, []);
                    menus.unshift({
                        label: `空`, click: () =>
                        {
                            this.attributeValue = "";
                        }
                    });
                    menu.popup(menus);
                } else if (param.accepttype == "file_script")
                {
                    var materialfiles = editorAssets.filter((file) =>
                    {
                        return file.extension == feng3d.AssetExtension.script;
                    })

                    if (materialfiles.length > 0)
                    {
                        getScriptClassNames(materialfiles, (scriptClassNames) =>
                        {
                            var menus: MenuItem[] = [];
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
                            menu.popup(menus);
                        });
                    } else
                    {
                        menu.popup([{ label: `没有 ${param.accepttype} 资源` }]);
                    }
                } else if (param.accepttype == "material")
                {
                    var materialfiles = editorAssets.filter((file) =>
                    {
                        return file.extension == feng3d.AssetExtension.material;
                    });

                    if (materialfiles.length > 0)
                    {
                        getMaterials(materialfiles, (materials) =>
                        {
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
                        });
                    } else
                    {
                        menu.popup([{ label: `没有 ${param.accepttype} 资源` }]);
                    }
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
