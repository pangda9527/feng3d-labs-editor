namespace editor
{

    /**
     * 编辑器数据
     */
    export var editorData: EditorData;

    /**
     * 游戏对象控制器类型
     */
    export enum MRSToolType
    {
        /**
         * 移动
         */
        MOVE,
        /**
         * 旋转
         */
        ROTATION,
        /**
         * 缩放
         */
        SCALE,
    }

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
        private _selectedObjects: (feng3d.GameObject | AssetsNode)[] = [];

        clearSelectedObjects()
        {
            this._selectedObjects.length = 0;
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.selectedObjectsChanged");
        }

        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(object: (feng3d.GameObject | AssetsNode))
        {
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd) this._selectedObjects.length = 0;
            //
            var index = this._selectedObjects.indexOf(object);
            if (index == -1) this._selectedObjects.push(object);
            else this._selectedObjects.splice(index, 1);
            //
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.selectedObjectsChanged");
        }

        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectMultiObject(objs: (feng3d.GameObject | AssetsNode)[])
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
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.selectedObjectsChanged");
        }



        /**
         * 使用的控制工具类型
         */
        get toolType()
        {
            return this._toolType;
        }
        set toolType(v)
        {
            if (this._toolType == v) return;
            this._toolType = v;
            feng3d.feng3dDispatcher.dispatch("editor.toolTypeChanged");
        }

        private _toolType = MRSToolType.MOVE;

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
         * 坐标原点是否在质心
         */
        get isBaryCenter()
        {
            return this._isBaryCenter;
        }
        set isBaryCenter(v)
        {
            if (this._isBaryCenter == v) return;
            this._isBaryCenter = v;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.isBaryCenterChanged");
        }
        private _isBaryCenter = true;

        /**
         * 是否使用世界坐标
         */
        get isWoldCoordinate()
        {
            return this._isWoldCoordinate;
        }
        set isWoldCoordinate(v)
        {
            if (this._isWoldCoordinate == v) return;
            this._isWoldCoordinate = v;
            feng3d.feng3dDispatcher.dispatch("editor.isWoldCoordinateChanged");
        }
        private _isWoldCoordinate = false;

        /**
         * 变换对象
         */
        get transformGameObject()
        {
            if (this._transformGameObjectInvalid)
            {
                var length = this.selectedGameObjects.length;
                if (length > 0)
                    this._transformGameObject = this.selectedGameObjects[length - 1];
                else
                    this._transformGameObject = null;
                this._transformGameObjectInvalid = false;
            }
            return this._transformGameObject;
        }
        private _transformGameObject: feng3d.GameObject;
        private _transformGameObjectInvalid = true;

        get transformBox()
        {
            if (this._transformBoxInvalid)
            {
                var length = this.selectedGameObjects.length;
                if (length > 0)
                {
                    this._transformBox = null;
                    this.selectedGameObjects.forEach(cv =>
                    {
                        var box = cv.worldBounds;
                        if (editorData.isBaryCenter || this._transformBox == null)
                        {
                            this._transformBox = box.clone();
                        } else
                        {
                            this._transformBox.union(box);
                        }
                    });
                }
                else
                {
                    this._transformBox = null;
                }
                this._transformBoxInvalid = false;
            }
            return this._transformBox;
        }
        private _transformBox: feng3d.Box;
        private _transformBoxInvalid = true;

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
                    if (v instanceof AssetsNode) this._selectedAssetsFile.push(v);
                });
                this._selectedAssetsFileInvalid = false;
            }
            return this._selectedAssetsFile;
        }
        private _selectedAssetsFileInvalid = true;
        private _selectedAssetsFile: AssetsNode[] = [];

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