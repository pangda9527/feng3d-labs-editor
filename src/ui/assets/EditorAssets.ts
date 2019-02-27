namespace editor
{
    export var editorAssets: EditorAssets;

    /**
     * 资源字典表存储路径
     */
    const assetsFilePath = "assets.json";

    /**
     * 资源文件夹路径
     */
    const AssetsPath = "Assets/";

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
            editorFS.fs.readObject(assetsFilePath, (err, list: { id: string, path: string, assetType: feng3d.AssetExtension }[]) =>
            {
                list = list || [{ id: AssetsPath, path: AssetsPath, assetType: feng3d.AssetExtension.folder }];

                feng3d.assetsIDPathMap.init(list);

                list.map(element =>
                {
                    return this._assetsIDMap[element.id] = new AssetsNode(element.id);
                }).forEach(element =>
                {
                    var elementpath = feng3d.assetsIDPathMap.getPath(element.id);
                    var parentPath = feng3d.pathUtils.getParentPath(elementpath);
                    if (parentPath != "/" && parentPath.length > 0)
                    {
                        this.getAssetsByPath(parentPath).addChild(element);
                    }
                });

                this.rootFile = this.getAssetsByID(AssetsPath);
                this.showFloder = this.rootFile;
                this.rootFile.on("added", () => { this.saveProject() });
                this.rootFile.on("removed", () => { this.saveProject() });
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
         * 根据路径获取资源
         * 
         * @param assetsPath 资源路径
         */
        getAssetsByPath(assetsPath: string)
        {
            var id = feng3d.assetsIDPathMap.getID(assetsPath);
            return this.getAssetsByID(id);
        }

        /**
         * 删除资源
         * 
         * @param assetsFile 资源
         */
        deleteAssets(assetsFile: AssetsNode, callback?: (err: Error) => void)
        {
            feng3d.assert(!!this._assetsIDMap[assetsFile.id]);

            editorFS.deleteAssets(assetsFile.id, (err) =>
            {
                if (err)
                {
                    callback && callback(err);
                    return;
                }
                delete this._assetsIDMap[assetsFile.id];

                feng3d.feng3dDispatcher.dispatch("assets.deletefile", { id: assetsFile.id });

                this.saveProject();

                callback && callback(err);
            });
        }

        /**
         * 保存项目
         * @param callback 完成回调
         */
        saveProject(callback?: (err: Error) => void)
        {
            editorFS.fs.writeObject(assetsFilePath, feng3d.assetsIDPathMap.toList(), callback);
        }

        /**
         * 保存资源
         * 
         * @param assetsFile 资源
         * @param callback 完成回调
         */
        saveAssets(assetsFile: AssetsNode, callback?: () => void)
        {
            feng3d.assert(!!this._assetsIDMap[assetsFile.id], `无法保存已经被删除的资源！`);

            editorFS.writeAssets(assetsFile.feng3dAssets, (err) =>
            {
                feng3d.assert(!err, `资源 ${assetsFile.id} 保存失败！`);
                callback && callback();
            });
        }

        /**
         * 移动资源
         * 
         * @param assetsFile 资源文件
         * @param newPath 新路径
         * @param callback 回调函数，当文件系统中文件全部移动完成后调用
         */
        moveAssets(assetsFile: AssetsNode, newPath: string, callback?: (err?: Error) => void)
        {
            if (feng3d.assetsIDPathMap.existPath(newPath))
            {
                callback && callback();
                return;
            }


            var oldPath = feng3d.assetsIDPathMap.getPath(assetsFile.id);

            var files = assetsFile.getFileList();
            // 更新资源结点中文件路径
            files.forEach(file =>
            {
                var filepath = feng3d.assetsIDPathMap.getPath(file.id);
                filepath = filepath.replace(oldPath, newPath);
                feng3d.assetsIDPathMap.deleteByID(file.id);
                feng3d.assetsIDPathMap.addItem({ id: file.id, path: filepath, assetType: file.feng3dAssets.assetType });
            });

            // 更新结点父子关系
            var newParentPath = feng3d.pathUtils.getParentPath(newPath);
            var newParentAssetsFile = this.getAssetsByPath(newParentPath);
            newParentAssetsFile.addChild(assetsFile);

            // 移动文件
            editorFS.fs.move(oldPath, newPath, callback);
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
         * 新增文件夹
         * 
         * @param folderName 文件夹名称
         */
        createFolder(parentAssets: AssetsNode, folderName: string)
        {
            var newName = parentAssets.getNewChildFileName(folderName);
            var parentPath = feng3d.assetsIDPathMap.getPath(parentAssets.id);
            var newFolderPath = feng3d.pathUtils.getChildFolderPath(parentPath, newName);

            var newId = feng3d.FMath.uuid();
            var feng3dFolder = new feng3d.Feng3dFolder();
            feng3dFolder.assetsId = newId;
            feng3dFolder.meta = { guid: newId, mtimeMs: Date.now(), birthtimeMs: Date.now(), assetType: feng3dFolder.assetType };

            feng3d.assetsIDPathMap.addItem({ id: newId, path: newFolderPath, assetType: feng3dFolder.assetType });

            var assetsFile = new AssetsNode(newId);
            assetsFile.feng3dAssets = feng3dFolder;

            assetsFile.isLoaded = true;

            this._assetsIDMap[assetsFile.id] = assetsFile;

            this.saveAssets(assetsFile, () =>
            {
                this.saveProject();
                parentAssets.addChild(assetsFile);
            });
            return assetsFile;
        }

        /**
         * 新增资源
         * 
         * @param feng3dAssets 
         */
        createAssets(parentAssets: AssetsNode, fileName: string, feng3dAssets: feng3d.Feng3dAssets)
        {
            var path = parentAssets.getNewChildPath(fileName);

            feng3dAssets.assetsId = feng3d.FMath.uuid();

            feng3dAssets.meta = { guid: feng3dAssets.assetsId, mtimeMs: Date.now(), birthtimeMs: Date.now(), assetType: feng3dAssets.assetType };

            feng3d.Feng3dAssets.setAssets(feng3dAssets);

            feng3d.assetsIDPathMap.addItem({ id: feng3dAssets.assetsId, path: path, assetType: feng3dAssets.assetType });

            var assetsFile = new AssetsNode(feng3dAssets.assetsId);
            assetsFile.feng3dAssets = feng3dAssets;

            assetsFile.isLoaded = true;

            this._assetsIDMap[assetsFile.id] = assetsFile;

            this.saveAssets(assetsFile, () =>
            {
                this.saveProject();
            });
            parentAssets.addChild(assetsFile);
            return assetsFile;
        }

        /**
         * 弹出文件菜单
         */
        popupmenu(assetsFile: AssetsNode)
        {
            var menuconfig: MenuItem[] = [];
            if (assetsFile.isDirectory)
            {
                menuconfig.push(
                    {
                        label: "新建",
                        submenu: [
                            {
                                label: "文件夹", click: () =>
                                {
                                    editorData.selectObject(this.createFolder(assetsFile, "NewFolder"));
                                }
                            },
                            {
                                label: "脚本", click: () =>
                                {
                                    var fileName = assetsFile.getNewChildFileName("NewScript.ts");
                                    var scriptName = fileName.split(".").shift();

                                    editorData.selectObject(this.createAssets(assetsFile, fileName, Object.setValue(new feng3d.ScriptFile(), { textContent: assetsFileTemplates.getNewScript(scriptName) })));
                                }
                            },
                            {
                                label: "着色器", click: () =>
                                {
                                    var fileName = assetsFile.getNewChildFileName("NewShader.ts");
                                    var shaderName = fileName.split(".").shift();


                                    editorData.selectObject(this.createAssets(assetsFile, fileName, Object.setValue(new feng3d.ShaderFile(), { textContent: assetsFileTemplates.getNewShader(shaderName) })));
                                }
                            },
                            {
                                label: "js", click: () =>
                                {
                                    editorData.selectObject(this.createAssets(assetsFile, "NewJs.js", new feng3d.JSFile()));
                                }
                            },
                            {
                                label: "Json", click: () =>
                                {
                                    editorData.selectObject(this.createAssets(assetsFile, "New Json.json", new feng3d.JsonFile()));
                                }
                            },
                            {
                                label: "文本", click: () =>
                                {
                                    editorData.selectObject(this.createAssets(assetsFile, "New Text.txt", new feng3d.TextFile()));
                                }
                            },
                            { type: "separator" },
                            {
                                label: "立方体贴图", click: () =>
                                {
                                    editorData.selectObject(this.createAssets(assetsFile, "new TextureCube.json", new feng3d.TextureCube()));
                                }
                            },
                            {
                                label: "材质", click: () =>
                                {
                                    editorData.selectObject(this.createAssets(assetsFile, "New Material.json", Object.setValue(new feng3d.MaterialFile(), { material: new feng3d.Material() })));
                                }
                            },
                            {
                                label: "几何体",
                                submenu: [
                                    {
                                        label: "平面", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New PlaneGeometry.json", new feng3d.PlaneGeometry()));
                                        }
                                    },
                                    {
                                        label: "立方体", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New CubeGeometry.json", new feng3d.CubeGeometry()));
                                        }
                                    },
                                    {
                                        label: "球体", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New SphereGeometry.json", new feng3d.SphereGeometry()));
                                        }
                                    },
                                    {
                                        label: "胶囊体", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New CapsuleGeometry.json", new feng3d.CapsuleGeometry()));
                                        }
                                    },
                                    {
                                        label: "圆柱体", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New CylinderGeometry.json", new feng3d.CylinderGeometry()));
                                        }
                                    },
                                    {
                                        label: "圆锥体", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New ConeGeometry.json", new feng3d.ConeGeometry()));
                                        }
                                    },
                                    {
                                        label: "圆环", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New TorusGeometry.json", new feng3d.TorusGeometry()));
                                        }
                                    },
                                    {
                                        label: "地形", click: () =>
                                        {
                                            editorData.selectObject(this.createAssets(assetsFile, "New TerrainGeometry.json", new feng3d.TerrainGeometry()));
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

            var assetsFile = this.createAssets(this.showFloder, object.name, object);
            callback && callback(assetsFile);
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
                if (feng3d.regExps.image.test(file.name))
                {
                    feng3d.dataTransform.arrayBufferToImage(result, (img) =>
                    {
                        var assetsFile = this.createAssets(showFloder, file.name, Object.setValue(new feng3d.TextureFile(), { image: img }));
                        assetsFiles.push(assetsFile);
                        this.inputFiles(files, callback, assetsFiles);
                    });
                } else
                {
                    showFloder.addfileFromArrayBuffer(file.name, result, false, (e, assetsFile) =>
                    {
                        if (e)
                        {
                            feng3d.error(e);
                            this.inputFiles(files, callback, assetsFiles);
                        }
                        else
                        {
                            assetsFiles.push(assetsFile);
                            this.inputFiles(files, callback, assetsFiles);
                        }
                    });
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
                var filePath = feng3d.assetsIDPathMap.getPath(assetsFile.id);
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