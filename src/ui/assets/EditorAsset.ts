
export var editorAsset: EditorAsset;

export class EditorAsset
{
    /**
     * 资源ID字典
     */
    private _assetIDMap: { [id: string]: AssetNode } = {};
    private _assetPathMap: { [path: string]: AssetNode } = {};

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
        feng3d.globalEmitter.on("asset.parsed", this.onParsed, this);
    }

    /**
     * 初始化项目
     * @param callback 
     */
    initproject(callback: () => void)
    {
        editorRS.init(() =>
        {
            this._assetIDMap = {};
            this._assetPathMap = {};

            var allAssets = editorRS.getAllAssets();
            allAssets.map(asset =>
            {
                var node = new AssetNode(asset);
                this.addAsset(node);
                return node;
            }).forEach(element =>
            {
                if (element.asset.parentAsset)
                {
                    var parentNode = this.getAssetByID(element.asset.parentAsset.assetId);
                    parentNode.addChild(element);
                }
            });

            this.rootFile = this.getAssetByID(editorRS.root.assetId);
            this.showFloder = this.rootFile;
            this.rootFile.isOpen = true;
            callback();
        });
    }

    /**
     * 添加新资源
     * 
     * @param node 资源
     */
    addAsset(node: AssetNode)
    {
        if (this._assetIDMap[node.asset.assetId])
            throw "添加重复资源！";
        if (this._assetPathMap[node.asset.assetPath])
            throw "添加重复资源！";

        this._assetIDMap[node.asset.assetId] = node;
        this._assetPathMap[node.asset.assetPath] = node;
    }

    readScene(path: string, callback: (err: Error, scene: feng3d.Scene) => void)
    {
        editorRS.fs.readObject(path, (err, obj) =>
        {
            if (err)
            {
                callback(err, null);
                return;
            }
            editorRS.deserializeWithAssets(obj, (object: feng3d.GameObject) =>
            {
                var scene = object.getComponent(feng3d.Scene);
                callback(null, scene);
            });
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
     * 根据资源路径获取文件
     * 
     * @param path 资源路径
     */
    getAssetByPath(path: string)
    {
        return this._assetPathMap[path];
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
            delete this._assetPathMap[assetNode.asset.assetPath];

            feng3d.globalEmitter.emit("asset.deletefile", { id: assetNode.asset.assetId });

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
            console.assert(!err, `资源 ${assetNode.asset.assetId} 保存失败！`);
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
    createAsset<T extends feng3d.FileAsset>(folderPath: string, cls: new () => T, fileName?: string, value?: feng3d.gPartial<T>, callback?: (err: Error, assetNode: AssetNode) => void)
    {
        var folderNode = this.getAssetByPath(folderPath);

        var folder = <feng3d.FolderAsset>folderNode.asset;
        editorRS.createAsset(cls, fileName, value, folder, (err, asset) =>
        {
            if (asset)
            {
                var assetNode = new AssetNode(asset);

                assetNode.isLoaded = true;

                this.addAsset(assetNode);

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
        // 资源所在文件夹
        var folderPath = assetNode.asset.assetPath;
        if (!assetNode.isDirectory) folderPath = assetNode.parent.asset.assetPath;

        var menuconfig: MenuItem[] =
            [
                {
                    label: "Create",
                    submenu: [
                        {
                            label: "Folder", click: () =>
                            {
                                this.createAsset(folderPath, feng3d.FolderAsset, "NewFolder")
                            }
                        },
                        {
                            label: "TS Script", click: () =>
                            {
                                var fileName = editorRS.getValidChildName(folder, "NewScript");
                                this.createAsset(folderPath, feng3d.ScriptAsset, fileName, { textContent: assetFileTemplates.getNewScript(fileName) }, () =>
                                {
                                    feng3d.globalEmitter.emit("script.compile");
                                });
                            }
                        },
                        {
                            label: "Shader", click: () =>
                            {
                                var fileName = editorRS.getValidChildName(folder, "NewShader");
                                this.createAsset(folderPath, feng3d.ShaderAsset, fileName, { textContent: assetFileTemplates.getNewShader(fileName) }, () =>
                                {
                                    feng3d.globalEmitter.emit("script.compile");
                                });
                            }
                        },
                        {
                            label: "js", click: () =>
                            {
                                this.createAsset(folderPath, feng3d.JSAsset, "NewJs");
                            }
                        },
                        {
                            label: "Json", click: () =>
                            {
                                this.createAsset(folderPath, feng3d.JsonAsset, "New Json", { textContent: "{}" });
                            }
                        },
                        {
                            label: "Txt", click: () =>
                            {
                                this.createAsset(folderPath, feng3d.TextAsset, "New Text");
                            }
                        },
                        { type: "separator" },
                        {
                            label: "立方体贴图", click: () =>
                            {
                                this.createAsset(folderPath, feng3d.TextureCubeAsset, "new TextureCube", { data: <any>new feng3d.TextureCube() });
                            }
                        },
                        {
                            label: "Material", click: () =>
                            {
                                this.createAsset(folderPath, feng3d.MaterialAsset, "New Material", { data: <any>new feng3d.Material() });
                            }
                        },
                        {
                            label: "几何体",
                            submenu: [
                                {
                                    label: "平面", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New PlaneGeometry", { data: new feng3d.PlaneGeometry() });
                                    }
                                },
                                {
                                    label: "立方体", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New CubeGeometry", { data: new feng3d.CubeGeometry() });
                                    }
                                },
                                {
                                    label: "球体", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New SphereGeometry", { data: new feng3d.SphereGeometry() });
                                    }
                                },
                                {
                                    label: "胶囊体", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New CapsuleGeometry", { data: new feng3d.CapsuleGeometry() });
                                    }
                                },
                                {
                                    label: "圆柱体", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New CylinderGeometry", { data: new feng3d.CylinderGeometry() });
                                    }
                                },
                                {
                                    label: "圆锥体", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New ConeGeometry", { data: new feng3d.ConeGeometry() });
                                    }
                                },
                                {
                                    label: "圆环", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New TorusGeometry", { data: new feng3d.TorusGeometry() });
                                    }
                                },
                                {
                                    label: "线段", click: () =>
                                    {
                                        this.createAsset(folderPath, feng3d.GeometryAsset, "New SegmentGeometry", { data: new feng3d.SegmentGeometry() });
                                    }
                                },
                                // {
                                //     label: "地形", click: () =>
                                //     {
                                //         this.createAsset(folderPath, feng3d.GeometryAsset, "New TerrainGeometry", { data: new feng3d.TerrainGeometry() });
                                //     }
                                // },
                            ],
                        },
                    ]
                },
                {
                    label: "Show In Explorer", click: () =>
                    {
                        var fullpath = editorRS.fs.getAbsolutePath(assetNode.asset.assetPath);
                        nativeAPI.showFileInExplorer(fullpath);
                    }, enable: !!nativeAPI
                }, {
                    label: "使用VSCode打开项目", click: () =>
                    {
                        nativeAPI.openWithVSCode(editorRS.fs.projectname, (err) =>
                        {
                            if (err) throw err;
                        });
                    }, enable: !!nativeAPI,
                },
                {
                    label: "Open", click: () =>
                    {
                        if (assetNode.asset instanceof feng3d.TextAsset)
                        {
                            feng3d.globalEmitter.emit("openScript", <feng3d.TextAsset>assetNode.asset);
                        }
                    },
                },
                {
                    label: "Delete", click: () =>
                    {
                        assetNode.delete();
                    }, enable: assetNode != this.rootFile && assetNode != this.showFloder,
                },
                {
                    label: "Rename",
                    click: () =>
                    {
                        alert("未实现");
                    }
                },
                { type: "separator" },
                {
                    label: "Import New Asset...", click: () =>
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
                    }, enable: assetNode.isDirectory,
                },
                {
                    label: "Export Package...", click: () =>
                    {
                        assetNode.export();
                    }, enable: !assetNode.isDirectory,
                },
            ];

        // 解析菜单
        this.parserMenu(menuconfig, assetNode);
        menuconfig.push(
            {
                label: "去除背景色", click: () =>
                {
                    var image: HTMLImageElement = assetNode.asset["image"];
                    var imageUtil = new feng3d.ImageUtil().fromImage(image);
                    var backColor = new feng3d.Color4(222 / 255, 222 / 255, 222 / 255);
                    imageUtil.clearBackColor(backColor);
                    feng3d.dataTransform.imagedataToImage(imageUtil.imageData, 1, (img) =>
                    {
                        assetNode.asset["image"] = img;
                        this.saveAsset(assetNode);
                    });
                }, enable: assetNode.asset.data instanceof feng3d.Texture2D,
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
    saveObject(object: any, callback?: (file: AssetNode) => void)
    {
        this.createAsset(this.showFloder.asset.assetPath, feng3d.GameObjectAsset, object.name, { data: object }, (err, assetNode) =>
        {
            callback && callback(assetNode);
        });
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
            var result: ArrayBuffer = <any>event.target["result"];
            var showFloder = this.showFloder.asset.assetPath;

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
            if (feng3d.regExps.image.test(file.name))
            {
                feng3d.dataTransform.arrayBufferToImage(result, (img) =>
                {
                    var texture2D = new feng3d.Texture2D();
                    texture2D["_pixels"] = img;
                    this.createAsset(showFloder, feng3d.TextureAsset, fileName, { data: <any>texture2D }, createAssetCallback);
                });
            } else if (feng3d.regExps.audio.test(file.name))
            {
                this.createAsset(showFloder, feng3d.AudioAsset, fileName, { arraybuffer: <any>result }, createAssetCallback);
            } else
            {
                this.createAsset(showFloder, feng3d.ArrayBufferAsset, fileName, { arraybuffer: <any>result }, createAssetCallback);
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
                    feng3d.globalEmitter.emit("inspector.update");

                } catch (error)
                {
                    console.warn(error);
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
            var extensions = feng3d.pathUtils.extname(filePath);
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
        feng3d.globalEmitter.emit("asset.showFloderChanged", { oldpath: oldValue, newpath: newValue });
    }

    private onParsed(e: feng3d.IEvent<any>)
    {
        var data = e.data;
        if (data instanceof feng3d.FileAsset)
        {
            this.saveObject(data.data);
        }
    }
}

editorAsset = new EditorAsset();

var codeeditoWin: Window;