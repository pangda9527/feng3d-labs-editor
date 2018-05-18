namespace feng3d.editor
{
    export interface AssetsEventMap
    {
        changed
        openChanged
    }

    export var assetsDispather: IEventDispatcher<AssetsEventMap> = new EventDispatcher();

    /**
     * 根文件
     */
    var rootfileinfo: AssetsFile;

    export var editorAssets: EditorAssets;

    export class EditorAssets
    {
        //attribute
        /**
         * 项目名称
         */
        projectname = "";
        assetsPath = "Assets/";
        showFloder = "Assets/";

        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent = null

        //function
        initproject(path: string, callback: () => void)
        {
            this.projectname = path;
            //
            fs.stat(this.assetsPath, (err, fileInfo) =>
            {
                if (err)
                {
                    fs.mkdir(this.assetsPath, (err) =>
                    {
                        if (err)
                        {
                            alert("初始化项目失败！");
                            error(err);
                            return;
                        }
                        fs.stat(this.assetsPath, (err, fileInfo) =>
                        {
                            rootfileinfo = new AssetsFile(fileInfo);
                            rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                        });
                    });
                } else
                {
                    rootfileinfo = new AssetsFile(fileInfo);
                    rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                }
            });
        }
        /**
         * 获取文件
         * @param path 文件路径
         */
        getFile(path: string): AssetsFile
        {
            return rootfileinfo.getFile(path);
        }
        /**
         * 删除文件
         * @param path 文件路径
         */
        deletefile(path: string, callback?: (assetsFile: AssetsFile) => void, includeRoot = false)
        {
            var assetsFile = this.getFile(path);
            if (assetsFile)
                assetsFile.deleteFile(callback, includeRoot);
            else
            {
                fs.delete(path, () =>
                {
                    callback(null);
                });
            }
        }
        readScene(path: string, callback: (err: Error, scene: Scene3D) => void)
        {
            fs.readFileAsString(path, (err, data) =>
            {
                if (err)
                {
                    callback(err, null);
                    return;
                }
                var json = JSON.parse(data);
                var sceneobject = serialization.deserialize(json);
                var scene = sceneobject.getComponent(Scene3D);
                scene.initCollectComponents();
                callback(null, scene);
            });
        }
        /**
         * 保存场景到文件
         * @param path 场景路径
         * @param scene 保存的场景
         */
        saveScene(path: string, scene: Scene3D, callback: (err: Error) => void = (err) => { })
        {
            var obj = serialization.serialize(scene.gameObject);
            var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            dataTransform.stringToUint8Array(str, (uint8Array) =>
            {
                fs.writeFile(path, uint8Array, callback)
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
                assetsfile.move(destdirpath, callback);
            } else
            {
                var filename = path.split("/").pop();
                var dest = destdirpath + "/" + filename;
                fs.move(path, dest, callback);
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
                                    assetsFile.addfolder("New Folder");
                                }
                            },
                            {
                                label: "脚本", click: () =>
                                {
                                    var scriptName = "NewScript";
                                    assetsFile.addfile(`${scriptName}.ts`, assetsFileTemplates.getNewScript(scriptName));
                                }
                            },
                            {
                                label: "着色器", click: () =>
                                {
                                    var shadername = "NewShader"
                                    assetsFile.addfile(`${shadername}.shader`, assetsFileTemplates.getNewShader(shadername));
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
                                label: "材质", click: () =>
                                {
                                    assetsFile.addfile("new material" + ".material", materialFactory.create("standard"));
                                }
                            },
                        ]
                    },
                    { type: "separator" },
                    {
                        label: "导入资源", click: () =>
                        {
                            fs.selectFile((file: FileList) =>
                            {
                                this.inputFiles(file);
                            });
                        }
                    });
            }
            if (menuconfig.length > 0)
            {
                menuconfig.push({ type: "separator" });
            }

            var openMenu = getOpenCodeEditorMenu(assetsFile);
            if (openMenu)
                menuconfig.push(openMenu);

            // 解析菜单
            this.parserMenu(menuconfig, assetsFile);

            menuconfig.push(
                {
                    label: "删除", click: () =>
                    {
                        assetsFile.deleteFile();
                    }
                });

            menu.popup(menuconfig);

            function getOpenCodeEditorMenu(file: AssetsFile)
            {
                var menu: MenuItem;
                // 使用编辑器打开
                if (file.extension == AssetExtension.ts
                    || file.extension == AssetExtension.js
                    || file.extension == AssetExtension.txt
                    || file.extension == AssetExtension.shader
                )
                {
                    menu = {
                        label: "编辑", click: () =>
                        {
                            var url = `codeeditor.html?fstype=${assets.type}&project=${editorcache.projectname}&path=${file.path}&extension=${file.extension}`;
                            url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
                            window.open(url);
                        }
                    }
                } else if (file.extension == AssetExtension.json
                    || file.extension == AssetExtension.material
                    || file.extension == AssetExtension.gameobject
                    || file.extension == AssetExtension.geometry
                    || file.extension == AssetExtension.anim
                )
                {
                    menu = {
                        label: "编辑", click: () =>
                        {
                            var url = `codeeditor.html?fstype=${assets.type}&project=${editorcache.projectname}&path=${file.path}&extension=${AssetExtension.json}`;
                            url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
                            window.open(url);
                        }
                    }
                }
                return menu;
            }
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
                fs.stat(path, (err, stats) =>
                {
                    if (err)
                        callback(path);
                    else
                    {
                        searchnewpath();
                    }
                });
            }
        }
        saveObject(object: GameObject | AnimationClip | Material | Geometry, filename: string, override = false, callback?: (file: AssetsFile) => void)
        {
            var showFloder = this.getFile(this.showFloder);
            showFloder.addfile(filename, object, override, callback);
        }
        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter(fn: (assetsFile: AssetsFile) => boolean, next?: (assetsFile: AssetsFile) => boolean)
        {
            var files = rootfileinfo.filter(fn, next);
            return files;
        }
        inputFiles(files: File[] | FileList)
        {
            for (let i = 0; i < files.length; i++)
            {
                const file = files[i];
                var reader = new FileReader();
                reader.addEventListener('load', (event) =>
                {
                    var showFloder = this.getFile(this.showFloder);
                    var result = event.target["result"];
                    showFloder.addfile(file.name, result);
                }, false);
                reader.readAsArrayBuffer(file);
            }
        }
        runProjectScript(callback?: () => void)
        {
            fs.readFileAsString("project.js", (err, content) =>
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
                        warn(error);
                    }
                }
                this._preProjectJsContent = content;
                callback && callback();
            });
        }
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
                case "mdl":
                    menuconfig.push({
                        label: "解析", click: () =>
                        {
                            fs.readFileAsString(file.path, (err, content) =>
                            {
                                war3.MdlParser.parse(content, (war3Model) =>
                                {
                                    war3Model.root = file.parent.name;
                                    var gameobject = war3Model.getMesh();
                                    gameobject.name = file.name;
                                    this.saveObject(gameobject, gameobject.name + ".gameobject");
                                });
                            });
                        }
                    });
                    break;
                case "obj":
                    menuconfig.push({
                        label: "解析", click: () =>
                        {
                            fs.readFileAsString(file.path, (err, content) =>
                            {
                                ObjLoader.parse(content, (gameobject: GameObject) =>
                                {
                                    gameobject.name = file.name;
                                    this.saveObject(gameobject, gameobject.name + ".gameobject");
                                });
                            });
                        }
                    });
                    break;
                case "fbx":

                    menuconfig.push({
                        label: "解析", click: () =>
                        {

                            fs.readFile(file.path, (err, data) =>
                            {
                                threejsLoader.load(data, (gameobject) =>
                                {
                                    gameobject.name = file.name;
                                    this.saveObject(gameobject, gameobject.name + ".gameobject");
                                    // engine.root.addChild(gameobject);
                                });
                            });
                        }
                    });
                    break;
                case "md5mesh":

                    menuconfig.push({
                        label: "解析", click: () =>
                        {

                            fs.readFileAsString(file.path, (err, content) =>
                            {
                                MD5Loader.parseMD5Mesh(content, (gameobject) =>
                                {
                                    gameobject.name = file.name.split("/").pop().split(".").shift();
                                    this.saveObject(gameobject, gameobject.name + ".gameobject");
                                    // engine.root.addChild(gameobject);
                                });

                            });
                        }
                    });
                    break;
                case "md5anim":
                    menuconfig.push({
                        label: "解析", click: () =>
                        {
                            fs.readFileAsString(file.path, (err, content) =>
                            {
                                MD5Loader.parseMD5Anim(content, (animationclip) =>
                                {
                                    animationclip.name = file.name.split("/").pop().split(".").shift();
                                    this.saveObject(animationclip, animationclip.name + ".anim");
                                });
                            });
                        }
                    });
                    break;
            }
        }
    }

    editorAssets = new EditorAssets();
}