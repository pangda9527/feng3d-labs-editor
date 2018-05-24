namespace feng3d.editor
{
    export class AssetsFile
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
         * 缓存下来的数据 避免从文件再次加载解析数据
         */
        cacheData: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry | Texture2D;

        constructor(path: string, data?: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry | Texture2D)
        {
            this.path = path;
            this.cacheData = data;
        }

        pathChanged()
        {
            // 更新名字
            this.name = pathUtils.getNameWithExtension(this.path);
            this.label = this.name.split(".").shift();

            this.isDirectory = pathUtils.isDirectory(this.path);

            if (this.isDirectory)
                this.extension = AssetExtension.folder;
            else
                this.extension = <AssetExtension>pathUtils.getExtension(this.path);

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
                    this.cacheData["path"] = this.path;
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
         * 重命名
         * @param newname 新文件名称
         * @param callback 重命名完成回调
         */
        rename(newname: string, callback?: (file: AssetsFile) => void)
        {
            var oldpath = this.path;
            var newpath = pathUtils.getParentPath(this.path) + newname;
            if (this.isDirectory)
                newpath = newpath + "/";
            this.move(oldpath, newpath, callback);
        }

        /**
         * 移动文件（夹）到指定文件夹
         * @param destdirpath 目标文件夹路径
         * @param callback 移动文件完成回调
         */
        moveToDir(destdirpath: string, callback?: (file: AssetsFile) => void)
        {
            //禁止向子文件夹移动
            if (destdirpath.indexOf(this.path) != -1)
                return;
            var oldpath = this.path;
            var newpath = destdirpath + this.name;
            if (this.isDirectory)
                newpath += "/";
            var destDir = editorAssets.getFile(destdirpath);
            this.move(oldpath, newpath, callback);
        }

        /**
         * 移动文件（夹）
         * @param oldpath 老路径
         * @param newpath 新路径
         * @param callback 回调函数
         */
        move(oldpath: string, newpath: string, callback?: (file: AssetsFile) => void)
        {
            fs.move(oldpath, newpath, (err) =>
            {
                assert(!err);

                if (this.isDirectory)
                {
                    var movefiles = editorAssets.filter((item) => item.path.substr(0, oldpath.length) == oldpath);
                    movefiles.forEach(element =>
                    {
                        delete editorAssets.files[element.path];
                        element.path = newpath + element.path.substr(oldpath.length);
                        editorAssets.files[element.path] = element;
                    });
                }
                delete editorAssets.files[this.path];
                this.path = newpath;
                editorAssets.files[this.path] = this;

                if (this.isDirectory)
                    editorui.assetsview.invalidateAssetstree();
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
            var folderpath = this.getnewname(this.path + newfoldername);
            folderpath = folderpath + "/";

            fs.mkdir(folderpath, (e) =>
            {
                assert(!e);

                editorAssets.files[folderpath] = new AssetsFile(folderpath);
                editorui.assetsview.invalidateAssetstree();
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
            var filepath = this.path + filename;
            if (!override)
            {
                filepath = this.getnewname(filepath);
            }

            var assetsFile = new AssetsFile(filepath, content);
            assetsFile.save(() =>
            {
                editorAssets.files[filepath] = assetsFile;

                editorui.assetsview.invalidateAssetstree();

                callback && callback(this);
                if (regExps.image.test(assetsFile.path))
                    feng3dDispatcher.dispatch("assets.imageAssetsChanged", { url: assetsFile.path });
            });
        }

        /**
         * 保存数据到文件
         * @param callback 回调函数
         */
        save(callback?: (err: Error) => void)
        {
            this.getArrayBuffer((arraybuffer) =>
            {
                fs.writeFile(this.path, arraybuffer, (e) =>
                {
                    if (callback)
                        callback(e);
                    else if (e)
                        error(e);
                });
            });
        }

        /**
         * 获取ArrayBuffer数据
         * @param callback 回调函数
         */
        getArrayBuffer(callback: (arraybuffer: ArrayBuffer) => void)
        {
            var content = this.cacheData;
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
            } else if (regExps.image.test(this.path))
            {
                callback(<ArrayBuffer>content);
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

        /**
         * 获取一个新的不重名子文件名称
         */
        private getnewname(path: string)
        {
            if (editorAssets.getFile(path) == null && editorAssets.getFile(path + "/") == null)
                return path;

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

            var index = 1;
            do
            {
                var path = basepath + " " + index + ext;
                index++;
            } while (!(editorAssets.getFile(path) == null && editorAssets.getFile(path + "/") == null));
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
    }
}