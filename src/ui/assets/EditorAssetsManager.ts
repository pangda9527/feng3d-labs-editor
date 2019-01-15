namespace editor
{
    /**
     * 资源字典表存储路径
     */
    export const assetsFilePath = "assets.json";

    /**
     * 编辑器资源管理器
     */
    export var editorAssetsManager: EditorAssetsManager;

    /**
     * 编辑器资源管理器
     */
    export class EditorAssetsManager
    {
        /**
         * 资源ID字典
         */
        private _assetsIDMap: { [id: string]: AssetsFile } = {};

        /**
         * 根据资源编号获取文件
         * 
         * @param assetsId 文件路径
         */
        getAssetsByID(assetsId: string)
        {
            return this._assetsIDMap[assetsId];
        }

        /**
         * 根据路径获取资源
         * 
         * @param assetsPath 资源路径
         */
        getAssetsByPath(assetsPath: string)
        {
            var id = feng3d.assetsIDPathMap.getID(assetsPath);
            return this.getAssetsByID(id);
        }

        /**
         * 删除资源
         * 
         * @param assetsFile 资源
         */
        deleteAssets(assetsFile: AssetsFile)
        {
            feng3d.assert(!!this._assetsIDMap[assetsFile.id]);

            delete this._assetsIDMap[assetsFile.id];
            feng3d.assetsIDPathMap.deleteByID(assetsFile.id);

            editorFS.deleteFile(assetsFile.path);

            feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: assetsFile.id });

            this.saveProject();
        }

        /**
         * 保存项目
         * @param callback 完成回调
         */
        saveProject(callback?: (err: Error) => void)
        {
            var object = Object.keys(this._assetsIDMap).map(element =>
            {
                return { id: element, path: this._assetsIDMap[element].path, isDirectory: this._assetsIDMap[element].isDirectory };
            });

            editorFS.writeObject(assetsFilePath, object, callback);
        }

        /**
         * 新增资源
         * 
         * @param assetsFile 资源
         */
        addAssets(assetsFile: AssetsFile)
        {
            //
            feng3d.assert(!this._assetsIDMap[assetsFile.id]);
            this._assetsIDMap[assetsFile.id] = assetsFile;

            feng3d.assetsIDPathMap.addIDPathMap(assetsFile.id, assetsFile.path);

            this.saveProject();
        }

        /**
         * 保存资源
         * 
         * @param assetsFile 资源
         * @param callback 完成回调
         */
        saveAssets(assetsFile: AssetsFile, callback?: () => void)
        {
            feng3d.assert(!!this._assetsIDMap[assetsFile.id], `无法保存已经被删除的资源！`);

            if (assetsFile.isDirectory)
            {
                editorFS.mkdir(assetsFile.path, (err) =>
                {
                    if (err) feng3d.assert(!err);
                    callback && callback();
                });
                return;
            }
            editorFS.writeObject(assetsFile.path, assetsFile.feng3dAssets, (err) =>
            {
                feng3d.assert(!err, `资源 ${assetsFile.path} 保存失败！`);
                callback && callback();
            });
        }

        /**
         * 移动资源
         * 
         * @param assetsFile 资源文件
         * @param newPath 新路径
         */
        moveAssets(assetsFile: AssetsFile, newPath: string)
        {
            var oldPath = assetsFile.path;
            editorFS.move(oldPath, newPath);

            var files = assetsFile.getFileList();
            // 更新资源结点中文件路径
            files.forEach(file =>
            {
                feng3d.assetsIDPathMap.deleteByID(file.id);
                file.path = file.path.replace(oldPath, newPath);
                feng3d.assetsIDPathMap.addIDPathMap(file.id, file.path);
            });
        }

        /**
         * 获取脚本列表
         */
        getScripts()
        {
            var files = this._assetsIDMap;
            var tslist: feng3d.ScriptFile[] = [];
            for (const key in files)
            {
                var file = files[key].feng3dAssets;
                if (file instanceof feng3d.ScriptFile)
                {
                    tslist.push(file);
                }
            }
            return tslist;
        }

        /**
         * 获取指定类型资源
         * @param type 资源类型
         */
        getAssetsByType<T extends feng3d.Feng3dAssets>(type: feng3d.Constructor<T>)
        {
            var assetsFiles = Object.keys(this._assetsIDMap).map(key => this._assetsIDMap[key]).filter(element => element.feng3dAssets instanceof type);
            return assetsFiles;
        }

    }

    editorAssetsManager = new EditorAssetsManager();
}