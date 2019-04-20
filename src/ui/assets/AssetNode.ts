namespace editor
{
    export interface AssetNodeEventMap extends TreeNodeMap
    {
        /**
         * 加载完成
         */
        loaded
    }

    export interface AssetNode
    {
        once<K extends keyof AssetNodeEventMap>(type: K, listener: (event: feng3d.Event<AssetNodeEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof AssetNodeEventMap>(type: K, data?: AssetNodeEventMap[K], bubbles?: boolean): feng3d.Event<AssetNodeEventMap[K]>;
        has<K extends keyof AssetNodeEventMap>(type: K): boolean;
        on<K extends keyof AssetNodeEventMap>(type: K, listener: (event: feng3d.Event<AssetNodeEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof AssetNodeEventMap>(type?: K, listener?: (event: feng3d.Event<AssetNodeEventMap[K]>) => any, thisObject?: any);
    }

    /**
     * 资源树结点
     */
    export class AssetNode extends TreeNode
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
        children: AssetNode[] = [];

        parent: AssetNode;

        asset: feng3d.FileAsset;

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
         * @param asset 资源
         */
        constructor(asset: feng3d.FileAsset)
        {
            super();

            this.asset = asset;
            this.isDirectory = asset.assetType == feng3d.AssetType.folder;
            this.label = asset.fileName;
            // 更新图标
            if (this.isDirectory)
            {
                this.image = "folder_png";
            }
            else
            {
                this.image = "file_png";
            }

            asset.readThumbnail((err, image) =>
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

            editorRS.readAsset(this.asset.assetId, (err, asset) =>
            {
                feng3d.debuger && console.assert(!err);

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
            if (this.asset instanceof feng3d.TextureAsset)
            {
                var texture = this.asset.data;

                this.image = texture.dataURL;

                feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                {
                    this.asset.writeThumbnail(image);
                });

            } else if (this.asset instanceof feng3d.TextureCubeAsset)
            {
                var textureCube = this.asset.data;
                textureCube.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawTextureCube(textureCube);

                    feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                    {
                        this.asset.writeThumbnail(image);
                    });
                });
            } else if (this.asset instanceof feng3d.MaterialAsset)
            {
                var mat = this.asset;
                mat.data.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawMaterial(mat.data).toDataURL();
                    feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                    {
                        this.asset.writeThumbnail(image);
                    });
                });
            } else if (this.asset instanceof feng3d.GeometryAsset)
            {
                this.image = feng3dScreenShot.drawGeometry(<any>this.asset.data).toDataURL();

                feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                {
                    this.asset.writeThumbnail(image);
                });
            } else if (this.asset instanceof feng3d.GameObjectAsset)
            {
                var gameObject = this.asset.data;
                gameObject.onLoadCompleted(() =>
                {
                    this.image = feng3dScreenShot.drawGameObject(gameObject).toDataURL();
                    feng3d.dataTransform.dataURLToImage(this.image, (image) =>
                    {
                        this.asset.writeThumbnail(image);
                    });
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

            editorAsset.deleteAsset(this);
        }

        /**
         * 获取文件夹列表
         * 
         * @param includeClose 是否包含关闭的文件夹
         */
        getFolderList(includeClose = false)
        {
            var folders: AssetNode[] = [];
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
            var files: AssetNode[] = [];
            files.push(this);
            this.children.forEach(v =>
            {
                var cfiles = v.getFileList();
                files = files.concat(cfiles);
            });
            return files;
        }

        /**
         * 提供拖拽数据
         * 
         * @param dragsource 
         */
        setdargSource(dragsource: DragData)
        {
            var extension = this.asset.assetType;
            switch (extension)
            {
                case feng3d.AssetType.gameobject:
                    dragsource.addDragData("file_gameobject", <any>this.asset);
                    break;
                case feng3d.AssetType.script:
                    dragsource.addDragData("file_script", <any>this.asset);
                    break;
                case feng3d.AssetType.anim:
                    dragsource.addDragData("animationclip", <any>this.asset.data);
                    break;
                case feng3d.AssetType.material:
                    dragsource.addDragData("material", <any>this.asset.data);
                    break;
                case feng3d.AssetType.texturecube:
                    dragsource.addDragData("texturecube", <any>this.asset.data);
                    break;
                case feng3d.AssetType.geometry:
                    dragsource.addDragData("geometry", <any>this.asset.data);
                    break;
                case feng3d.AssetType.texture:
                    dragsource.addDragData("texture2d", <any>this.asset.data);
                    break;
                case feng3d.AssetType.audio:
                    dragsource.addDragData("audio", <any>this.asset.data);
                    break;
            }
            dragsource.addDragData("assetNodes", this);
        }

        /**
         * 接受拖拽数据
         * 
         * @param dragdata 
         */
        acceptDragDrop(dragdata: DragData)
        {
            if (!(this.asset instanceof feng3d.FolderAsset)) return;
            var folder = this.asset;

            dragdata.getDragData("assetNodes").forEach(v =>
            {
                editorRS.moveAsset(v.asset, folder, (err) =>
                {
                    if (!err)
                    {
                        this.addChild(v);
                    } else
                    {
                        feng3d.dispatcher.dispatch("message.error", err.message);
                    }
                });
            });
        }

        /**
         * 导出
         */
        export()
        {
            console.error("未实现");

            var zip = new JSZip();

            var path = this.asset.assetPath;
            if (!feng3d.pathUtils.isDirectory(path))
                path = feng3d.pathUtils.getParentPath(path);

            var filename = this.label;
            editorRS.fs.getAllfilepathInFolder(path, (err, filepaths) =>
            {
                readfiles();
                function readfiles()
                {
                    if (filepaths.length > 0)
                    {
                        var filepath = filepaths.shift();
                        editorRS.fs.readArrayBuffer(filepath, (err, data: ArrayBuffer) =>
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