export declare class Editorshortcut {
    private preMousePoint;
    private selectedObjectsHistory;
    private dragSceneMousePoint;
    private dragSceneCameraGlobalMatrix3D;
    private rotateSceneCenter;
    private rotateSceneCameraGlobalMatrix3D;
    private rotateSceneMousePoint;
    constructor();
    private areaSelectStartPosition;
    private onAreaSelectStart;
    private onAreaSelect;
    private onAreaSelectEnd;
    private onGameobjectMoveTool;
    private onGameobjectRotationTool;
    private onGameobjectScaleTool;
    private onSceneCameraForwardBackMouseMoveStart;
    private onSceneCameraForwardBackMouseMove;
    private onSelectGameObject;
    private onDeleteSeletedGameObject;
    private onDragSceneStart;
    private onDragScene;
    private onFpsViewStart;
    private onFpsViewStop;
    private updateFpsView;
    private onMouseRotateSceneStart;
    private onMouseRotateScene;
    private onLookToSelectedGameObject;
    private onMouseWheelMoveSceneCamera;
    private onOpenDevTools;
    private onRefreshWindow;
}
export declare class SceneControlConfig {
    mouseWheelMoveStep: number;
    lookDistance: number;
    sceneCameraForwardBackwardStep: number;
}
export declare var sceneControlConfig: SceneControlConfig;
//# sourceMappingURL=Editorshortcut.d.ts.map