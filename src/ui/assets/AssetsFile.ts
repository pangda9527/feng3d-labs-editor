namespace editor
{
    export interface AssetsFileEventMap extends TreeNodeMap
    {
        /**
         * 加载完成
         */
        loaded
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
                this.dispatch("loaded");
                if (loadingNum == 0)
                {
                    feng3d.feng3dDispatcher.dispatch("editor.allLoaded");
                }
            });
        }

        private init()
        {
            this.isDirectory = this.feng3dAssets instanceof Feng3dFolder;
            this.label = this.feng3dAssets.name;

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
         * 导出
         */
        export()
        {
            var zip = new JSZip();
            var path = this.feng3dAssets.path;
            path = path.substring(0, path.lastIndexOf("/") + 1);
            var filename = this.label;
            assets.getAllfilepathInFolder(path, (err, filepaths) =>
            {
                readfiles();
                function readfiles()
                {
                    if (filepaths.length > 0)
                    {
                        var filepath = filepaths.shift();
                        assets.readArrayBuffer(filepath, (err, data: ArrayBuffer) =>
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