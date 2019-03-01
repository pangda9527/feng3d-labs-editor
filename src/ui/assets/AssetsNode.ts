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
         * @param feng3dAssets 资源
         */
        constructor(feng3dAssets: feng3d.Feng3dAssets)
        {
            super();

            this.feng3dAssets = feng3dAssets;
            this.isDirectory = feng3dAssets.assetType == feng3d.AssetExtension.folder;
            this.label = feng3dAssets.name;
            // 更新图标
            if (this.isDirectory)
            {
                this.image = "folder_png";
            }
            else
            {
                this.image = "file_png";
            }

            feng3dAssets.readThumbnail(editorFS.fs, (err, image) =>
            {
                if (image)
                {
                    this.image = feng3d.dataTransform.imageToDataURL(image);
                } else
                {
                    this.updateImage();
                }
            });
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

            editorFS.readAssets(this.feng3dAssets.assetsId, (err, assets: feng3d.Feng3dAssets) =>
            {
                feng3d.assert(!err);

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
            if (this.feng3dAssets instanceof feng3d.TextureFile)
            {
                var texture = this.feng3dAssets.texture;

                this.image = texture.dataURL;

                feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                {
                    editorFS.writeAssetsIcon(this.feng3dAssets.assetsId, image);
                });

            } else if (this.feng3dAssets instanceof feng3d.TextureCube)
            {
                var textureCube = this.feng3dAssets;
                textureCube.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawTextureCube(textureCube);
                });
            } else if (this.feng3dAssets instanceof feng3d.MaterialFile)
            {
                var mat = this.feng3dAssets;
                mat.data.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawMaterial(mat.data).toDataURL();
                    feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                    {
                        editorFS.writeAssetsIcon(this.feng3dAssets.assetsId, image);
                    });
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
         * 导出
         */
        export()
        {
            feng3d.error("未实现");

            var zip = new JSZip();

            var path = this.feng3dAssets.assetsPath;
            if (!feng3d.pathUtils.isDirectory(path))
                path = feng3d.pathUtils.getParentPath(path);

            var filename = this.label;
            editorFS.fs.getAllfilepathInFolder(path, (err, filepaths) =>
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