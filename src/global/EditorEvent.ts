namespace editor
{
    export interface EditorEventMap
    {
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: feng3d.Vector3
    }

    export var editorDispatcher: feng3d.IEventDispatcher<EditorEventMap> = new feng3d.EventDispatcher();
}