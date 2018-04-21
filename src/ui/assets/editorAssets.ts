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

    export var editorAssets = {
        //attribute
        /**
         * 项目根路径
         */
        projectPath: "",
        assetsPath: "",
        showFloder: "",
        //function
        initproject(path: string, callback: () => void)
        {
            var assetsPath = "Assets";
            editorAssets.projectPath = path;
            editorAssets.assetsPath = assetsPath;
            //
            fs.stat(assetsPath, (err, fileInfo) =>
            {
                if (err)
                {
                    fs.mkdir(assetsPath, (err) =>
                    {
                        if (err)
                        {
                            alert("初始化项目失败！");
                            error(err);
                            return;
                        }
                        fs.stat(assetsPath, (err, fileInfo) =>
                        {
                            rootfileinfo = new AssetsFile(fileInfo);
                            editorAssets.showFloder = fileInfo.path;
                            rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                        });
                    });
                } else
                {
                    rootfileinfo = new AssetsFile(fileInfo);
                    editorAssets.showFloder = fileInfo.path;
                    rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                }
            });
        },
        /**
         * 获取文件
         * @param path 文件路径
         */
        getFile(path: string): AssetsFile
        {
            return rootfileinfo.getFile(path);
        },
        /**
         * 删除文件
         * @param path 文件路径
         */
        deletefile(path: string, callback?: (assetsFile: AssetsFile) => void)
        {
            var assetsFile = editorAssets.getFile(path);
            if (assetsFile)
                assetsFile.deleteFile(callback);
            else
            {
                fs.remove(path, () =>
                {
                    callback(null);
                });
            }
        },
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
        },
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
        },
        /**
        * 移动文件
        * @param path 移动的文件路径
        * @param destdirpath   目标文件夹
        * @param callback      完成回调
        */
        movefile: function (path: string, destdirpath: string, callback?: () => void)
        {
            var assetsfile = editorAssets.getFile(path);
            if (assetsfile)
            {
                assetsfile.move(destdirpath, callback);
            } else
            {
                var filename = assetsfile.name;
                var dest = destdirpath + "/" + filename;
                fs.move(path, dest, callback);
            }
        },
        getparentdir(path: string)
        {
            var paths = path.split("/");
            paths.pop();
            var parentdir = paths.join("/");
            return parentdir;
        },
        /**
         * 弹出文件菜单
         */
        popupmenu: function (assetsFile: AssetsFile)
        {
            var menuconfig: MenuItem[] = [];
            if (assetsFile.isDirectory)
            {
                menuconfig.push(
                    {
                        label: "Create",
                        submenu: [
                            {
                                label: "Folder", click: () =>
                                {
                                    assetsFile.addfolder("New Folder");
                                }
                            },
                            {
                                label: "Script", click: () =>
                                {
                                    assetsFile.addfile("NewScript.ts", assetsFileTemplates.NewScript);
                                }
                            },
                            {
                                label: "Json", click: () =>
                                {
                                    assetsFile.addfile("new json.json", "{}");
                                }
                            },
                            {
                                label: "Txt", click: () =>
                                {
                                    assetsFile.addfile("new text.txt", "");
                                }
                            },
                            { type: "separator" },
                            {
                                label: "Material", click: () =>
                                {
                                    assetsFile.addfile("new material" + ".material", new StandardMaterial());
                                }
                            },
                        ]
                    },
                    { type: "separator" },
                    {
                        label: "导入资源", click: () =>
                        {
                            fs.selectFile(editorAssets.inputFiles, { name: '模型文件', extensions: ["obj", 'mdl', 'fbx', "md5mesh", 'md5anim'] });
                        }
                    });
            }
            if (menuconfig.length > 0)
            {
                menuconfig.push({ type: "separator" });
            }
            menuconfig.push(
                {
                    label: "delete", click: () =>
                    {
                        assetsFile.deleteFile();
                    }
                });

            menu.popup(menuconfig);
        },
        /**
         * 获取一个新路径
         */
        getnewpath: function (path: string, callback: (newpath: string) => void)
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
        },
        saveObject: function (object: GameObject | AnimationClip | Material | Geometry, filename: string, override = false, callback?: (file: AssetsFile) => void)
        {
            var showFloder = editorAssets.getFile(editorAssets.showFloder);
            showFloder.addfile(filename, object, override, callback);
        },
        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter: function (fn: (assetsFile: AssetsFile) => boolean, next?: (assetsFile: AssetsFile) => boolean)
        {
            var files = rootfileinfo.filter(fn, next);
            return files;
        },
        inputFiles: function (files: File[] | FileList)
        {
            for (let i = 0; i < files.length; i++)
            {
                const element = files[i];
                editorAssets.inputFile(element);
            }
        },
        inputFile: function (file: File)
        {
            if (!file)
                return;
            var extensions = file.name.split(".").pop();
            var reader = new FileReader();
            switch (extensions)
            {
                case "mdl":
                    reader.addEventListener('load', (event) =>
                    {
                        war3.MdlParser.parse(event.target["result"], (war3Model) =>
                        {
                            war3Model.root = file.name.substring(0, file.name.lastIndexOf("/") + 1);
                            var gameobject = war3Model.getMesh();
                            gameobject.name = file.name.split("/").pop().split(".").shift();
                            editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                        });
                    }, false);
                    reader.readAsText(file);
                    break;
                case "obj":
                    reader.addEventListener('load', (event) =>
                    {
                        ObjLoader.parse(event.target["result"], (gameobject: GameObject) =>
                        {
                            gameobject.name = file.name.split("/").pop().split(".").shift();
                            editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                        });
                    }, false);
                    reader.readAsText(file);
                    break;
                case "fbx":
                    // fbxLoader.load(path, (gameobject) =>
                    // {
                    //     gameobject.name = path.split("/").pop().split(".").shift();
                    //     saveGameObject(gameobject);
                    //     // engine.root.addChild(gameobject);
                    // });
                    threejsLoader.load(file, (gameobject) =>
                    {
                        gameobject.name = file.name.split("/").pop().split(".").shift();
                        editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                        // engine.root.addChild(gameobject);
                    });
                    break;
                case "md5mesh":
                    reader.addEventListener('load', (event) =>
                    {
                        MD5Loader.parseMD5Mesh(event.target["result"], (gameobject) =>
                        {
                            gameobject.name = file.name.split("/").pop().split(".").shift();
                            editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                            // engine.root.addChild(gameobject);
                        });
                    }, false);
                    reader.readAsText(file);
                    break;
                case "md5anim":
                    reader.addEventListener('load', (event) =>
                    {
                        MD5Loader.parseMD5Anim(event.target["result"], (animationclip) =>
                        {
                            animationclip.name = file.name.split("/").pop().split(".").shift();
                            editorAssets.saveObject(animationclip, animationclip.name + ".anim");
                        });
                    }, false);
                    reader.readAsText(file);
                    break;
                default:
                    reader.addEventListener('load', (event) =>
                    {
                        var showFloder = editorAssets.getFile(editorAssets.showFloder);
                        var result = event.target["result"];
                        showFloder.addfile(file.name, result);
                    }, false);
                    reader.readAsArrayBuffer(file);
                    break;
            }
        }
    };
}