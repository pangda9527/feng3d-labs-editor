namespace editor
{
    export var editorAsset: EditorAsset;

    export class EditorAsset
    {
        /**
         * 资源ID字典
         */
        private _assetIDMap: { [id: string]: AssetNode } = {};

        /**
         * 显示文件夹
         */
        @feng3d.watch("showFloderChanged")
        showFloder: AssetNode;

        /**
         * 项目资源id树形结构
         */
        rootFile: AssetNode;

        constructor()
        {
            feng3d.dispatcher.on("asset.parsed", this.onParsed, this);
        }

        /**
         * 初始化项目
         * @param callback 
         */
        initproject(callback: () => void)
        {
            editorRS.init(() =>
            {
                editorRS.getAllAssets().map(asset =>
                {
                    return this._assetIDMap[asset.assetId] = new AssetNode(asset);
                }).forEach(element =>
                {
                    if (element.asset.parentAsset)
                    {
                        var parentNode = this._assetIDMap[element.asset.parentAsset.assetId];
                        parentNode.addChild(element);
                    }
                });

                this.rootFile = this._assetIDMap[editorRS.root.assetId];
                this.showFloder = this.rootFile;
                this.rootFile.isOpen = true;
                callback();
            });
        }

        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void)
        {
            editorRS.fs.readObject(path, (err, object: feng3d.GameObject) =>
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
         * @param assetId 文件路径
         */
        getAssetByID(assetId: string)
        {
            return this._assetIDMap[assetId];
        }

        /**
         * 删除资源
         * 
         * @param assetNode 资源
         */
        deleteAsset(assetNode: AssetNode, callback?: (err: Error) => void)
        {
            editorRS.deleteAsset(assetNode.asset, (err) =>
            {
                if (err)
                {
                    callback && callback(err);
                    return;
                }
                delete this._assetIDMap[assetNode.asset.assetId];

                feng3d.dispatcher.dispatch("asset.deletefile", { id: assetNode.asset.assetId });

                callback && callback(err);
            });
        }

        /**
         * 保存资源
         * 
         * @param assetNode 资源
         * @param callback 完成回调
         */
        saveAsset(assetNode: AssetNode, callback?: () => void)
        {
            editorRS.writeAsset(assetNode.asset, (err) =>
            {
                feng3d.debuger && feng3d.assert(!err, `资源 ${assetNode.asset.assetId} 保存失败！`);
                callback && callback();
            });
        }

        /**
         * 新增资源
         * 
         * @param cls 资源类定义
         * @param fileName 文件名称
         * @param value 初始数据
         * @param folderNode 所在文件夹，如果值为null时默认添加到根文件夹中
         * @param callback 完成回调函数
         */
        createAsset<T extends feng3d.FileAsset>(folderNode: AssetNode, cls: new () => T, fileName?: string, value?: gPartial<T>, callback?: (err: Error, assetNode: AssetNode) => void)
        {
            var folder = <feng3d.FolderAsset>folderNode.asset;
            editorRS.createAsset(cls, fileName, value, folder, (err, asset) =>
            {
                if (asset)
                {
                    var assetNode = new AssetNode(asset);

                    assetNode.isLoaded = true;

                    this._assetIDMap[assetNode.asset.assetId] = assetNode;

                    folderNode.addChild(assetNode);

                    editorData.selectObject(assetNode);

                    callback && callback(null, assetNode);
                } else
                {
                    alert(err.message);
                }
            });
        }

        /**
         * 弹出文件菜单
         */
        popupmenu(assetNode: AssetNode)
        {
            var folder = <feng3d.FolderAsset>assetNode.asset;

            var menuconfig: MenuItem[] =
                [
                    {
                        label: "新建",
                        show: assetNode.isDirectory,
                        submenu: [
                            {
                                label: "文件夹", click: () =>
                                {
                                    this.createAsset(assetNode, feng3d.FolderAsset, "NewFolder")
                                }
                            },
                            {
                                label: "脚本", click: () =>
                                {
                                    var fileName = editorRS.getValidChildName(folder, "NewScript");
                                    this.createAsset(assetNode, feng3d.ScriptAsset, fileName, { textContent: assetFileTemplates.getNewScript(fileName) }, () =>
                                    {
                                        feng3d.dispatcher.dispatch("script.compile");
                                    });
                                }
                            },
                            {
                                label: "着色器", click: () =>
                                {
                                    var fileName = editorRS.getValidChildName(folder, "NewShader");
                                    this.createAsset(assetNode, feng3d.ShaderAsset, fileName, { textContent: assetFileTemplates.getNewShader(fileName) }, () =>
                                    {
                                        feng3d.dispatcher.dispatch("script.compile");
                                    });
                                }
                            },
                            {
                                label: "js", click: () =>
                                {
                                    this.createAsset(assetNode, feng3d.JSAsset, "NewJs");
                                }
                            },
                            {
                                label: "Json", click: () =>
                                {
                                    this.createAsset(assetNode, feng3d.JsonAsset, "New Json");
                                }
                            },
                            {
                                label: "文本", click: () =>
                                {
                                    this.createAsset(assetNode, feng3d.TextAsset, "New Text");
                                }
                            },
                            { type: "separator" },
                            {
                                label: "立方体贴图", click: () =>
                                {
                                    this.createAsset(assetNode, feng3d.TextureCubeAsset, "new TextureCube", { data: new feng3d.TextureCube() });
                                }
                            },
                            {
                                label: "材质", click: () =>
                                {
                                    this.createAsset(assetNode, feng3d.MaterialAsset, "New Material", { data: new feng3d.Material() });
                                }
                            },
                            {
                                label: "几何体",
                                submenu: [
                                    {
                                        label: "平面", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New PlaneGeometry", { data: new feng3d.PlaneGeometry() });
                                        }
                                    },
                                    {
                                        label: "立方体", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New CubeGeometry", { data: new feng3d.CubeGeometry() });
                                        }
                                    },
                                    {
                                        label: "球体", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New SphereGeometry", { data: new feng3d.SphereGeometry() });
                                        }
                                    },
                                    {
                                        label: "胶囊体", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New CapsuleGeometry", { data: new feng3d.CapsuleGeometry() });
                                        }
                                    },
                                    {
                                        label: "圆柱体", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New CylinderGeometry", { data: new feng3d.CylinderGeometry() });
                                        }
                                    },
                                    {
                                        label: "圆锥体", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New ConeGeometry", { data: new feng3d.ConeGeometry() });
                                        }
                                    },
                                    {
                                        label: "圆环", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New TorusGeometry", { data: new feng3d.TorusGeometry() });
                                        }
                                    },
                                    {
                                        label: "地形", click: () =>
                                        {
                                            this.createAsset(assetNode, feng3d.GeometryAsset, "New TerrainGeometry", { data: new feng3d.TerrainGeometry() });
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
                            editorRS.selectFile((fileList: FileList) =>
                            {
                                var files = [];
                                for (let i = 0; i < fileList.length; i++)
                                {
                                    files[i] = fileList[i];
                                }
                                this.inputFiles(files);
                            });
                        }, show: assetNode.isDirectory,
                    },
                    {
                        label: "在资源管理器中显示", click: () =>
                        {
                            var fullpath = editorRS.fs.getAbsolutePath(assetNode.asset.assetPath);
                            nativeAPI.showFileInExplorer(fullpath);
                        }, show: !!nativeAPI,
                    }, {
                        label: "使用VSCode打开项目", click: () =>
                        {
                            nativeAPI.openWithVSCode(editorRS.fs.projectname, (err) =>
                            {
                                if (err) throw err;
                            });
                        }, show: !!nativeAPI,
                    },
                    { type: "separator" },
                    {
                        label: "编辑", click: () =>
                        {
                            if (nativeAPI)
                            {
                                // 使用本地 VSCode 打开
                                var path = editorRS.fs.getAbsolutePath(assetNode.asset.assetPath);
                                nativeAPI.openWithVSCode(editorRS.fs.projectname, (err) =>
                                {
                                    if (err) throw err;
                                    nativeAPI.openWithVSCode(path, (err) =>
                                    {
                                        if (err) throw err;
                                    });
                                });
                            } else
                            {
                                if (codeeditoWin) codeeditoWin.close();
                                codeeditoWin = window.open(`codeeditor.html`);
                                var script = <feng3d.StringAsset>assetNode.asset;
                                codeeditoWin.onload = () =>
                                {
                                    feng3d.dispatcher.dispatch("codeeditor.openScript", script);
                                };
                            }
                        }, show: assetNode.asset instanceof feng3d.StringAsset,
                    },
                ];

            // 解析菜单
            this.parserMenu(menuconfig, assetNode);
            menuconfig.push(
                {
                    label: "导出", click: () =>
                    {
                        assetNode.export();
                    }, show: !assetNode.isDirectory,
                }, {
                    label: "删除", click: () =>
                    {
                        assetNode.delete();
                    }, show: assetNode != this.rootFile && assetNode != this.showFloder,
                }, {
                    label: "去除背景色", click: () =>
                    {
                        var image: HTMLImageElement = assetNode.asset["image"];
                        var imageUtil = new feng3d.ImageUtil().fromImage(image);
                        var backColor = new feng3d.Color4(222 / 255, 222 / 255, 222 / 255);
                        imageUtil.clearBackColor(backColor);
                        feng3d.dataTransform.imagedataToImage(imageUtil.imageData, (img) =>
                        {
                            assetNode.asset["image"] = img;
                            this.saveAsset(assetNode);
                        });
                    }, show: assetNode.asset.data instanceof feng3d.Texture2D,
                },
            );
            menu.popup(menuconfig);
        }

        /**
         * 保存对象
         * 
         * @param object 对象
         * @param callback 
         */
        saveObject(object: feng3d.AssetData, callback?: (file: AssetNode) => void)
        {
            feng3d.error(`未实现`);

            // var assetsFile = this.createAssets(this.showFloder, object.name, object);
            // callback && callback(assetsFile);
        }

        /**
         * 
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetNodes 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files: File[], callback?: (files: AssetNode[]) => void, assetNodes: AssetNode[] = [])
        {
            if (files.length == 0)
            {
                editorData.selectMultiObject(assetNodes);
                callback && callback(assetNodes);
                return;
            }
            var file = files.shift();
            var reader = new FileReader();
            reader.addEventListener('load', (event) =>
            {
                var result: ArrayBuffer = event.target["result"];
                var showFloder = this.showFloder;

                var createAssetCallback = (err: Error, assetNode: AssetNode) =>
                {
                    if (err)
                    {
                        alert(err.message);
                    } else
                    {
                        assetNodes.push(assetNode);
                    }
                    this.inputFiles(files, callback, assetNodes);
                };

                var fileName = file.name;
                var lastIndex = fileName.lastIndexOf(".");
                if (lastIndex != -1)
                {
                    fileName = fileName.substring(0, lastIndex);
                }
                if (feng3d.regExps.image.test(file.name))
                {
                    feng3d.dataTransform.arrayBufferToImage(result, (img) =>
                    {
                        this.createAsset(showFloder, feng3d.TextureAsset, fileName, { image: img }, createAssetCallback);
                    });
                } else
                {
                    this.createAsset(showFloder, feng3d.ArrayBufferAsset, fileName, { arraybuffer: result }, createAssetCallback);
                }
            }, false);
            reader.readAsArrayBuffer(file);
        }

        runProjectScript(callback?: () => void)
        {
            editorRS.fs.readString("project.js", (err, content) =>
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
                        feng3d.dispatcher.dispatch("inspector.update");

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
         * @param assetNode 文件
         */
        private parserMenu(menuconfig: MenuItem[], assetNode: AssetNode)
        {
            if (assetNode.asset instanceof feng3d.FileAsset)
            {
                var filePath = assetNode.asset.assetPath;
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
            feng3d.dispatcher.dispatch("asset.showFloderChanged", { oldpath: oldValue, newpath: newValue });
        }

        private onParsed(e: feng3d.Event<any>)
        {
            var data = e.data;
            if (data instanceof feng3d.FileAsset)
            {
                this.saveObject(data.data);
            }
        }
    }

    editorAsset = new EditorAsset();
}

var codeeditoWin: Window;