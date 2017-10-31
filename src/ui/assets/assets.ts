module feng3d.editor
{

    export var assets = {
        //attribute
        /**
         * 项目根路径
         */
        projectPath: "",
        assetsPath: "",
        showFloder: "",
        rootfileinfo: null,
        //function
        initproject: initproject,
        getFileInfo: getFileInfo,
        deletefile: deletefile,
        addfile: addfile,
        addfolder: addfolder,
        rename: rename,
        move: move,
        getparentdir: getparentdir,
        popupmenu: popupmenu,
        getnewpath: getnewpath,
        saveGameObject: saveGameObject,
        saveObject: saveObject,
    };

    function initproject(path: string, callback: () => void)
    {
        var assetsPath = path + "/Assets";
        file.mkdir(assetsPath, (err) =>
        {
            file.detailStat(assetsPath, (err, fileInfo) =>
            {
                assets.projectPath = path;
                assets.assetsPath = assetsPath;
                //
                assets.rootfileinfo = fileInfo;
                assets.showFloder = fileInfo.path;
                treeMap(fileInfo, (node, parent) =>
                {
                    fileInfo.children && fileInfo.children.sort(fileinfocompare);
                });
                assetstree.init(fileInfo);
                callback();
            });
        });
    }

    function getFileInfo(path: string, fileinfo: FileInfo = null): FileInfo
    {
        fileinfo = fileinfo || assets.rootfileinfo;
        if (path == fileinfo.path)
            return fileinfo;
        if (path.indexOf(fileinfo.path) == -1)
            return null;
        if (fileinfo.children)
        {
            for (var i = 0; i < fileinfo.children.length; i++)
            {
                var result = getFileInfo(path, fileinfo.children[i]);
                if (result)
                    return result;
            }
        }
        return null;
    }

    function deletefile(path: string)
    {
        if (path == assets.assetsPath)
        {
            alert("无法删除根目录");
            return;
        }
        file.remove(path, (err) =>
        {
            deletefileinfo(path);
        });
        if (/\.ts\b/.test(path))
        {
            deletefile(path.replace(/\.ts\b/, ".js"));
            deletefile(path.replace(/\.ts\b/, ".js.map"));
        }
    }

    function deletefileinfo(path: string)
    {
        var paths = path.split("/");
        paths.pop();
        var parentdir = paths.join("/");
        var parentfileinfo = getFileInfo(parentdir);
        if (!parentfileinfo.children)
            return;
        for (var i = parentfileinfo.children.length - 1; i >= 0; i--)
        {
            var element = parentfileinfo.children[i];
            if (element.path == path)
            {
                parentfileinfo.children.splice(i, 1);
                if (element.isDirectory)
                {
                    assetstree.remove(element.path);
                }
            }
        }
        if (path == assets.showFloder)
            assets.showFloder = getparentdir(path);
        editorui.assetsview.updateShowFloder();
    }

    function addfileinfo(fileinfo: FileInfo)
    {
        fileinfo.children = fileinfo.children || [];
        //
        var parentdir = assets.getparentdir(fileinfo.path);
        var parentfileinfo = getFileInfo(parentdir);
        parentfileinfo.children = parentfileinfo.children || [];
        //
        for (var i = 0; i < parentfileinfo.children.length; i++)
        {
            if (parentfileinfo.children[i].path == fileinfo.path)
            {
                parentfileinfo.children.splice(i, 1);
                break;
            }
        }
        parentfileinfo.children.push(fileinfo);
        parentfileinfo.children.sort(fileinfocompare);
        if (fileinfo.isDirectory)
        {
            assetstree.add(fileinfo);
        }
        editorui.assetsview.updateShowFloder();
    }

    function addfile(path: string, content: string, newfile = true)
    {
        if (newfile)
        {
            assets.getnewpath(path, (path) =>
            {
                addfile(path, content, false);
            });
            return;
        }

        file.writeFile(path, content, (e) =>
        {
            file.stat(path, (err, stats) =>
            {
                addfileinfo(stats);
            });
        });
    }

    function addfolder(folder: string, newfile = true)
    {
        if (newfile)
        {
            assets.getnewpath(folder, (path) =>
            {
                addfolder(path, false);
            });
            return;
        }

        file.mkdir(folder, (e) =>
        {
            file.stat(folder, (err, stats) =>
            {
                addfileinfo(stats);
            });
        });
    }

    function getparentdir(path: string)
    {
        var paths = path.split("/");
        paths.pop();
        var parentdir = paths.join("/");
        return parentdir;
    }

    function popupmenu(fileinfo: FileInfo)
    {
        var folderpath = assets.getparentdir(fileinfo.path);
        if (fileinfo.isDirectory)
            folderpath = fileinfo.path;

        var menuconfig: MenuItem[] = [
            {
                label: "create folder", click: () =>
                {
                    assets.addfolder(folderpath + "/" + "New Folder");
                }
            },
            {
                label: "create script", click: () =>
                {
                    file.readFile("feng3d-editor/template/templates/NewScript.ts", (err, data) =>
                    {
                        assets.addfile(folderpath + "/NewScript.ts", data);
                    });
                }
            },
            {
                label: "create json", click: () =>
                {
                    assets.addfile(folderpath + "/new json.json", "{}");
                }
            },
            {
                label: "create txt", click: () =>
                {
                    assets.addfile(folderpath + "/new text.txt", "");
                }
            },
            { type: "separator" },
            {
                label: "导入模型", click: () =>
                {
                    electron.call("selected-file", {
                        callback: (path) =>
                        {
                            if (!path)
                                return;
                            path = path.replace(/\\/g, "/");
                            var extensions = path.split(".").pop();
                            switch (extensions)
                            {
                                case "mdl":
                                    Loader.loadText(path, (content) =>
                                    {
                                        war3.MdlParser.parse(content, (war3Model) =>
                                        {
                                            war3Model.root = path.substring(0, path.lastIndexOf("/") + 1);
                                            var gameobject = war3Model.getMesh();
                                            gameobject.name = path.split("/").pop().split(".").shift();
                                            saveGameObject(gameobject);
                                        });
                                    });
                                    break;
                                case "obj":
                                    ObjLoader.load(path, new StandardMaterial(), function (gameobject: GameObject)
                                    {
                                        gameobject.name = path.split("/").pop().split(".").shift();
                                        saveGameObject(gameobject);
                                    });
                                    break;
                                case "fbx":
                                    // fbxLoader.load(path, (gameobject) =>
                                    // {
                                    //     gameobject.name = path.split("/").pop().split(".").shift();
                                    //     saveGameObject(gameobject);
                                    //     // engine.root.addChild(gameobject);
                                    // });
                                    threejsLoader.load(path, (gameobject) =>
                                    {
                                        gameobject.name = path.split("/").pop().split(".").shift();
                                        saveGameObject(gameobject);
                                        // engine.root.addChild(gameobject);
                                    });
                                    break;
                                case "md5mesh":
                                    MD5Loader.load(path, (gameobject) =>
                                    {
                                        gameobject.name = path.split("/").pop().split(".").shift();
                                        saveGameObject(gameobject);
                                        // engine.root.addChild(gameobject);
                                    });
                                    break;
                                case "md5anim":
                                    MD5Loader.loadAnim(path, (animationclip) =>
                                    {
                                        animationclip.name = path.split("/").pop().split(".").shift();
                                        var obj = serialization.serialize(animationclip);
                                        assets.saveObject(obj, animationclip.name + ".anim");
                                    });
                                    break;
                            }
                        }, param: { name: '模型文件', extensions: ["obj", 'mdl', 'fbx', "md5mesh", 'md5anim'] }
                    })
                }
            },
            { type: "separator" },
            {
                label: "delete", click: () =>
                {
                    assets.deletefile(fileinfo.path);
                }
            }];


        //判断是否为本地应用
        if (shell)
        {
            menuconfig.splice(0, 0,
                {
                    label: "open folder", click: () =>
                    {
                        shell.showItemInFolder(folderpath + "/.");
                    }
                }
            );
        }

        menu.popup(menuconfig);
    }

    /**
     * 获取一个新路径
     */
    function getnewpath(path: string, callback: (newpath: string) => void)
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
            file.stat(path, (err, stats) =>
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

    function rename(oldPath: string, newPath: string, callback?: () => void)
    {
        file.rename(oldPath, newPath, (err) =>
        {
            if (err)
                return;
            var fileinfo = getFileInfo(oldPath);
            deletefileinfo(oldPath);
            fileinfo.path = newPath;
            addfileinfo(fileinfo);
            if (fileinfo.isDirectory)
                editorui.assetsview.updateAssetsTree();
            if (assets.showFloder == oldPath)
            {
                assets.showFloder = newPath;
            }
            callback && callback();
        });
    }

    function move(src: string, dest: string, callback?: (err: { message: string }) => void)
    {
        //禁止向子文件夹移动
        if (path.isParent(src, dest))
            return;

        file.move(src, dest, (err, destfileinfo) =>
        {
            deletefileinfo(src);
            addfileinfo(destfileinfo);
            if (destfileinfo.isDirectory)
                editorui.assetsview.updateAssetsTree();
            if (assets.showFloder == src)
            {
                assets.showFloder = dest;
            }
            callback && callback(err);
        });
    }

    function fileinfocompare(a: FileInfo, b: FileInfo)
    {
        if (a.isDirectory > b.isDirectory)
            return -1;
        if (a.isDirectory < b.isDirectory)
            return 1;
        if (a.path < b.path)
            return -1;
        return 1;
    }

    function saveGameObject(gameobject: GameObject)
    {
        var obj = serialization.serialize(gameobject);

        var output = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        assets.addfile(assets.showFloder + "/" + gameobject.name + ".gameobject", output);
    }

    function saveObject(object: Object, filename: string)
    {
        var output = JSON.stringify(object, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        assets.addfile(assets.showFloder + "/" + filename, output);
    }

    export var path = {
        isParent: function (parenturl: string, childurl: string)
        {
            var parents = parenturl.split("/");
            var childs = childurl.split("/");
            for (var i = 0; i < childs.length; i++)
            {
                if (childs[i] != parent[i])
                    return false;
            }
            return true;
        }
    };
}