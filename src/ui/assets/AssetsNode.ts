namespace editor
{
    export interface AssetsFileEventMap extends TreeNodeMap
    {
        /**
         * 加载完成
         */
        loaded
    }

    export interface AssetsNode
    {
        once<K extends keyof AssetsFileEventMap>(type: K, listener: (event: feng3d.Event<AssetsFileEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof AssetsFileEventMap>(type: K, data?: AssetsFileEventMap[K], bubbles?: boolean): feng3d.Event<AssetsFileEventMap[K]>;
        has<K extends keyof AssetsFileEventMap>(type: K): boolean;
        on<K extends keyof AssetsFileEventMap>(type: K, listener: (event: feng3d.Event<AssetsFileEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof AssetsFileEventMap>(type?: K, listener?: (event: feng3d.Event<AssetsFileEventMap[K]>) => any, thisObject?: any);
    }

    export class AssetsNode extends TreeNode
    {
        /**
         * 编号
         */
        get id() { return this._id; }
        private _id: string;

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
         * 显示标签
         */
        label: string;

        @feng3d.serialize
        children: AssetsNode[] = [];

        parent: AssetsNode;

        feng3dAssets: feng3d.Feng3dAssets;

        /**
         * 元标签，用于描述资源类型等信息
         */
        meta: AssetsMeta;

        /**
         * 是否已加载
         */
        isLoaded = false;

        /**
         * 是否加载中
         */
        private isLoading: boolean;

        /**
         * 构建
         * 
         * @param id 编号
         * @param path 路径
         */
        constructor(id: string, path: string, isDirectory: boolean)
        {
            super();
            feng3d.assert(!!id);
            feng3d.assert(!!path);

            this._id = id;
            this.path = path;
            this.isDirectory = isDirectory;
            if (isDirectory) this.isLoaded = true;
            this.label = feng3d.pathUtils.getName(path);
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

        /**
         * 加载元标签文件
         * 
         * @param callback 加载完成回调
         */
        loadMeta(callback?: () => void)
        {

        }

        /**
         * 加载
         * 
         * @param callback 加载完成回调
         */
        load(callback?: () => void)
        {
            if (this.isLoaded)
            {
                callback && callback();
                return;
            }

            if (this.isLoading)
            {
                callback && this.on("loaded", callback);
                return;
            }

            this.isLoading = true;

            editorFS.fs.readObject(this.path, (err, assets: feng3d.Feng3dAssets) =>
            {
                feng3d.assert(!err);

                assets.name = feng3d.pathUtils.getNameWithExtension(this.path);
                this.feng3dAssets = assets;

                this.isLoading = false;
                this.isLoaded = true;

                callback && callback();

                this.dispatch("loaded", this);
            });
        }

        /**
         * 更新缩略图
         */
        updateImage()
        {
            if (this.feng3dAssets instanceof feng3d.UrlImageTexture2D)
            {
                var texture = this.feng3dAssets;
                texture.onLoadCompleted(() =>
                {
                    this.image = texture.dataURL;
                });
            } else if (this.feng3dAssets instanceof feng3d.TextureCube)
            {
                var textureCube = this.feng3dAssets;
                textureCube.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawTextureCube(textureCube);
                });
            } else if (this.feng3dAssets instanceof feng3d.Material)
            {
                var mat = this.feng3dAssets;
                mat.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawMaterial(mat).toDataURL();
                });
            } else if (this.feng3dAssets instanceof feng3d.Geometry)
            {
                this.image = feng3dScreenShot.drawGeometry(<any>this.feng3dAssets).toDataURL();
            } else if (this.feng3dAssets instanceof feng3d.GameObject)
            {
                var gameObject = this.feng3dAssets;
                gameObject.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawGameObject(gameObject).toDataURL();
                });
            }
        }

        /**
         * 删除
         */
        delete()
        {
            this.children.forEach(element =>
            {
                element.delete();
            });
            this.remove();

            editorAssets.deleteAssets(this);
        }

        /**
         * 获取文件夹列表
         * 
         * @param includeClose 是否包含关闭的文件夹
         */
        getFolderList(includeClose = false)
        {
            var folders: AssetsNode[] = [];
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
         * 获取文件列表
         */
        getFileList()
        {
            var files: AssetsNode[] = [];
            files.push(this);
            this.children.forEach(v =>
            {
                var cfiles = v.getFileList();
                files = files.concat(cfiles);
            });
            return files;
        }

        /**
         * 获取新子文件名称
         * 
         * @param childName 基础名称
         */
        getNewChildFileName(childName: string)
        {
            var childrenNames = this.children.map(v => feng3d.pathUtils.getNameWithExtension(v.path));
            if (childrenNames.indexOf(childName) == -1) return childName;

            var baseName = feng3d.pathUtils.getName(childName);
            var extension = feng3d.pathUtils.getExtension(childName);
            if (extension.length > 0) extension = "." + extension;

            var i = 1;
            var newName = baseName + extension;
            while (childrenNames.indexOf(newName) != -1)
            {
                newName = baseName + i + extension;
                i++;
            }

            return newName;
        }

        /**
         * 获取新子文件路径
         * 
         * @param basename 基础名称
         */
        getNewChildPath(basename: string)
        {
            var newName = this.getNewChildFileName(basename);
            var path = feng3d.pathUtils.getChildFilePath(this.path, newName);
            return path;
        }

        /**
         * 新增文件从ArrayBuffer
         * 
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        addfileFromArrayBuffer(filename: string, arraybuffer: ArrayBuffer, override = false, callback?: (e: Error, file: AssetsNode) => void)
        {
            var feng3dFile = Object.setValue(new feng3d.ArrayBufferFile(), { name: filename, arraybuffer: arraybuffer });

            var path = this.getNewChildPath(filename);

            feng3d.error(`未实现`);

            // assets.writeAssets(feng3dFile);
            editorFS.fs.writeArrayBuffer(path, arraybuffer, err =>
            {
                var assetsFile = editorAssets.createAssets(this, filename, feng3dFile);
                callback(err, assetsFile);
            });
        }

        /**
         * 导出
         */
        export()
        {
            var zip = new JSZip();

            var path = this.path;
            if (!feng3d.pathUtils.isDirectory(path))
                path = feng3d.pathUtils.getParentPath(path);

            var filename = this.label;
            editorFS.getAllfilepathInFolder(path, (err, filepaths) =>
            {
                readfiles();
                function readfiles()
                {
                    if (filepaths.length > 0)
                    {
                        var filepath = filepaths.shift();
                        editorFS.fs.readArrayBuffer(filepath, (err, data: ArrayBuffer) =>
                        {
                            //处理文件夹
                            data && zip.file(filepath, data);
                            readfiles();
                        });
                    } else
                    {
                        zip.generateAsync({ type: "blob" }).then(function (content)
                        {
                            saveAs(content, `${filename}.zip`);
                        });
                    }
                }
            });
        }
    }
}