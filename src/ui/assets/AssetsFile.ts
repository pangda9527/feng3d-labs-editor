namespace editor
{
    export type AssetsDataType = ArrayBuffer | string | feng3d.Material | feng3d.GameObject | feng3d.AnimationClip | feng3d.Geometry | feng3d.Texture2D | feng3d.TextureCube | HTMLImageElement;

    export interface AssetsFileEventMap
    {
        added: TreeNode;
        removed: TreeNode;
        changed: TreeNode;
        openChanged: TreeNode;

        /**
         * 加载完成
         */
        loaded

        /**
         * 所有字对象加载完成
         */
        childrenLoaded
    }

    export interface AssetsFile
    {
        once<K extends keyof AssetsFileEventMap>(type: K, listener: (event: feng3d.Event<AssetsFileEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof AssetsFileEventMap>(type: K, data?: AssetsFileEventMap[K], bubbles?: boolean): feng3d.Event<AssetsFileEventMap[K]>;
        has<K extends keyof AssetsFileEventMap>(type: K): boolean;
        on<K extends keyof AssetsFileEventMap>(type: K, listener: (event: feng3d.Event<AssetsFileEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof AssetsFileEventMap>(type?: K, listener?: (event: feng3d.Event<AssetsFileEventMap[K]>) => any, thisObject?: any);
    }

    export var loadingNum = 0;

    export class AssetsFile extends AssetsTreeNode
    {
        @feng3d.serialize
        @feng3d.watch("idChanged")
        id = "";

        /**
         * 路径
         */
        @feng3d.watch("pathChanged")
        path: string;

        /**
         * 是否文件夹
         */
        isDirectory: boolean;

        /**
         * 图标名称或者路径
         */
        image: string;

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
        extension: feng3d.AssetExtension

        /**
         * 是否选中
         */
        selected = false;

        /**
         * 缓存下来的数据 避免从文件再次加载解析数据
         */
        cacheData: AssetsDataType;

        @feng3d.serialize
        children: AssetsFile[] = [];

        parent: AssetsFile;

        feng3dAssets: feng3d.Feng3dAssets;

        constructor(id: string = "")
        {
            super();
            this.id = id;
        }

        private idChanged()
        {
            if (this.id == "") return;

            editorAssets.files[this.id] = this;

            loadingNum++;
            assets.readAssets(this.id, (err, assets) =>
            {
                if (err) feng3d.error(err.message);

                this.feng3dAssets = assets;
                this.init();
                loadingNum--;
                if (loadingNum == 0)
                {
                    feng3d.feng3dDispatcher.dispatch("editor.allLoaded");
                }
                this.dispatch("loaded");
            });
        }

        private init()
        {
            this.isDirectory = this.feng3dAssets instanceof Folder;
            this.label = this.name = this.feng3dAssets.name;

            // 更新图标
            if (this.isDirectory)
            {
                this.image = "folder_png";
            }
            else
            {
                this.image = "file_png";
            }
        }

        addAssets(feng3dAssets: feng3d.Feng3dAssets)
        {
            assets.saveAssets(feng3dAssets);
            var assetsFile = new AssetsFile(feng3dAssets.assetsId);
            this.addChild(assetsFile);
            return assetsFile;
        }

        addChild(file: AssetsFile)
        {
            if (this.children.indexOf(file) == -1) this.children.push(file);
            file.parent = this;
            editorAssets.saveProject();
            editorui.assetsview.invalidateAssetstree();
        }

        removeChild(file: AssetsFile)
        {
            var index = this.children.indexOf(file);
            if (index != -1) this.children.splice(index, 1);
            file.parent = null;
            editorAssets.saveProject();
            editorui.assetsview.invalidateAssetstree();
        }

        remove()
        {
            if (this.parent) this.parent.removeChild(this);
            assets.deleteAssets(this.id);
            delete editorAssets.files[this.id];
            editorAssets.saveProject();
            editorui.assetsview.invalidateAssetstree();
            feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: this.id });
        }

        getFolderList()
        {
            var folders = [];
            if (this.isDirectory)
            {
                folders.push(this);
            }
            this.children.forEach(v =>
            {
                var cfolders = v.getFolderList();
                folders = folders.concat(cfolders);
            })
            return folders;
        }

        loadAll(callback: () => void)
        {

        }

        private pathChanged()
        {
            if (this.isDirectory)
                this.extension = feng3d.AssetExtension.folder;
            else
                this.extension = <feng3d.AssetExtension>feng3d.pathUtils.getExtension(this.path);

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
            if (this.extension == feng3d.AssetExtension.texture2d)
            {
                this.getData((texture2d: feng3d.UrlImageTexture2D) =>
                {
                    assets.readArrayBuffer(texture2d.url, (err, data) =>
                    {
                        feng3d.dataTransform.arrayBufferToDataURL(data, (dataurl) =>
                        {
                            this.image = dataurl;
                        });
                    });
                });
            }
            if (regExps.image.test(this.path))
            {
                assets.readArrayBuffer(this.path, (err, data) =>
                {
                    feng3d.dataTransform.arrayBufferToDataURL(data, (dataurl) =>
                    {
                        this.image = dataurl;
                    });
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
                feng3d.Feng3dAssets.getAssetsByPath(this.path, assets =>
                {
                    this.cacheData = assets;
                    callback(this.cacheData);
                });
                return;
            }
            if (regExps.image.test(this.path))
            {
                this.cacheData = new feng3d.UrlImageTexture2D().value({ url: this.path });
                callback(this.cacheData);
                return;
            }
        }

        /**
         * 重命名
         * @param newname 新文件名称
         * @param callback 重命名完成回调
         */
        rename(newname: string, callback?: (file: AssetsFile) => void)
        {
            var oldpath = this.path;
            var newpath = feng3d.pathUtils.getParentPath(this.path) + newname;
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
            assets.move(oldpath, newpath, (err) =>
            {
                feng3d.assert(!err);

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

                editorui.assetsview.invalidateAssetstree();
                callback && callback(this);
            });
        }

        /**
         * 新增文件
         * @param filename 新增文件名称
         * @param content 文件内容
         * @param callback 完成回调
         */
        addfile(filename: string, content: AssetsDataType, override = false, callback?: (file: AssetsFile) => void)
        {
            var filepath = this.path + filename;
            if (!override)
            {
                filepath = this.getnewname(filepath);
            }

            var assetsFile = new AssetsFile();
            assetsFile.path = filepath;
            assetsFile.cacheData = content;
            assetsFile.save(true, () =>
            {
                editorAssets.files[filepath] = assetsFile;
                editorData.selectObject(assetsFile);

                editorui.assetsview.invalidateAssetstree();

                callback && callback(assetsFile);
                if (regExps.image.test(assetsFile.path))
                    feng3d.feng3dDispatcher.dispatch("assets.imageAssetsChanged", { url: assetsFile.path });
            });
            return assetsFile;
        }

        /**
         * 新增文件从ArrayBuffer
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        addfileFromArrayBuffer(filename: string, arraybuffer: ArrayBuffer, override = false, callback?: (e: Error, file: AssetsFile) => void)
        {
            var filepath = this.path + filename;
            if (!override)
            {
                filepath = this.getnewname(filepath);
            }
            assets.writeArrayBuffer(filepath, arraybuffer, (e) =>
            {
                if (e)
                {
                    callback(e, null);
                    return;
                }
                var assetsFile = new AssetsFile();
                assetsFile.path = filepath;
                editorAssets.files[filepath] = assetsFile;
                editorData.selectObject(assetsFile);

                editorui.assetsview.invalidateAssetstree();

                callback && callback(null, assetsFile);
                if (regExps.image.test(assetsFile.path))
                    feng3d.feng3dDispatcher.dispatch("assets.imageAssetsChanged", { url: assetsFile.path });

            });
        }

        /**
         * 保存数据到文件
         * @param create 如果文件不存在，是否新建文件
         * @param callback 回调函数
         */
        save(create = false, callback?: (err: Error) => void)
        {
            if (this.cacheData == undefined)
            {
                callback && callback(null);
                return;
            }
            if (!create && !editorAssets.files[this.path])
            {
                var e = new Error(`需要保存的文件 ${this.path} 不存在`);
                if (callback)
                    callback(e);
                else if (e)
                    feng3d.error(e);
                return;
            }
            this.getArrayBuffer((arraybuffer) =>
            {
                assets.writeArrayBuffer(this.path, arraybuffer, (e) =>
                {
                    if (callback)
                        callback(e);
                    else if (e)
                        feng3d.error(e);
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
            if (content instanceof ArrayBuffer)
            {
                callback(content);
            }
            else if (typeof content == "string")
            {
                if (regExps.image.test(this.path))
                {
                    feng3d.dataTransform.dataURLToArrayBuffer(content, (arrayBuffer) =>
                    {
                        callback(arrayBuffer);
                    });
                } else
                {
                    feng3d.dataTransform.stringToArrayBuffer(content, (arrayBuffer) =>
                    {
                        callback(arrayBuffer);
                    });
                }
            } else
            {
                var obj = feng3d.serialization.serialize(content);
                var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                feng3d.dataTransform.stringToArrayBuffer(str, (arrayBuffer) =>
                {
                    callback(arrayBuffer);
                });
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
            if (this.extension != feng3d.AssetExtension.script)
                return "";
            this.cacheData = null;
            this.getData((code: string) =>
            {
                // 获取脚本类名称
                var result = regExps.scriptClass.exec(code);
                feng3d.assert(result != null, `在脚本 ${this.path} 中没有找到 脚本类定义`);
                var script = result[2];
                // 获取导出类命名空间
                if (result[1])
                {
                    result = regExps.namespace.exec(code);
                    feng3d.assert(result != null, `获取脚本 ${this.path} 命名空间失败`);
                    script = result[1] + "." + script;
                }
                callback(script);
            });
        }
    }
}