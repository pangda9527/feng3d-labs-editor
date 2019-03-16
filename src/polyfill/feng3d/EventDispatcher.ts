namespace feng3d
{
    export interface GlobalEvents
    {
        "editor.selectedObjectsChanged"
        "editor.isBaryCenterChanged"
        "editor.isWoldCoordinateChanged"
        "editor.toolTypeChanged"
        "editor.allLoaded"

        /**
         * 资源显示文件夹发生变化
         */
        "asset.showFloderChanged": { oldpath: string, newpath: string };
        /**
         * 删除文件
         */
        "asset.deletefile": { id: string };


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
        editorCameraRotate: Vector3
    }
}