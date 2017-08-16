namespace feng3d.editor
{
    export class Editor3DData
    {
        sceneData = new SceneData();
        stage: egret.Stage;

        selectedObject: GameObject;

        camera: Camera;
        /** 3d场景 */
        scene3D: Scene3D;
        view3D: Engine;
        hierarchy: Hierarchy;

        object3DOperationID = 0;

        /**
         * 鼠标在view3D中的坐标
         */
        mouseInView3D: Point = new Point();
        view3DRect: Rectangle = new Rectangle(0, 0, 100, 100);

        /**
         * 巡视界面数据
         */
        inspectorViewData: InspectorViewData;

        constructor()
        {
            this.inspectorViewData = new InspectorViewData(this);
        }
    }
}