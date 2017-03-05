module feng3d.editor
{
    export class Editor3DData
    {
        public selectedObject3D: Object3D;
        public camera3D: Camera3D;
        public view3D: View3D;
        public hierarchy: Hierarchy;

        public object3DOperationID = 0;

        /**
         * 鼠标在view3D中的坐标
         */
        public mouseInView3D: Point = new Point();
        public view3DRect: Rectangle = new Rectangle(0, 0, 100, 100);
    }
}