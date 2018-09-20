namespace editor
{
    export interface AssetsFileEventMap extends TreeNodeMap
    {
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

    export class AssetsFile extends TreeNode
    {
        @feng3d.serialize
        @feng3d.watch("idChanged")
        id = "";

        /**
         * 路径
         */
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

        @feng3d.serialize
        children: AssetsFile[] = [];

        parent: AssetsFile;

        feng3dAssets: feng3d.Feng3dAssets;

        constructor(id: string = "")
        {
            super();
            this.id = id;
        }

        /**
         * 更新父对象
         */
        updateParent()
        {
            this.children.forEach(element =>
            {
                element.parent = this;
                element.updateParent();
            });
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
            this.isDirectory = this.feng3dAssets instanceof Feng3dFolder;
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
            if (this.feng3dAssets instanceof feng3d.UrlImageTexture2D)
            {
                assets.readDataURL(this.feng3dAssets.url, (err, dataurl) =>
                {
                    this.image = dataurl;
                });
            }
        }

        addAssets(feng3dAssets: feng3d.Feng3dAssets)
        {
            assets.saveAssets(feng3dAssets);
            var assetsFile = new AssetsFile(feng3dAssets.assetsId);
            this.addChild(assetsFile);
            return assetsFile;
        }

        /**
         * 删除
         */
        delete()
        {
            this.remove();
            assets.deleteAssets(this.id);
            delete editorAssets.files[this.id];
            feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: this.id });
        }

        getFolderList(includeClose = false)
        {
            var folders = [];
            if (this.isDirectory)
            {
                folders.push(this);
            }
            if (this.isOpen || includeClose)
            {
                this.children.forEach(v =>
                {
                    var cfolders = v.getFolderList();
                    folders = folders.concat(cfolders);
                });
            }
            return folders;
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
         * 新增文件从ArrayBuffer
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        addfileFromArrayBuffer(filename: string, arraybuffer: ArrayBuffer, override = false, callback?: (e: Error, file: AssetsFile) => void)
        {
            var feng3dFile = new Feng3dFile().value({ name: filename, filename: filename, arraybuffer: arraybuffer });
            assets.saveAssets(feng3dFile);
            assets.writeArrayBuffer(feng3dFile.filePath, arraybuffer, err =>
            {
                var assetsFile = this.addAssets(feng3dFile);
                callback(err, assetsFile);
            });
        }

        /**
         * 保存数据到文件
         * @param create 如果文件不存在，是否新建文件
         * @param callback 回调函数
         */
        save(create = false, callback?: (err: Error) => void)
        {
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
            var content = this.feng3dAssets;
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
    }
}