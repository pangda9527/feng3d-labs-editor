namespace feng3d.editor
{
    export enum AssetExtension
    {
        folder = "folder",
        material = "material",
        geometry = "geometry",
        gameobject = "gameobject",
        anim = "anim",
        png = "png",
        jpg = "jpg",
        jpeg = "jpeg",
        ts = "ts",
        js = "js",
        txt = "txt",
        json = "json",
        scene = "scene",
    }

    var imageReg = /(.jpg|.png|.jpeg)\b/i;
    export class AssetsFile extends TreeNode
    {
        /**
         * 路径
         */
        path: string;
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
        image: egret.Texture | string;

        /**
         * 文件夹名称
         */
        name: string;

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
            return <AssetExtension>this.path.split(".").pop().toLowerCase();
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
        private _data: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry;

        constructor(fileinfo: FileInfo, data?: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry)
        {
            super()

            feng3d.watcher.watch(this, "path", () =>
            {
                var paths = this.path.split("/");
                this.name = paths.pop();
                if (this.name == "")
                    this.name = paths.pop();
            });

            this.path = fileinfo.path;
            this._birthtime = fileinfo.birthtime;
            this._mtime = fileinfo.mtime;
            this._isDirectory = fileinfo.isDirectory;
            this._size = fileinfo.size;
            this._children = [];
            this._data = data;

            if (fileinfo.isDirectory)
            {
                this.image = "folder_png";
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
            if (imageReg.test(fileinfo.path))
            {
                this.getData((data) =>
                {
                    this.image = data;
                });
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
            this.getData((data) =>
            {
                callback(data);
            });
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
                || this.extension == AssetExtension.gameobject
                || this.extension == AssetExtension.anim
                || this.extension == AssetExtension.scene
                || this.extension == AssetExtension.geometry
            )
            {
                fs.readFileAsString(this.path, (err, content: string) =>
                {
                    var json = JSON.parse(content);
                    this._data = serialization.deserialize(json);
                    callback(this._data);
                });
                return;
            }
            if (this.extension == AssetExtension.png
                || this.extension == AssetExtension.jpg
                || this.extension == AssetExtension.jpeg
            )
            {
                fs.readFile(this.path, (err, data) =>
                {
                    dataTransform.arrayBufferToDataURL(data, (dataurl) =>
                    {
                        this._data = dataurl;
                        callback(this._data);
                    });
                });
                return;
            }
            fs.readFileAsString(this.path, (err, content) =>
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
                case AssetExtension.gameobject:
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
            fs.readdir(this.path, (err, files) =>
            {
                var initfiles = () =>
                {
                    if (files.length == 0)
                    {
                        callback();
                        return;
                    }

                    var file = files.shift();
                    fs.stat(this.path + file, (err, stats) =>
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
                path = path.replace(this.path + "/", "");
                path = path.replace(this.path, "");
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
            if (this.path == editorAssets.assetsPath)
            {
                alert("无法删除根目录");
                return;
            }

            var deletefile = () =>
            {
                fs.remove(this.path, (err) =>
                {
                    assert(!err);

                    this.destroy();

                    //
                    this._parent = null;
                    callback && callback(this);
                });
                if (/\.ts\b/.test(this.path))
                {
                    editorAssets.deletefile(this.path.replace(/\.ts\b/, ".js"), () => { });
                    editorAssets.deletefile(this.path.replace(/\.ts\b/, ".js.map"), () => { });
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
            var oldPath = this.path;
            var newPath = this.parent.path + newname;
            if (this.isDirectory)
                newPath = newPath + "/";
            fs.rename(oldPath, newPath, (err) =>
            {
                assert(!err);
                this.path = newPath;
                if (this.isDirectory)
                    editorui.assetsview.updateAssetsTree();
                if (editorAssets.showFloder == oldPath)
                {
                    editorAssets.showFloder = newPath;
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
            var oldpath = this.path;
            var newpath = destdirpath + this.name;
            if (this.isDirectory)
                newpath += "/";
            var destDir = editorAssets.getFile(destdirpath);
            //禁止向子文件夹移动
            if (oldpath == editorAssets.getparentdir(destdirpath))
                return;

            if (/\.ts\b/.test(this.path))
            {
                var jspath = this.path.replace(/\.ts\b/, ".js");
                var jsmappath = this.path.replace(/\.ts\b/, ".js.map");

                editorAssets.movefile(jspath, destdirpath);
                editorAssets.movefile(jsmappath, destdirpath);
            }

            fs.move(oldpath, newpath, (err) =>
            {
                assert(!err);

                this.path = newpath;
                this.addto(destDir);

                if (this.isDirectory)
                    editorui.assetsview.updateAssetsTree();
                if (editorAssets.showFloder == oldpath)
                {
                    editorAssets.showFloder = newpath;
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
            var folderpath = this.path + newfoldername + "/";

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
        addfile(filename: string, content: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry, override = false, callback?: (file: AssetsFile) => void)
        {
            if (!override)
            {
                filename = this.getnewchildname(filename);
            }
            var filepath = this.path + filename;

            getcontent((savedata, data) =>
            {
                fs.writeFile(filepath, savedata, (e) =>
                {
                    fs.stat(filepath, (err, stats) =>
                    {
                        var assetsFile = new AssetsFile(stats, data);
                        assetsFile.addto(this);
                        callback && callback(this);
                    });
                });
            });

            function getcontent(callback: (savedata: ArrayBuffer, data: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry) => void)
            {
                var saveContent = content;
                if (content instanceof Material
                    || content instanceof GameObject
                    || content instanceof AnimationClip
                )
                {
                    var obj = serialization.serialize(content);
                    var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                    dataTransform.stringToUint8Array(str, (uint8Array) =>
                    {
                        callback(uint8Array, saveContent);
                    });
                } else if (imageReg.test(filename))
                {
                    dataTransform.arrayBufferToDataURL(<ArrayBuffer>content, (datarul) =>
                    {
                        callback(<ArrayBuffer>content, datarul);
                    });
                } else
                {
                    callback(<ArrayBuffer>content, content);
                }
            }
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
}