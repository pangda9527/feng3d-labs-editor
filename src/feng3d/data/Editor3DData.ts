module feng3d.editor
{
    export class Editor3DData
    {
        public selectedObject3D: Object3D;
        public camera3D: Camera3D;
        public view3D: View3D;
        public hierarchy: Hierarchy;
        /**
         * 鼠标在view3D中的坐标
         */
        public mouseInView3D: Point = new Point();
        public view3DRect: Rectangle = new Rectangle(0, 0, 100, 100);

        private static _instance: Editor3DData;
        public static get instance()
        {
            this._instance = this._instance || new Editor3DData();
            return this._instance;
        }
    }
}