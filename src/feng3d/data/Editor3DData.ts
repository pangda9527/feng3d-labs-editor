module feng3d.editor
{
    export class Editor3DData
    {
        public sceneData = new SceneData();
        public stage: egret.Stage;

        public selectedObject3D: GameObject;
        public cameraObject3D: CameraObject3D;
        /** 3d场景 */
        public scene3D: Scene3D;
        public view3D: View3D;
        public hierarchy: Hierarchy;

        public object3DOperationID = 0;

        /**
         * 鼠标在view3D中的坐标
         */
        public mouseInView3D: Point = new Point();
        public view3DRect: Rectangle = new Rectangle(0, 0, 100, 100);

        /**
         * 巡视界面数据
         */
        public inspectorViewData: InspectorViewData;

        constructor()
        {
            this.inspectorViewData = new InspectorViewData(this);
        }
    }
}