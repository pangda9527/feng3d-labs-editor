namespace feng3d
{
    export interface Feng3dEventMap
    {
        /**
         * 资源显示文件夹发生变化
         */
        "assets.showFloderChanged": { oldpath: string, newpath: string };
        /**
         * 删除文件
         */
        "assets.deletefile": { path: string };
    }
}

namespace editor
{

    export var editorAssets: EditorAssets;

    export class EditorAssets
    {
        //attribute
        assetsPath = "Assets/";

        /**
         * 显示文件夹
         */
        @feng3d.watch("showFloderChanged")
        showFloder = "Assets/";

        files: { [path: string]: AssetsFile } = {};

        constructor()
        {
            feng3d.feng3dDispatcher.on("assets.parsed", this.onParsed, this);
        }

        //function
        initproject(callback: () => void)
        {
            assets.mkdir(this.assetsPath, (err) =>
            {
                if (err)
                {
                    alert("初始化项目失败！");
                    feng3d.error(err);
                    return;
                }
                this.files[this.assetsPath] = new AssetsFile(this.assetsPath);
                assets.getAllfilepathInFolder(this.assetsPath, (err, filepaths) =>
                {
                    feng3d.assert(!err);
                    filepaths.forEach(element =>
                    {
                        this.files[element] = new AssetsFile(element);
                    });
                    callback();
                });
            });
        }

        /**
         * 获取文件
         * @param path 文件路径
         */
        getFile(path: string): AssetsFile
        {
            return this.files[path];
        }

