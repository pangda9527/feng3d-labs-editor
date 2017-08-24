declare namespace feng3d.editor {
    class Editor3DData {
        /**
         * 项目根路径
         */
        projectRoot: string;
        sceneData: SceneData;
        stage: egret.Stage;
        selectedObject: GameObject;
        camera: Camera;
        /** 3d场景 */
        scene3D: Scene3D;
        view3D: Engine;
        hierarchy: Hierarchy;
        object3DOperationID: number;
        /**
         * 鼠标在view3D中的坐标
         */
        mouseInView3D: Point;
        view3DRect: Rectangle;
        /**
         * 巡视界面数据
         */
        inspectorViewData: InspectorViewData;
        constructor();
    }
}
