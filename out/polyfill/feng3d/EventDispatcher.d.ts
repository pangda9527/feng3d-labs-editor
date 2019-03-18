declare namespace feng3d {
    interface GlobalEvents {
        "editor.selectedObjectsChanged": any;
        "editor.isBaryCenterChanged": any;
        "editor.isWoldCoordinateChanged": any;
        "editor.toolTypeChanged": any;
        "editor.allLoaded": any;
        /**
         * 资源显示文件夹发生变化
         */
        "asset.showFloderChanged": {
            oldpath: string;
            newpath: string;
        };
        /**
         * 删除文件
         */
        "asset.deletefile": {
            id: string;
        };
        /**
         * 更新属性面板（检查器）
         */
        "inspector.update": undefined;
        /**
         * 属性面板（检查器）显示数据
         */
        "inspector.showData": any;
        /**
         * 保存属性面板（检查器）数据
         */
        "inspector.saveShowData": () => void;
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: Vector3;
        /**
         * 使用编辑器打开脚本
         */
        "codeeditor.openScript": feng3d.StringAsset;
        /**
         * 脚本编译
         */
        "script.compile": {
            onComplete?: () => void;
        };
        /**
         * 获取项目依赖库 定义
         */
        "script.gettslibs": {
            callback: (tslibs: {
                path: string;
                code: string;
            }[]) => void;
        };
    }
}
//# sourceMappingURL=EventDispatcher.d.ts.map