        /**
         * 删除文件
         * @param path 文件路径
         */
        deletefile(path: string, callback?: () => void, includeRoot = false)
        {
            if (path == this.assetsPath && !includeRoot)
            {
                alert("无法删除根目录");
                return;
            }
            assets.delete(path, (err) =>
            {
                if (err) feng3d.error(err);

                if (feng3d.pathUtils.isDirectory(path))
                {
                    Object.keys(this.files).forEach(element =>
                    {
                        if (element.indexOf(path) == 0)
                        {
                            delete this.files[element];
                            feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: element });
                        }
                    });
                    if (editorAssets.showFloder == path && path != editorAssets.assetsPath)
                    {
                        editorAssets.showFloder = feng3d.pathUtils.getParentPath(path);
                    }
                }
                delete this.files[path];
                feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: path });
                editorui.assetsview.invalidateAssetstree();
                callback && callback();
            });
        }

        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void)
        {
            assets.readFileAsString(path, (err, data) =>
            {
                if (err)
                {
                    callback(err, null);
                    return;
                }
                var json = JSON.parse(data);
                var sceneobject = feng3d.serialization.deserialize(json);
                var scene = sceneobject.getComponent(feng3d.Scene3D);
                scene.initCollectComponents();
                callback(null, scene);
            });
        }

        /**
         * 保存场景到文件
         * @param path 场景路径
         * @param scene 保存的场景
         */
        saveScene(path: string, scene: feng3d.Scene3D, callback: (err: Error) => void = (err) => { })
        {
            var obj = feng3d.serialization.serialize(scene.gameObject);
            var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            feng3d.dataTransform.stringToUint8Array(str, (uint8Array) =>
            {
                assets.writeFile(path, uint8Array, callback)
            });
        }

        /**
        * 移动文件
        * @param path 移动的文件路径
        * @param destdirpath   目标文件夹
        * @param callback      完成回调
        */
        movefile(path: string, destdirpath: string, callback?: () => void)
        {
            var assetsfile = this.getFile(path);
            if (assetsfile)
            {
                assetsfile.moveToDir(destdirpath, callback);
            } else
            {
                var filename = path.split("/").pop();
                var dest = destdirpath + "/" + filename;
                assets.move(path, dest, callback);
            }
        }

        getparentdir(path: string)
        {
            var paths = path.split("/");
            paths.pop();
            var parentdir = paths.join("/");
            return parentdir;
        }

        /**
         * 弹出文件菜单
         */
        popupmenu(assetsFile: AssetsFile, othermenus?: { rename?: MenuItem })
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
                                    assetsFile.addfolder("New Folder");
                                }
                            },
                            {
                                label: "脚本", click: () =>
                                {
                                    var scriptName = "NewScript";
                                    assetsFile.addfile(`${scriptName}.script.ts`, assetsFileTemplates.getNewScript(scriptName));
                                }
                            },
                            {
                                label: "着色器", click: () =>
                                {
                                    var shadername = "NewShader"
                                    assetsFile.addfile(`${shadername}.shader.ts`, assetsFileTemplates.getNewShader(shadername));
                                }
                            },
                            {
                                label: "ts", click: () =>
                                {
                                    assetsFile.addfile("new file.ts", "");
                                }
                            },
                            {
                                label: "js", click: () =>
                                {
                                    assetsFile.addfile("new file.js", "");
                                }
                            },
                            {
                                label: "Json", click: () =>
                                {
                                    assetsFile.addfile("new json.json", "{}");
                                }
                            },
                            {
                                label: "文本", click: () =>
                                {
                                    assetsFile.addfile("new text.txt", "");
                                }
                            },
                            { type: "separator" },
                            {
                                label: "贴图", click: () =>
                                {
                                    assetsFile.addfile("new texture" + ".texture.json", new feng3d.UrlImageTexture2D());
                                }
                            },
                            {
                                label: "立方体贴图", click: () =>
                                {
                                    assetsFile.addfile("new texturecube" + ".texturecube.json", new feng3d.TextureCube());
                                }
                            },
                            {
                                label: "材质", click: () =>
                                {
                                    assetsFile.addfile("new material" + ".material.json", new feng3d.Material());
                                }
                            },
                        ]
                    },
                    { type: "separator" },
                    {
                        label: "导入资源", click: () =>
                        {
                            assets.selectFile((fileList: FileList) =>
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
            if ([feng3d.AssetExtension.ts,
            feng3d.AssetExtension.js,
            feng3d.AssetExtension.txt,
            feng3d.AssetExtension.shader,
            feng3d.AssetExtension.json,
            feng3d.AssetExtension.texture2d,
            feng3d.AssetExtension.material,
            feng3d.AssetExtension.gameobject,
            feng3d.AssetExtension.geometry,
            feng3d.AssetExtension.scene,
            feng3d.AssetExtension.script,
            feng3d.AssetExtension.mtl,
            feng3d.AssetExtension.obj,
            feng3d.AssetExtension.md5mesh,
            feng3d.AssetExtension.md5anim,
            feng3d.AssetExtension.mdl
            ].indexOf(assetsFile.extension) != -1
            )
            {
                menuconfig.push({
                    label: "编辑", click: () =>
                    {
                        var url = `codeeditor.html?fstype=${feng3d.assets.type}&project=${editorcache.projectname}&path=${assetsFile.path}`;
                        url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
                        // if (assets.type == FSType.native)
                        // {
                        //     alert(`请使用本地编辑器编辑代码，推荐 vscode`);
                        // } else
                        // {
                        if (codeeditoWin) codeeditoWin.close();
                        codeeditoWin = window.open(url);
                        // }
                    }
                });
            }

            // 解析菜单
            this.parserMenu(menuconfig, assetsFile);

            menuconfig.push({
                label: "导出", click: () =>
                {
                    assets.readFileAsBlob(assetsFile.path, (err, blob) =>
                    {
                        saveAs(blob, assetsFile.name);
                    });
                }
            }, {
                    label: "删除", click: () =>
                    {
                        editorAssets.deletefile(assetsFile.path);
                    }
                });

            if (othermenus && othermenus.rename)
            {
                menuconfig.push(othermenus.rename);
            }

            menu.popup(menuconfig);
        }

        /**
         * 获取一个新路径
         */
        getnewpath(path: string, callback: (newpath: string) => void)
        {
            var index = 0;
            var basepath = "";
            var ext = "";
            if (path.indexOf(".") == -1)
            {
                basepath = path;
                ext = "";
            } else
            {
                basepath = path.substring(0, path.indexOf("."));
                ext = path.substring(path.indexOf("."));
            }
            searchnewpath();

            function newpath()
            {
                var path = index == 0 ?
                    (basepath + ext) :
                    (basepath + " " + index + ext);
                index++;
                return path;
            }

            function searchnewpath()
            {
                var path = newpath();
                assets.exists(path, (exists) =>
                {
                    if (exists)
                        searchnewpath();
                    else
                        callback(path);
                });
            }
        }

        saveObject(object: feng3d.GameObject | feng3d.AnimationClip | feng3d.Material | feng3d.Geometry, filename: string, callback?: (file: AssetsFile) => void)
        {
            var showFloder = this.getFile(this.showFloder);
            showFloder.addfile(filename, object, true, callback);
        }

        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter(fn: (assetsFile: AssetsFile) => boolean)
        {
            var results: AssetsFile[] = [];
            for (const path in this.files)
            {
                const element = this.files[path];
                if (fn(element))
                    results.push(element);
            }
            return results;
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
                editorData.selectObject.apply(editorData, assetsFiles);
                callback && callback(assetsFiles);
                return;
            }
            var file = files.shift();
            var reader = new FileReader();
            reader.addEventListener('load', (event) =>
            {
                var result: ArrayBuffer = event.target["result"];
                var showFloder = this.getFile(this.showFloder);
                if (regExps.image.test(file.name))
                {
                    var imagePath = "Library/" + file.name;
                    assets.writeFile(imagePath, result, err =>
                    {
                        var texture2dName = feng3d.pathUtils.getName(file.name) + "." + feng3d.AssetExtension.texture2d;
                        var assetsFile = showFloder.addfile(texture2dName, new feng3d.UrlImageTexture2D().value({ url: imagePath }));
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
            assets.readFileAsString("project.js", (err, content) =>
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
        private parserMenu(menuconfig: MenuItem[], file: AssetsFile)
        {
            var extensions = file.path.split(".").pop();
            switch (extensions)
            {
                case "mdl": menuconfig.push({ label: "解析", click: () => feng3d.mdlLoader.load(file.path) }); break;
                case "obj": menuconfig.push({ label: "解析", click: () => feng3d.objLoader.load(file.path) }); break;
                case "mtl": menuconfig.push({ label: "解析", click: () => feng3d.mtlLoader.load(file.path) }); break;
                case "fbx": menuconfig.push({ label: "解析", click: () => threejsLoader.load(file.path) }); break;
                case "md5mesh": menuconfig.push({ label: "解析", click: () => feng3d.md5Loader.load(file.path) }); break;
                case "md5anim": menuconfig.push({ label: "解析", click: () => feng3d.md5Loader.loadAnim(file.path) }); break;
            }
        }

        private showFloderChanged(property, oldValue, newValue)
        {
            feng3d.feng3dDispatcher.dispatch("assets.showFloderChanged", { oldpath: oldValue, newpath: newValue });
        }

        private onParsed(e: feng3d.Event<any>)
        {
            var data = e.data;
            if (data instanceof feng3d.GameObject)
            {
                this.saveObject(data, data.name + "." + feng3d.AssetExtension.gameobject);
            } else if (data instanceof feng3d.Material)
            {
                this.saveObject(data, data.name + "." + feng3d.AssetExtension.material);
            } else if (data instanceof feng3d.AnimationClip)
            {
                this.saveObject(data, data.name + "." + feng3d.AssetExtension.anim);
            }
        }
    }

    editorAssets = new EditorAssets();
    export var codeeditoWin: Window;
}