namespace editor
{
    export var editorAssets: EditorAssets;

    export class EditorAssets
    {
        /**
         * 资源ID字典
         */
        private _assetsIDMap: { [id: string]: AssetsNode } = {};

        /**
         * 显示文件夹
         */
        @feng3d.watch("showFloderChanged")
        showFloder: AssetsNode;

        /**
         * 项目资源id树形结构
         */
        rootFile: AssetsNode;

        constructor()
        {
            feng3d.feng3dDispatcher.on("assets.parsed", this.onParsed, this);
        }

        /**
         * 初始化项目
         * @param callback 
         */
        initproject(callback: () => void)
        {
            editorFS.init(() =>
            {
                Object.keys(editorFS.idMap).map(assetsId =>
                {
                    return this._assetsIDMap[assetsId] = new AssetsNode(assetsId);
                }).forEach(element =>
                {
                    if (element.feng3dAssets.parentAsset)
                    {
                        var parentNode = this._assetsIDMap[element.feng3dAssets.parentAsset.assetsId];
                        parentNode.addChild(element);
                    }
                });

                this.rootFile = this._assetsIDMap[editorFS.root.assetsId];
                this.showFloder = this.rootFile;
                this.rootFile.isOpen = true;
                callback();
            });
        }

        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void)
        {
            editorFS.fs.readObject(path, (err, object: feng3d.GameObject) =>
            {
                if (err)
                {
                    callback(err, null);
                    return;
                }
                var scene = object.getComponent(feng3d.Scene3D);
                callback(null, scene);
            });
        }

        /**
         * 根据资源编号获取文件
         * 
         * @param assetsId 文件路径
         */
        getAssetsByID(assetsId: string)
        {
            return this._assetsIDMap[assetsId];
        }

        /**
         * 删除资源
         * 
         * @param assetsFile 资源
         */
        deleteAssets(assetsFile: AssetsNode, callback?: (err: Error) => void)
        {
            editorFS.deleteAssets(assetsFile.id, (err) =>
            {
                if (err)
                {
                    callback && callback(err);
                    return;
                }
                delete this._assetsIDMap[assetsFile.id];

                feng3d.feng3dDispatcher.dispatch("assets.deletefile", { id: assetsFile.id });

                callback && callback(err);
            });
        }

        /**
         * 保存资源
         * 
         * @param assetsFile 资源
         * @param callback 完成回调
         */
        saveAssets(assetsFile: AssetsNode, callback?: () => void)
        {
            editorFS.writeAssets(assetsFile.feng3dAssets, (err) =>
            {
                feng3d.assert(!err, `资源 ${assetsFile.id} 保存失败！`);
                callback && callback();
            });
        }

        /**
         * 获取脚本列表
         */
        getScripts()
        {
            var files = this._assetsIDMap;
            var tslist: feng3d.ScriptFile[] = [];
            for (const key in files)
            {
                var file = files[key].feng3dAssets;
                if (file instanceof feng3d.ScriptFile)
                {
                    tslist.push(file);
                }
            }
            return tslist;
        }

        /**
         * 获取指定类型资源
         * @param type 资源类型
         */
        getAssetsByType<T extends feng3d.Feng3dAssets>(type: feng3d.Constructor<T>)
        {
            var assetsFiles = Object.keys(this._assetsIDMap).map(key => this._assetsIDMap[key]).filter(element => element.feng3dAssets instanceof type);
            return assetsFiles;
        }

        /**
         * 新增资源
         * 
         * @param feng3dAssets 
         */
        createAssets<T extends feng3d.Feng3dAssets>(parentAssets: AssetsNode, cls: new () => T, value?: gPartial<T>, callback?: (err: Error, asset: AssetsNode) => void)
        {
            var folder = <feng3d.Feng3dFolder>parentAssets.feng3dAssets;
            editorFS.createAsset(cls, value, folder, (err, asset) =>
            {
                if (asset)
                {
                    var assetsFile = new AssetsNode(asset.assetsId);

                    assetsFile.isLoaded = true;

                    this._assetsIDMap[assetsFile.id] = assetsFile;

                    parentAssets.addChild(assetsFile);

                    editorData.selectObject(assetsFile);

                    callback && callback(null, assetsFile);
                } else
                {
                    alert(err.message);
                }
            });
        }

