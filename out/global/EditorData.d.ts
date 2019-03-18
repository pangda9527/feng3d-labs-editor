declare namespace editor {
    /**
     * 编辑器数据
     */
    var editorData: EditorData;
    /**
     * 游戏对象控制器类型
     */
    enum MRSToolType {
        /**
         * 移动
         */
        MOVE = 0,
        /**
         * 旋转
         */
        ROTATION = 1,
        /**
         * 缩放
         */
        SCALE = 2
    }
    /**
     * 编辑器数据
     */
    class EditorData {
        /**
         * 2D UI舞台
         */
        stage: egret.Stage;
        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        readonly selectedObjects: (feng3d.GameObject | AssetNode)[];
        private _selectedObjects;
        clearSelectedObjects(): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(object: (feng3d.GameObject | AssetNode)): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectMultiObject(objs: (feng3d.GameObject | AssetNode)[]): void;
        /**
         * 使用的控制工具类型
         */
        toolType: MRSToolType;
        private _toolType;
        /**
         * 选中游戏对象列表
         */
        readonly selectedGameObjects: feng3d.GameObject[];
        private _selectedGameObjects;
        private _selectedGameObjectsInvalid;
        /**
         * 坐标原点是否在质心
         */
        isBaryCenter: boolean;
        private _isBaryCenter;
        /**
         * 是否使用世界坐标
         */
        isWoldCoordinate: boolean;
        private _isWoldCoordinate;
        /**
         * 变换对象
         */
        readonly transformGameObject: feng3d.GameObject;
        private _transformGameObject;
        private _transformGameObjectInvalid;
        readonly transformBox: feng3d.Box;
        private _transformBox;
        private _transformBoxInvalid;
        /**
         * 选中游戏对象列表
         */
        readonly selectedAssetNodes: AssetNode[];
        private _selectedAssetFileInvalid;
        private _selectedAssetNodes;
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetPath(url: string): string;
    }
}
//# sourceMappingURL=EditorData.d.ts.map