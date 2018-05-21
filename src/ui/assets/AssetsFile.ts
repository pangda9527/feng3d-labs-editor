namespace feng3d.editor
{
    export enum AssetExtension
    {
        /**
         * 文件夹
         */
        folder = "folder",
        /**
         * png 图片
         */
        png = "png",
        /**
         * jpg图片
         */
        jpg = "jpg",
        /**
         * jpeg图片
         */
        jpeg = "jpeg",
        /**
         * gif图片
         */
        gif = "gif",
        /**
         * ts文件
         */
        ts = "ts",
        /**
         * js文件
         */
        js = "js",
        /**
         * 文本文件
         */
        txt = "txt",
        /**
         * json文件
         */
        json = "json",
        // -- feng3d中的类型
        /**
         * 材质
         */
        material = "material.json",
        /**
         * 几何体
         */
        geometry = "geometry.json",
        /**
         * 游戏对象
         */
        gameobject = "gameobject.json",
        /**
         * 场景文件
         */
        scene = "scene.json",
        /**
         * 动画文件
         */
        anim = "anim.json",
        /**
         * 着色器文件
         */
        shader = "shader.ts",
        /**
         * 脚本文件
         */
        script = "script.ts",
    }

    export class AssetsFile extends TreeNode
    {
        /**
         * 路径
         */
        @watch("pathChanged")
        path: string;
        /**
         * 是否文件夹
         */
        isDirectory: boolean;
        /**
         * 父节点
         */
        parent: AssetsFile;
        /**
         * 子节点列表
         */
        children: AssetsFile[] = [];

        /**
         * 目录深度
         */
        depth = 0;

        /**
         * 文件夹是否打开
         */
        @watch("openChanged")
        isOpen = true;

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
        label: string;

        /**
         * 扩展名
         */
        extension: AssetExtension

        /**
         * 是否选中
         */
        selected = false;

        /**
         * 当前打开文件夹
         */
        currentOpenDirectory = false;

        /**
         * 缓存下来的数据 避免从文件再次加载解析数据
         */
        cacheData: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry | Texture2D;

        constructor(path: string, data?: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry | Texture2D)
        {
            super()

            this.isDirectory = path.charAt(path.length - 1) == "/";
            this.path = path;
            this.cacheData = data;
        }

        pathChanged()
        {
            // 更新名字
            var paths = this.path.split("/");
            this.name = paths.pop();
            if (this.name == "")
                this.name = paths.pop();

            this.label = this.name.split(".").shift();

            if (this.isDirectory)
                this.extension = AssetExtension.folder;
            else
                this.extension = <AssetExtension>this.name.substr(this.name.indexOf(".") + 1);

            // 更新图标
            if (this.isDirectory)
            {
                this.image = "folder_png";
            }
            else
            {
                if (RES.getRes(this.extension.split(".").shift() + "_png"))
                {
                    this.image = this.extension.split(".").shift() + "_png";
                } else
                {
                    this.image = "file_png";
                }
            }
            if (regExps.image.test(this.path))
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
            if (this.cacheData)
            {
                callback(this.cacheData);
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
            if (this.cacheData)
            {
                callback(this.cacheData);
                return;
            }
            if (this.isDirectory)
            {
                callback({ isDirectory: true });
                return;
            }
            if (regExps.json.test(this.path))
            {
                fs.readFileAsString(this.path, (err, content: string) =>
                {
                    var json = JSON.parse(content);
                    this.cacheData = serialization.deserialize(json);
                    callback(this.cacheData);
                });
                return;
            }
            if (regExps.image.test(this.path))
            {
                fs.readFile(this.path, (err, data) =>
                {
                    dataTransform.arrayBufferToDataURL(data, (dataurl) =>
                    {
                        this.cacheData = dataurl;
                        callback(this.cacheData);
                    });
                });
                return;
            }
            fs.readFileAsString(this.path, (err, content) =>
            {
                this.cacheData = content;
                callback(this.cacheData);
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
            if (!this.isDirectory || depth < 0)
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
                    var child = new AssetsFile(this.path + file);
                    child.parent = this;
                    this.children.push(child);
                    child.initChildren(depth - 1, initfiles);
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
                this.parent = null;

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
            this.parent = parent;

            editorui.assetsview.updateShowFloder();
            assetsDispather.dispatch("changed");
        }

        /**
         * 删除文件（夹）
         */
        deleteFile(callback?: (assetsFile: AssetsFile) => void, includeRoot = false)
        {
            if (this.path == editorAssets.assetsPath && !includeRoot)
            {
                alert("无法删除根目录");
                return;
            }

            var deletefile = () =>
            {
                fs.delete(this.path, (err) =>
                {
                    if (err)
                        warn(`删除文件 ${this.path} 出现问题 ${err}`);

                    this.destroy();

                    //
                    this.parent = null;
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

            if (this.isDirectory)
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

                var assetsFile = new AssetsFile(folderpath);
                assetsFile.addto(this);
            });
        }

        /**
         * 新增文件
         * @param filename 新增文件名称
         * @param content 文件内容
         * @param callback 完成回调
         */
        addfile(filename: string, content: string | ArrayBuffer | Material | GameObject | AnimationClip | Geometry | Texture2D, override = false, callback?: (file: AssetsFile) => void)
        {
            if (!override)
            {
                filename = this.getnewchildname(filename);
            }
            var filepath = this.path + filename;

            getcontent(content, (savedata) =>
            {
                fs.writeFile(filepath, savedata, (e) =>
                {
                    var assetsFile = new AssetsFile(filepath, content);
                    assetsFile.addto(this);
                    callback && callback(this);
                    if (regExps.image.test(assetsFile.path))
                        globalEvent.dispatch("imageAssetsChanged", { url: assetsFile.path });
                });
            });

            function getcontent(content: string | ArrayBuffer | Material | GameObject | AnimationClip | Geometry | Texture2D, callback: (savedata: ArrayBuffer) => void)
            {
                if (content instanceof Material
                    || content instanceof GameObject
                    || content instanceof AnimationClip
                    || content instanceof Geometry
                    || content instanceof Texture2D
                )
                {
                    var obj = serialization.serialize(content);
                    var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                    dataTransform.stringToArrayBuffer(str, (arrayBuffer) =>
                    {
                        callback(arrayBuffer);
                    });
                } else if (regExps.image.test(filename))
                {
                    dataTransform.arrayBufferToDataURL(<ArrayBuffer>content, (datarul) =>
                    {
                        callback(<ArrayBuffer>content);
                    });
                } else if (typeof content == "string")
                {
                    dataTransform.stringToArrayBuffer(content, (arrayBuffer) =>
                    {
                        callback(arrayBuffer);
                    });
                } else
                {
                    callback(content);
                }
            }
        }

        save(callback?: () => void)
        {

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

        /**
         * 获取脚本类名称
         * @param callback 回调函数
         */
        getScriptClassName(callback: (scriptClassName: string) => void)
        {
            if (this.extension != AssetExtension.script)
                return "";
            this.cacheData = null;
            this.getData((code: string) =>
            {
                // 获取脚本类名称
                var result = regExps.scriptClass.exec(code);
                assert(result != null, `在脚本 ${this.path} 中没有找到 脚本类定义`);
                var script = result[2];
                // 获取导出类命名空间
                if (result[1])
                {
                    result = regExps.namespace.exec(code);
                    assert(result != null, `获取脚本 ${this.path} 命名空间失败`);
                    script = result[1] + "." + script;
                }
                callback(script);
            });
        }

        private openChanged()
        {
            assetsDispather.dispatch("openChanged");
        }
    }
}