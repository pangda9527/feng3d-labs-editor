namespace feng3d
{
    export interface Feng3dEventMap
    {
        "editor.selectedObjectsChanged"
        "editor.isBaryCenterChanged"
        "editor.isWoldCoordinateChanged"
        "editor.toolTypeChanged"
        "editor.allLoaded"

        /**
         * 资源显示文件夹发生变化
         */
        "assets.showFloderChanged": { oldpath: string, newpath: string };
        /**
         * 删除文件
         */
        "assets.deletefile": { id: string };

        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: feng3d.Vector3
    }
}