        /**
         * 弹出文件菜单
         */
        popupmenu(assetsFile: AssetsNode)
        {
            var menuconfig: MenuItem[] = [];
            var folder = <feng3d.Feng3dFolder>assetsFile.feng3dAssets;
            if (assetsFile.isDirectory)
            {
                menuconfig.push(
                    {
                        label: "新建",
                        submenu: [
                            {
                                label: "文件夹", click: () =>
                                {
                                    this.createAssets(assetsFile, feng3d.Feng3dFolder, { name: "NewFolder" })
                                }
                            },
                            {
                                label: "脚本", click: () =>
                                {
                                    var fileName = editorFS.getValidChildName(folder, "NewScript");
                                    this.createAssets(assetsFile, feng3d.ScriptFile, { name: fileName, textContent: assetsFileTemplates.getNewScript(fileName) });
                                }
                            },
                            {
                                label: "着色器", click: () =>
                                {
                                    var fileName = editorFS.getValidChildName(folder, "NewShader");
                                    this.createAssets(assetsFile, feng3d.ShaderFile, { name: fileName, textContent: assetsFileTemplates.getNewShader(fileName) });
                                }
                            },
                            {
                                label: "js", click: () =>
                                {
                                    this.createAssets(assetsFile, feng3d.JSFile, { name: "NewJs" });
                                }
                            },
                            {
                                label: "Json", click: () =>
                                {
                                    this.createAssets(assetsFile, feng3d.JsonFile, { name: "New Json" });
                                }
                            },
                            {
                                label: "文本", click: () =>
                                {
                                    this.createAssets(assetsFile, feng3d.TextFile, { name: "New Text" });
                                }
                            },
                            { type: "separator" },
                            {
                                label: "立方体贴图", click: () =>
                                {
                                    this.createAssets(assetsFile, feng3d.TextureCubeFile, { name: "new TextureCube.json" });
                                }
                            },
                            {
                                label: "材质", click: () =>
                                {
                                    this.createAssets(assetsFile, feng3d.MaterialFile, { name: "New Material" });
                                }
                            },
                            {
                                label: "几何体",
                                submenu: [
                                    {
                                        label: "平面", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New PlaneGeometry", geometry: new feng3d.PlaneGeometry() });
                                        }
                                    },
                                    {
                                        label: "立方体", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New CubeGeometry", geometry: new feng3d.CubeGeometry() });
                                        }
                                    },
                                    {
                                        label: "球体", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New SphereGeometry", geometry: new feng3d.SphereGeometry() });
                                        }
                                    },
                                    {
                                        label: "胶囊体", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New CapsuleGeometry", geometry: new feng3d.CapsuleGeometry() });
                                        }
                                    },
                                    {
                                        label: "圆柱体", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New CylinderGeometry", geometry: new feng3d.CylinderGeometry() });
                                        }
                                    },
                                    {
                                        label: "圆锥体", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New ConeGeometry", geometry: new feng3d.ConeGeometry() });
                                        }
                                    },
                                    {
                                        label: "圆环", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New TorusGeometry", geometry: new feng3d.TorusGeometry() });
                                        }
                                    },
                                    {
                                        label: "地形", click: () =>
                                        {
                                            this.createAssets(assetsFile, feng3d.GeometryFile, { name: "New TerrainGeometry", geometry: new feng3d.TerrainGeometry() });
                                        }
                                    },
                                ],
                            },
                        ]
                    },
                    { type: "separator" },
                    {
                        label: "导入资源", click: () =>
                        {
                            editorFS.selectFile((fileList: FileList) =>
                            {
                                var files = [];
                                for (let i = 0; i < fileList.length; i++)
                                {
                                    files[i] = fileList[i];
                                }
                                this.inputFiles(files);
                            });
                        }
                    });
            }
            if (menuconfig.length > 0)
            {
                menuconfig.push({ type: "separator" });
            }

            // 使用编辑器打开
            if (assetsFile.feng3dAssets instanceof feng3d.StringFile)
            {
                menuconfig.push({
                    label: "编辑", click: () =>
                    {
                        scriptCompiler.edit(<feng3d.StringFile>assetsFile.feng3dAssets);
                    }
                });
            }

            // 解析菜单
            this.parserMenu(menuconfig, assetsFile);
            if (!assetsFile.isDirectory)
            {
                menuconfig.push({
                    label: "导出", click: () =>
                    {
                        assetsFile.export();
                    }
                });
            }
            if (assetsFile != this.rootFile && assetsFile != this.showFloder)
            {
                menuconfig.push({
                    label: "删除", click: () =>
                    {
                        assetsFile.delete();
                    }
                });
            }
            if (assetsFile.feng3dAssets instanceof feng3d.UrlImageTexture2D)
            {
                menuconfig.push({
                    label: "去除背景色", click: () =>
                    {
                        var image: HTMLImageElement = assetsFile.feng3dAssets["image"];
                        var imageUtil = new feng3d.ImageUtil().fromImage(image);
                        var backColor = new feng3d.Color4(222 / 255, 222 / 255, 222 / 255);
                        imageUtil.clearBackColor(backColor);
                        feng3d.dataTransform.imagedataToImage(imageUtil.imageData, (img) =>
                        {
                            assetsFile.feng3dAssets["image"] = img;
                            this.saveAssets(assetsFile);
                        });

                    }
                })
            }
            menu.popup(menuconfig);
        }

        /**
         * 保存对象
         * 
         * @param object 对象
         * @param callback 
         */
        saveObject(object: feng3d.Feng3dAssets, callback?: (file: AssetsNode) => void)
        {
            feng3d.error(`未实现`);

            // var assetsFile = this.createAssets(this.showFloder, object.name, object);
            // callback && callback(assetsFile);
        }

        /**
         * 
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetsFiles 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files: File[], callback?: (files: AssetsNode[]) => void, assetsFiles: AssetsNode[] = [])
        {
            if (files.length == 0)
            {
                editorData.selectMultiObject(assetsFiles);
                callback && callback(assetsFiles);
                return;
            }
            var file = files.shift();
            var reader = new FileReader();
            reader.addEventListener('load', (event) =>
            {
                var result: ArrayBuffer = event.target["result"];
                var showFloder = this.showFloder;

                var createAssetsCallback = (err: Error, assetsFile: AssetsNode) =>
                {
                    if (err)
                    {
                        alert(err.message);
                    } else
                    {
                        assetsFiles.push(assetsFile);
                    }
                    this.inputFiles(files, callback, assetsFiles);
                };

                if (feng3d.regExps.image.test(file.name))
                {
                    feng3d.dataTransform.arrayBufferToImage(result, (img) =>
                    {
                        this.createAssets(showFloder, feng3d.TextureFile, { name: file.name, image: img }, createAssetsCallback);
                    });
                } else
                {
                    this.createAssets(showFloder, feng3d.ArrayBufferFile, { name: file.name, arraybuffer: result }, createAssetsCallback);
                }
            }, false);
            reader.readAsArrayBuffer(file);
        }

        runProjectScript(callback?: () => void)
        {
            editorFS.fs.readString("project.js", (err, content) =>
            {
                if (content != this._preProjectJsContent)
                {
                    //
                    var windowEval = eval.bind(window);
                    try
                    {
                        // 运行project.js
                        windowEval(content);
                        // 刷新属性界面（界面中可能有脚本）
                        editorui.inspectorView.updateView();
                    } catch (error)
                    {
                        feng3d.warn(error);
                    }
                }
                this._preProjectJsContent = content;
                callback && callback();
            });
        }

        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent = null

        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetsFile 文件
         */
        private parserMenu(menuconfig: MenuItem[], assetsFile: AssetsNode)
        {
            if (assetsFile.feng3dAssets instanceof feng3d.Feng3dFile)
            {
                var filePath = assetsFile.feng3dAssets.assetsPath;
                var extensions = feng3d.pathUtils.getExtension(filePath);
                switch (extensions)
                {
                    case "mdl": menuconfig.push({ label: "解析", click: () => feng3d.mdlLoader.load(filePath) }); break;
                    case "obj": menuconfig.push({ label: "解析", click: () => feng3d.objLoader.load(filePath) }); break;
                    case "mtl": menuconfig.push({ label: "解析", click: () => feng3d.mtlLoader.load(filePath) }); break;
                    case "fbx": menuconfig.push({ label: "解析", click: () => threejsLoader.load(filePath) }); break;
                    case "md5mesh": menuconfig.push({ label: "解析", click: () => feng3d.md5Loader.load(filePath) }); break;
                    case "md5anim": menuconfig.push({ label: "解析", click: () => feng3d.md5Loader.loadAnim(filePath) }); break;
                }
            }
        }

        private showFloderChanged(property, oldValue, newValue)
        {
            this.showFloder.openParents();
            feng3d.feng3dDispatcher.dispatch("assets.showFloderChanged", { oldpath: oldValue, newpath: newValue });
        }

        private onParsed(e: feng3d.Event<any>)
        {
            var data = e.data;
            if (data instanceof feng3d.Feng3dAssets)
            {
                this.saveObject(data);
            }
        }
    }

    editorAssets = new EditorAssets();
}