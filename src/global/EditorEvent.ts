namespace feng3d.editor
{
    export interface EditorEventMap
    {
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: Vector3
    }

    export var editorDispatcher: IEventDispatcher<EditorEventMap> = new EventDispatcher();
}