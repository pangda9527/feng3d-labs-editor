namespace editor
{

    /**
     * 编辑器数据
     */
    export var editorData: EditorData;

    /**
     * 编辑器数据
     */
    export class EditorData
    {
        /**
         * 2D UI舞台
         */
        stage: egret.Stage;

        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        get selectedObjects()
        {
            return this._selectedObjects;
        }
        private _selectedObjects: (feng3d.GameObject | AssetsFile)[] = [];

        clearSelectedObjects()
        {
            this._selectedObjects.length = 0;
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.onSelectedObjectsChanged");
        }

        /**
         * 位移旋转缩放工具对象
         */
        mrsToolObject: feng3d.GameObject;

        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(...objs: (feng3d.GameObject | AssetsFile)[])
        {
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd) this._selectedObjects.length = 0;
            objs.forEach(v =>
            {
                var index = this._selectedObjects.indexOf(v);
                if (index == -1) this._selectedObjects.push(v);
                else this._selectedObjects.splice(index, 1);
            });
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.onSelectedObjectsChanged");
        }

        /**
         * 选中游戏对象列表
         */
        get selectedGameObjects()
        {
            if (this._selectedGameObjectsInvalid)
            {
                this._selectedGameObjects.length = 0;
                this._selectedObjects.forEach(v =>
                {
                    if (v instanceof feng3d.GameObject) this._selectedGameObjects.push(v);
                });

                this._selectedGameObjectsInvalid = false;
            }
            return this._selectedGameObjects;
        }
        private _selectedGameObjects: feng3d.GameObject[] = [];
        private _selectedGameObjectsInvalid = true;

        /**
         * 第一个选中游戏对象
         */
        get firstSelectedGameObject()
        {
            return this.selectedGameObjects[0];
        }

        /**
         * 获取 受 MRSTool 控制的Transform列表
         */
        get mrsTransforms()
        {
            var transforms = <feng3d.Transform[]>this.selectedGameObjects.reduce((result, item) =>
            {
                result.push(item.transform);
                return result;
            }, []);
            return transforms;
        }

        /**
         * 选中游戏对象列表
         */
        get selectedAssetsFile()
        {
            if (this._selectedAssetsFileInvalid)
            {
                this._selectedAssetsFile.length = 0;
                this._selectedObjects.forEach(v =>
                {
                    if (v instanceof AssetsFile) this._selectedAssetsFile.push(v);
                });
                this._selectedAssetsFileInvalid = false;
            }
            return this._selectedObjects;
        }
        private _selectedAssetsFileInvalid = true;
        private _selectedAssetsFile: AssetsFile[] = [];

        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetsPath(url: string)
        {
            return document.URL.substring(0, document.URL.lastIndexOf("/") + 1) + "resource/" + url;
        }
    }

    editorData = new EditorData();
}