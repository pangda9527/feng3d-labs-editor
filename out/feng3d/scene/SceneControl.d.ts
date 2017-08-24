declare namespace feng3d.editor {
    class SceneControl {
        private dragSceneMousePoint;
        private dragSceneCameraGlobalMatrix3D;
        private fpsController;
        constructor();
        private onDragSceneStart();
        private onDragScene();
        private onFpsViewStart();
        private onFpsViewStop();
        private rotateSceneCenter;
        private rotateSceneCameraGlobalMatrix3D;
        private rotateSceneMousePoint;
        private onMouseRotateSceneStart();
        private onMouseRotateScene();
        private onLookToSelectedObject3D();
        private onMouseWheelMoveSceneCamera(event);
    }
    class SceneControlConfig {
        mouseWheelMoveStep: number;
        defaultLookDistance: number;
        lookDistance: number;
    }
}
