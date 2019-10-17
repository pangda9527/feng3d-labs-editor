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
         * 游戏运行时的场景
         */
        gameScene: feng3d.Scene3D;

        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        get selectedObjects()
        {
            return this._selectedObjects;
        }

        set selectedObjects(v)
        {
            v = v.filter(v => !!v);
            if (!v) v = [];
            if (v == this._selectedObjects) return;
            if (v.length == this.selectedObjects.length && v.concat(this._selectedObjects).unique().length == v.length) return;

            this._selectedObjects = v;

            this._selectedGameObjectsInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;

            feng3d.dispatcher.dispatch("editor.selectedObjectsChanged");
        }
        private _selectedObjects = [];

        clearSelectedObjects()
        {
            this.selectedObjects = [];
        }

        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(object: any)
        {
            var selecteds = this.selectedObjects.concat();

            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd) selecteds.length = 0;
            //
            var index = selecteds.indexOf(object);
            if (index == -1) selecteds.push(object);
            else selecteds.splice(index, 1);
            //
            this.selectedObjects = selecteds;
        }

        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectMultiObject(objs: (feng3d.GameObject | AssetNode)[])
        {
            var selecteds = this.selectedObjects.concat();

            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd) selecteds.length = 0;
            //
            objs.forEach(v =>
            {
                var index = selecteds.indexOf(v);
                if (index == -1) selecteds.push(v);
                else selecteds.splice(index, 1);
            });
            //
            this.selectedObjects = selecteds;
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
            feng3d.dispatcher.dispatch("editor.toolTypeChanged");
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
                this.selectedObjects.forEach(v =>
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
            feng3d.dispatcher.dispatch("editor.isBaryCenterChanged");
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
            feng3d.dispatcher.dispatch("editor.isWoldCoordinateChanged");
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
        private _transformBox: feng3d.AABB;
        private _transformBoxInvalid = true;

        /**
         * 选中游戏对象列表
         */
        get selectedAssetNodes()
        {
            if (this._selectedAssetFileInvalid)
            {
                this._selectedAssetNodes.length = 0;
                this.selectedObjects.forEach(v =>
                {
                    if (v instanceof AssetNode) this._selectedAssetNodes.push(v);
                });
                this._selectedAssetFileInvalid = false;
            }
            return this._selectedAssetNodes;
        }
        private _selectedAssetFileInvalid = true;
        private _selectedAssetNodes: AssetNode[] = [];

        /**
         * 编辑器打开的脚本
         */
        openScript: feng3d.StringAsset;

        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetPath(url: string)
        {
            return document.URL.substring(0, document.URL.lastIndexOf("/") + 1) + "resource/" + url;
        }
    }

    editorData = new EditorData();
}