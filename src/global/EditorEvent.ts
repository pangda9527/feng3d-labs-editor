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
         * 旋转场景摄像机
         */
        editorCameraRotate: feng3d.Vector3
    }
}