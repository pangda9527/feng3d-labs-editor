namespace feng3d.editor
{
    export interface EditorEventMap
    {
        import

        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: Vector3D
    }

    export var editorDispatcher: IEventDispatcher<EditorEventMap> = new EventDispatcher();
}