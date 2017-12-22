namespace feng3d.editor
{
    export enum AssetExtension
    {
        folder = "folder",
        material = "material",
        gameobject = "gameobject",
    }

    export class AssetsFile extends TreeNode
    {
        /**
         * 路径
         */
        get path()
        {
            return this._path;
        }
        private _path: string;
        /**
         * 创建时间
         */
        get birthtime()
        {
            return this._birthtime;
        }
        private _birthtime: number;
        /**
         * 修改时间
         */
        get mtime()
        {
            return this._mtime;
        }
        private _mtime: number;
        /**
         * 是否文件夹
         */
        get isDirectory()
        {
            return this._isDirectory;
        }
        private _isDirectory: boolean;
        /**
         * 文件尺寸
         */
        get size()
        {
            return this._size;
        }
        private _size: number;
        /**
         * 父节点
         */
        get parent()
        {
            return this._parent;
        }
        private _parent: AssetsFile;
        /**
         * 子节点列表
         */
        get children()
        {
            return this._children;
        }
        private _children: AssetsFile[];

        /**
         * 目录深度
         */
        depth = 0;

        /**
         * 文件夹是否打开
         */
        get isOpen()
        {
            return this._isOpen;
        }
        set isOpen(value)
        {
            this._isOpen = value;
            assetsDispather.dispatch("openChanged");
        }
        private _isOpen = true;

        /**
         * 图标名称或者路径
         */
        image = "resource/assets/icons/json.png";

        /**
         * 文件夹名称
         */
        get name()
        {
            return this._path.split("/").pop();
        }

        /**
         * 显示标签
         */
        get label()
        {
            var label = this.name;
            label = label.split(".").shift();
            return label;
        }

        get extension(): AssetExtension
        {
            if (this._isDirectory)
                return AssetExtension.folder;
            return <AssetExtension>this._path.split(".").pop();
        }

        /**
         * 是否选中
         */
        selected = false;

        /**
         * 当前打开文件夹
         */
        currentOpenDirectory = false;

        get data()
        {
            return this._data;
        }
        private _data: string | ArrayBuffer | Uint8Array | StandardMaterial | GameObject | AnimationClip;

        constructor(fileinfo: FileInfo)
        {
            super()

            this._path = fileinfo.path;
            this._birthtime = fileinfo.birthtime;
            this._mtime = fileinfo.mtime;
            this._isDirectory = fileinfo.isDirectory;
            this._size = fileinfo.size;
            this._children = [];

            if (fileinfo.isDirectory)
            {
                this.image = "folder_png";
            }
            else if (/(.jpg|.png)\b/.test(fileinfo.path))
            {
                this.image = fileinfo.path;
            }
            else
            {
                var filename = fileinfo.path.split("/").pop();
                var extension = filename.split(".").pop();
                if (RES.getRes(extension + "_png"))
                {
                    this.image = extension + "_png";
                } else
                {
                    this.image = "file_png";
                }
            }
        }

        /**
         * 获取属性显示数据
         * @param callback 获取属性面板显示数据回调
         */
        showInspectorData(callback: (showdata: Object) => void)
        {
            if (this._data)
            {
                callback(this._data);
                return;
            }
            if (this.extension == AssetExtension.material
                || this.extension == AssetExtension.gameobject)
            {
                this.getData((data) =>
                {
                    callback(data);
                });
                return;
            }
            callback(this);
        }

        /**
         * 获取文件数据
         * @param callback 获取文件数据回调
         */
        getData(callback: (data: any) => void)
        {
            if (this._data)
            {
                callback(this._data);
                return;
            }
            if (this.extension == AssetExtension.material
                || this.extension == AssetExtension.gameobject)
            {
                fs.readFile(this._path, (err, content) =>
                {
                    var json = JSON.parse(content);
                    this._data = serialization.deserialize(json);
                    callback(this._data);
                });
                return;
            }
            fs.readFile(this._path, (err, content) =>
            {
                this._data = content;
                callback(this._data);
            });
        }

        /**
         * 设置拖拽数据
         * @param dragsource 拖拽数据
         */
        setDragSource(dragsource: DragData)
        {
            switch (this.extension)
            {
                case "gameobject":
                    dragsource.file_gameobject = this.path;
                    break;
                case AssetExtension.material:
                    this.getData((data) =>
                    {
                        dragsource.material = data;
                    });
                    break;
            }
            dragsource.file = this.path;
        }

        /**
         * 初始化子文件
         */
        initChildren(depth = 0, callback: () => void)
        {
            if (!this._isDirectory || depth < 0)
            {
                callback();
                return;
            }
            fs.readdir(this._path, (err, files) =>
            {
                var initfiles = () =>
                {
                    if (files.length == 0)
                    {
                        callback();
                        return;
                    }

                    var file = files.shift();
                    fs.stat(this._path + "/" + file, (err, stats) =>
                    {
                        assert(!err);
                        var child = new AssetsFile(stats);
                        child._parent = this;
                        this.children.push(child);
                        child.initChildren(depth - 1, initfiles);
                    });
                }
                initfiles();
            });
        }

        /**
         * 根据相对路径获取子文件
         * @param path 相对路径
         */
        getFile(path: string | string[]): AssetsFile
        {
            if (typeof path == "string")
            {
                path = path.replace(this._path + "/", "");
                path = path.replace(this._path, "");
                path = path.split("/");
            }
            if (path.join("/") == "")
                return this;
            var childname = path.shift();
            if (this.children)
            {
                for (var i = 0; i < this.children.length; i++)
                {
                    if (this.children[i].name == childname)
                    {
                        var result = this.children[i].getFile(path);
                        if (result)
                            return result;
                    }
                }
            }
            return null;
        }

        removeChild(file: AssetsFile)
        {
            file.remove();
        }

        /**
         * 从父节点移除
         */
        remove()
        {
            if (this.parent)
            {
                var index = this.parent.children.indexOf(this);
                assert(index != -1);
                this.parent.children.splice(index, 1);
                this._parent = null;

                editorui.assetsview.updateShowFloder();
                assetsDispather.dispatch("changed");
            }
        }

        /**
         * 移除所有子节点
         */
        removeChildren()
        {
            var children = this.children.concat();
            children.forEach(element =>
            {
                element.remove();
            });
        }

        /**
         * 销毁
         */
        destroy()
        {
            this.remove();
            this.removeChildren();
            this._children = null;
        }

        /**
         * 添加到父节点
         * @param parent 父节点
         */
        addto(parent: AssetsFile)
        {
            this.remove();
            assert(!!parent);
            parent.children.push(this);
            this._parent = parent;

            editorui.assetsview.updateShowFloder();
            assetsDispather.dispatch("changed");
        }

        /**
         * 删除文件（夹）
         */
        deleteFile(callback?: (assetsFile: AssetsFile) => void)
        {
            if (this._path == assets.assetsPath)
            {
                alert("无法删除根目录");
                return;
            }

            var deletefile = () =>
            {
                fs.remove(this._path, (err) =>
                {
                    assert(!err);

                    this.destroy();

                    //
                    this._parent = null;
                    callback && callback(this);
                });
                if (/\.ts\b/.test(this._path))
                {
                    assets.deletefile(this._path.replace(/\.ts\b/, ".js"), () => { });
                    assets.deletefile(this._path.replace(/\.ts\b/, ".js.map"), () => { });
                }
            }

            var checkDirDelete = () =>
            {
                if (this.children.length == 0)
                    deletefile();
            }

            if (this._isDirectory)
            {
                this.children.forEach(element =>
                {
                    element.deleteFile(() =>
                    {
                        checkDirDelete();
                    });
                });
                checkDirDelete();
            } else
            {
                deletefile();
            }
        }

        /**
         * 重命名
         * @param newname 新文件名称
         * @param callback 重命名完成回调
         */
        rename(newname: string, callback?: (file: AssetsFile) => void)
        {
            var oldPath = this._path;
            var newPath = this.parent.path + "/" + newname;
            fs.rename(oldPath, this.parent.path + "/" + newname, (err) =>
            {
                assert(!err);
                this._path = newPath;
                if (this.isDirectory)
                    editorui.assetsview.updateAssetsTree();
                if (assets.showFloder == oldPath)
                {
                    assets.showFloder = newPath;
                }
                callback && callback(this);
            });
        }

        /**
         * 移动文件（夹）到指定文件夹
         * @param destdirpath 目标文件夹路径
         * @param callback 移动文件完成回调
         */
        move(destdirpath: string, callback?: (file: AssetsFile) => void)
        {
            var oldpath = this._path;
            var newpath = destdirpath + "/" + this.name;
            var destDir = assets.getFile(destdirpath);
            //禁止向子文件夹移动
            if (isParent(oldpath, destdirpath))
                return;

            if (/\.ts\b/.test(this._path))
            {
                var jspath = this._path.replace(/\.ts\b/, ".js");
                var jsmappath = this._path.replace(/\.ts\b/, ".js.map");

                assets.movefile(jspath, destdirpath);
                assets.movefile(jsmappath, destdirpath);
            }

            fs.move(oldpath, newpath, (err, destfileinfo) =>
            {
                assert(!err);

                this._path = newpath;
                this.addto(destDir);

                if (this.isDirectory)
                    editorui.assetsview.updateAssetsTree();
                if (assets.showFloder == oldpath)
                {
                    assets.showFloder = newpath;
                }
                callback && callback(this);
            });
        }

        /**
         * 新增子文件夹
         * @param newfoldername 新增文件夹名称
         * @param callback      完成回调
         */
        addfolder(newfoldername: string, callback?: (file: AssetsFile) => void)
        {
            newfoldername = this.getnewchildname(newfoldername);
            var folderpath = this._path + "/" + newfoldername;

            fs.mkdir(folderpath, (e) =>
            {
                assert(!e);

                fs.stat(folderpath, (err, stats) =>
                {
                    var assetsFile = new AssetsFile(stats);
                    assetsFile.addto(this);
                });
            });
        }

        /**
         * 新增文件
         * @param filename 新增文件名称
         * @param content 文件内容
         * @param callback 完成回调
         */
        addfile(filename: string, content: string | ArrayBuffer | Uint8Array | StandardMaterial | GameObject | AnimationClip, override = false, callback?: (file: AssetsFile) => void)
        {
            if (!override)
            {
                filename = this.getnewchildname(filename);
            }
            var filepath = this._path + "/" + filename;

            var saveContent = content;
            if (saveContent instanceof StandardMaterial)
            {
                var obj = serialization.serialize(content);
                saveContent = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            } else if (saveContent instanceof GameObject)
            {
                var obj = serialization.serialize(content);
                saveContent = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            } else if (saveContent instanceof AnimationClip)
            {
                var obj = serialization.serialize(content);
                saveContent = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            }

            fs.writeFile(filepath, saveContent, (e) =>
            {
                fs.stat(filepath, (err, stats) =>
                {
                    var assetsFile = new AssetsFile(stats);
                    assetsFile._data = content;
                    assetsFile.addto(this);
                    callback && callback(this);
                });
            });
        }

        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter(fn: (assetsFile: AssetsFile) => boolean, next?: (assetsFile: AssetsFile) => boolean): this[]
        {
            var result = [];

            next = next || (() => true);

            if (fn(this))
                result.push(this);

            if (next(this))
            {
                this.children.forEach(element =>
                {
                    var childResult = element.filter(fn, next);
                    result = result.concat(childResult);
                });
            }
            return result;
        }

        /**
         * 获取一个新的不重名子文件名称
         */
        private getnewchildname(childname: string)
        {
            var childrennames: string[] = this.children.reduce((arr, item) => { arr.push(item.name); return arr; }, []);
            if (childrennames.indexOf(childname) == -1)
                return childname;

            var basepath = "";
            var ext = "";
            if (childname.indexOf(".") == -1)
            {
                basepath = childname;
                ext = "";
            } else
            {
                basepath = childname.substring(0, childname.indexOf("."));
                ext = childname.substring(childname.indexOf("."));
            }

            var index = 1;
            do
            {
                var path = basepath + " " + index + ext;
                index++;
            } while (childrennames.indexOf(path) != -1);
            return path;
        }
    }

    function getparentdir(path: string)
    {
        var paths = path.split("/");
        paths.pop();
        var parentdir = paths.join("/");
        return parentdir;
    }

    function isParent(parenturl: string, childurl: string)
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
}