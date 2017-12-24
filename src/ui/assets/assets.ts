namespace feng3d.editor
{
    export interface AssetsEventMap
    {
        changed
        openChanged
    }

    export var assetsDispather: IEventDispatcher<AssetsEventMap> = new EventDispatcher();

    export var assets = {
        //attribute
        /**
         * 项目根路径
         */
        projectPath: "",
        assetsPath: "",
        showFloder: "",
        //function
        initproject: initproject,
        getFile: getFile,
        deletefile: deletefile,
        /**
        * 移动文件
        * @param path 移动的文件路径
        * @param destdirpath   目标文件夹
        * @param callback      完成回调
        */
        movefile: function (path: string, destdirpath: string, callback?: () => void)
        {
            var assetsfile = getFile(path);
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
        getparentdir: getparentdir,
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
                        label: "create folder", click: () =>
                        {
                            assetsFile.addfolder("New Folder");
                        }
                    },
                    {
                        label: "create script", click: () =>
                        {
                            assetsFile.addfile("NewScript.ts", assetsFileTemplates.NewScript);
                        }
                    },
                    {
                        label: "create json", click: () =>
                        {
                            assetsFile.addfile("new json.json", "{}");
                        }
                    },
                    {
                        label: "create txt", click: () =>
                        {
                            assetsFile.addfile("new text.txt", "");
                        }
                    },
                    { type: "separator" },
                    {
                        label: "create material", click: () =>
                        {
                            assetsFile.addfile("new material" + ".material", new StandardMaterial());
                        }
                    },
                    { type: "separator" },
                    {
                        label: "导入资源", click: () =>
                        {
                            fs.selectFile(assets.inputFiles, { name: '模型文件', extensions: ["obj", 'mdl', 'fbx', "md5mesh", 'md5anim'] });
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
        saveObject: function (object: GameObject | AnimationClip, filename: string, override = false, callback?: (file: AssetsFile) => void)
        {
            var showFloder = assets.getFile(assets.showFloder);
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
                assets.inputFile(element);
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
                            assets.saveObject(gameobject, gameobject.name + ".gameobject");
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
                            assets.saveObject(gameobject, gameobject.name + ".gameobject");
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
                        assets.saveObject(gameobject, gameobject.name + ".gameobject");
                        // engine.root.addChild(gameobject);
                    });
                    break;
                case "md5mesh":
                    reader.addEventListener('load', (event) =>
                    {
                        MD5Loader.parseMD5Mesh(event.target["result"], (gameobject) =>
                        {
                            gameobject.name = file.name.split("/").pop().split(".").shift();
                            assets.saveObject(gameobject, gameobject.name + ".gameobject");
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
                            assets.saveObject(animationclip, animationclip.name + ".anim");
                        });
                    }, false);
                    reader.readAsText(file);
                    break;
                default:
                    reader.addEventListener('load', (event) =>
                    {
                        var showFloder = assets.getFile(assets.showFloder);
                        var result = event.target["result"];
                        showFloder.addfile(file.name, result);
                    }, false);
                    if (/(jpg|png)/.test(extensions))
                    {
                        reader.readAsDataURL(file);
                    } else
                    {
                        reader.readAsArrayBuffer(file);
                    }
                    break;
            }
        }
    };

    function initproject(path: string, callback: () => void)
    {
        var assetsPath = "Assets";
        assets.projectPath = path;
        assets.assetsPath = assetsPath;
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
                        assets.showFloder = fileInfo.path;
                        rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                    });
                });
            } else
            {
                rootfileinfo = new AssetsFile(fileInfo);
                assets.showFloder = fileInfo.path;
                rootfileinfo.initChildren(Number.MAX_VALUE, callback);
            }
        });
    }

    /**
     * 根文件
     */
    var rootfileinfo: AssetsFile;

    /**
     * 获取文件
     * @param path 文件路径
     */
    function getFile(path: string): AssetsFile
    {
        return rootfileinfo.getFile(path);
    }

    /**
     * 删除文件
     * @param path 文件路径
     */
    function deletefile(path: string, callback?: (assetsFile: AssetsFile) => void)
    {
        var assetsFile = getFile(path);
        if (assetsFile)
            assetsFile.deleteFile(callback);
        else
        {
            fs.remove(path, () =>
            {
                callback(null);
            });
        }
    }

    function getparentdir(path: string)
    {
        var paths = path.split("/");
        paths.pop();
        var parentdir = paths.join("/");
        return parentdir;
    }
}