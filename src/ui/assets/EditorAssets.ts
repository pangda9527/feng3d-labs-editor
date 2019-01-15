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
        private assetsIDMap: { [id: string]: AssetsFile } = {};

        /**
         * 显示文件夹
         */
        @feng3d.watch("showFloderChanged")
        showFloder: AssetsFile;

        /**
         * 项目资源id树形结构
         */
        rootFile: AssetsFile;

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
            editorFS.readObject(assetsFilePath, (err, object: { id: string, path: string, isDirectory: boolean }[]) =>
            {
                object = object || [{ id: AssetsPath, path: AssetsPath, isDirectory: true }];

                feng3d.assetsIDPathMap.init();

                var files = object.map(element =>
                {
                    feng3d.assetsIDPathMap.addIDPathMap(element.id, element.path);
                    return this.assetsIDMap[element.id] = new AssetsFile(element.id, element.path, element.isDirectory);
                });

                files.forEach(element =>
                {
                    var parentPath = feng3d.pathUtils.getParentPath(element.path);
                    if (parentPath != "/" && parentPath.length > 0)
                    {
                        this.getAssetsByPath(parentPath).addChild(element);
                    }
                });

                this.rootFile = this.assetsIDMap[AssetsPath];
                this.showFloder = this.rootFile;
                this.rootFile.on("added", () => { this.saveProject() });
                this.rootFile.on("removed", () => { this.saveProject() });
                this.rootFile.isOpen = true;
                callback();
            });
        }

        /**
         * 保存项目
         * @param callback 完成回调
         */
        saveProject(callback?: (err: Error) => void)
        {
            var object = Object.keys(this.assetsIDMap).map(element =>
            {
                return { id: element, path: this.assetsIDMap[element].path, isDirectory: this.assetsIDMap[element].isDirectory };
            });

            editorFS.writeObject(assetsFilePath, object, callback);
        }

        /**
         * 新增资源
         * 
         * @param assetsFile 资源
         */
        addAssets(assetsFile: AssetsFile)
        {
            //
            feng3d.assert(!editorAssets.assetsIDMap[assetsFile.id]);
            editorAssets.assetsIDMap[assetsFile.id] = assetsFile;

            feng3d.assetsIDPathMap.addIDPathMap(assetsFile.id, assetsFile.path);

            this.saveProject();
        }

        /**
         * 保存资源
         * 
         * @param assetsFile 资源
         * @param callback 完成回调
         */
        saveAssets(assetsFile: AssetsFile, callback?: () => void)
        {
            feng3d.assert(!!editorAssets.assetsIDMap[assetsFile.id], `无法保存已经被删除的资源！`);

            if (assetsFile.isDirectory)
            {
                editorFS.mkdir(assetsFile.path, (err) =>
                {
                    if (err) feng3d.assert(!err);
                    callback && callback();
                });
                return;
            }
            editorFS.writeObject(assetsFile.path, assetsFile.feng3dAssets, (err) =>
            {
                feng3d.assert(!err, `资源 ${assetsFile.path} 保存失败！`);
                callback && callback();
            });
        }

        /**
         * 删除资源
         * 
         * @param assetsFile 资源
         */
        deleteAssets(assetsFile: AssetsFile)
        {
            feng3d.assert(!!editorAssets.assetsIDMap[assetsFile.id]);

            delete editorAssets.assetsIDMap[assetsFile.id];
            feng3d.assetsIDPathMap.deleteByID(assetsFile.id);

            editorFS.deleteFile(assetsFile.path);

            this.saveProject();

            feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: assetsFile.id });
        }

        /**
         * 根据资源编号获取文件
         * 
         * @param assetsId 文件路径
         */
        getAssetsByID(assetsId: string)
        {
            return this.assetsIDMap[assetsId];
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
         * 获取脚本列表
         */
        getScripts()
        {
            var files = editorAssets.assetsIDMap;
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
            var assetsFiles = Object.keys(editorAssets.assetsIDMap).map(key => editorAssets.assetsIDMap[key]).filter(element => element.feng3dAssets instanceof type);
            return assetsFiles;
        }

        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void)
        {
            editorFS.readObject(path, (err, object: feng3d.GameObject) =>
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
         * 弹出文件菜单
         */
        popupmenu(assetsFile: AssetsFile)
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
                                    editorData.selectObject(assetsFile.addFolder("NewFolder"));
                                }
                            },
                            {
                                label: "脚本", click: () =>
                                {
                                    var fileName = assetsFile.getNewChildFileName("NewScript.ts");
                                    var scriptName = fileName.split(".").shift();

                                    editorData.selectObject(assetsFile.addAssets(fileName, Object.setValue(new feng3d.ScriptFile(), { textContent: assetsFileTemplates.getNewScript(scriptName) })));
                                }
                            },
                            {
                                label: "着色器", click: () =>
                                {
                                    var fileName = assetsFile.getNewChildFileName("NewShader.ts");
                                    var shaderName = fileName.split(".").shift();


                                    editorData.selectObject(assetsFile.addAssets(fileName, Object.setValue(new feng3d.ShaderFile(), { textContent: assetsFileTemplates.getNewShader(shaderName) })));
                                }
                            },
                            {
                                label: "js", click: () =>
                                {
                                    editorData.selectObject(assetsFile.addAssets("NewJs.js", new feng3d.JSFile()));
                                }
                            },
                            {
                                label: "Json", click: () =>
                                {
                                    editorData.selectObject(assetsFile.addAssets("New Json.json", new feng3d.JsonFile()));
                                }
                            },
                            {
                                label: "文本", click: () =>
                                {
                                    editorData.selectObject(assetsFile.addAssets("New Text.txt", new feng3d.TextFile()));
                                }
                            },
                            { type: "separator" },
                            {
                                label: "立方体贴图", click: () =>
                                {
                                    editorData.selectObject(assetsFile.addAssets("new TextureCube.json", new feng3d.TextureCube()));
                                }
                            },
                            {
                                label: "材质", click: () =>
                                {
                                    editorData.selectObject(assetsFile.addAssets("New Material.json", new feng3d.Material()));
                                }
                            },
                            {
                                label: "几何体",
                                submenu: [
                                    {
                                        label: "平面", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New PlaneGeometry.json", new feng3d.PlaneGeometry()));
                                        }
                                    },
                                    {
                                        label: "立方体", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New CubeGeometry.json", new feng3d.CubeGeometry()));
                                        }
                                    },
                                    {
                                        label: "球体", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New SphereGeometry.json", new feng3d.SphereGeometry()));
                                        }
                                    },
                                    {
                                        label: "胶囊体", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New CapsuleGeometry.json", new feng3d.CapsuleGeometry()));
                                        }
                                    },
                                    {
                                        label: "圆柱体", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New CylinderGeometry.json", new feng3d.CylinderGeometry()));
                                        }
                                    },
                                    {
                                        label: "圆锥体", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New ConeGeometry.json", new feng3d.ConeGeometry()));
                                        }
                                    },
                                    {
                                        label: "圆环", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New TorusGeometry.json", new feng3d.TorusGeometry()));
                                        }
                                    },
                                    {
                                        label: "地形", click: () =>
                                        {
                                            editorData.selectObject(assetsFile.addAssets("New TerrainGeometry.json", new feng3d.TerrainGeometry()));
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
                            assetsFile.save();
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
        saveObject(object: feng3d.Feng3dAssets, callback?: (file: AssetsFile) => void)
        {
            feng3d.error(`未实现`);

            var assetsFile = this.showFloder.addAssets(object.name, object);
            callback && callback(assetsFile);
        }

        /**
         * 
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetsFiles 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files: File[], callback?: (files: AssetsFile[]) => void, assetsFiles: AssetsFile[] = [])
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
                    var imagePath = showFloder.getNewChildPath(file.name);

                    editorFS.writeArrayBuffer(imagePath, result, err =>
                    {
                        var urlImageTexture2D = Object.setValue(new feng3d.UrlImageTexture2D(), { name: file.name })
                        urlImageTexture2D.url = imagePath;
                        var assetsFile = showFloder.addAssets(file.name, urlImageTexture2D);
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
            editorFS.readString("project.js", (err, content) =>
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
        private parserMenu(menuconfig: MenuItem[], assetsFile: AssetsFile)
        {
            if (assetsFile.feng3dAssets instanceof feng3d.Feng3dFile)
            {
                var extensions = feng3d.pathUtils.getExtension(assetsFile.path);
                var filePath = assetsFile.path;
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