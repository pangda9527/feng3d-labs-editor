module feng3d.editor
{
    export class Editor3DData
    {
        public selectedObject3D: Object3D;

        public camera3D: Camera3D;

        private static _instance: Editor3DData;
        public static get instance()
        {
            this._instance = this._instance || new Editor3DData();
            return this._instance;
        }
    }
}