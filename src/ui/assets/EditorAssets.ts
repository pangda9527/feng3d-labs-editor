namespace feng3d.editor
{
    export interface AssetsEventMap
    {
        changed
        openChanged
    }

    export var assetsDispather: IEventDispatcher<AssetsEventMap> = new EventDispatcher();

    export var editorAssets: EditorAssets;

    export class EditorAssets
    {
        //attribute
        assetsPath = "Assets/";
        showFloder = "Assets/";

        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent = null

        files: { [path: string]: AssetsFile } = {};

        //function
        initproject(callback: () => void)
        {
            fs.mkdir(this.assetsPath, (err) =>
            {
                if (err)
                {
                    alert("初始化项目失败！");
                    error(err);
                    return;
                }
                fs.getAllfilepathInFolder("", (err, filepaths) =>
                {
                    assert(!err);
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
            fs.delete(path, (err) =>
            {
                if (err) error(err);

                if (pathUtils.isDirectory)
                {
                    Object.keys(this.files).forEach(element =>
                    {
                        if (element.indexOf(path) == 0)
                        {
                            delete this.files[element];
                        }
                    });
                }
                delete this.files[path];
                callback && callback();
            });
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
                                    assetsFile.addfile("new texture" + ".texture.json", new Texture2D());
                                }
                            },
                            {
                                label: "材质", click: () =>
                                {
                                    assetsFile.addfile("new material" + ".material.json", materialFactory.create("standard"));
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
                        editorAssets.deletefile(assetsFile.path);
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
                    || file.extension == AssetExtension.json
                    || file.extension == AssetExtension.material
                    || file.extension == AssetExtension.gameobject
                    || file.extension == AssetExtension.geometry
                    || file.extension == AssetExtension.scene
                    || file.extension == AssetExtension.script
                )
                {
                    menu = {
                        label: "编辑", click: () =>
                        {
                            var url = `codeeditor.html?fstype=${assets.type}&project=${editorcache.projectname}&path=${file.path}`;
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
                fs.exists(path, (exists) =>
                {
                    if (exists)
                        searchnewpath();
                    else
                        callback(path);
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
                                    var paths = file.path.split("/");
                                    paths.pop();
                                    war3Model.root = paths.join("/") + "/";
                                    var gameobject = war3Model.getMesh();
                                    gameobject.name = file.name;
                                    this.saveObject(gameobject, gameobject.name + "." + AssetExtension.gameobject);
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
                                    this.saveObject(gameobject, gameobject.name + "." + AssetExtension.gameobject);
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
                                    this.saveObject(gameobject, gameobject.name + "." + AssetExtension.gameobject);
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
                                    this.saveObject(gameobject, gameobject.name + "." + AssetExtension.gameobject);
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
                                    this.saveObject(animationclip, animationclip.name + "." + AssetExtension.anim);
                                });
                            });
                        }
                    });
                    break;
            }
        }
    }

    editorAssets = new EditorAssets();
    export var codeeditoWin: Window;
}