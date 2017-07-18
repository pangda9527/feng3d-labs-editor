module feng3d.editor
{
    export class Object3DControllerToolBase extends Component
    {
        private _selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateScaleCube | CoordinateRotationAxis | CoordinateRotationFreeAxis;
        //
        private _toolModel: Component | GameObject;

        protected ismouseDown = false;

        //平移平面，该平面处于场景空间，用于计算位移量
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;

        protected _object3DControllerTarget: Object3DControllerTarget;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.transform.holdSize = 1;

            Event.on(this.transform, <any>Scene3DEvent.ADDED_TO_SCENE, this.onAddedToScene, this);
            Event.on(this.transform, <any>Scene3DEvent.REMOVED_FROM_SCENE, this.onRemovedFromScene, this);
        }

        protected onAddedToScene()
        {
            this.updateToolModel();
            this._object3DControllerTarget.controllerTool = this.transform;
            //
            Event.on(input, <any>inputType.MOUSE_DOWN, this.onMouseDown, this);
            Event.on(input, <any>inputType.MOUSE_UP, this.onMouseUp, this);
            Event.on(this, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
            Event.on(editor3DData.camera.transform, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
        }

        protected onRemovedFromScene()
        {
            this._object3DControllerTarget.controllerTool = null;
            //
            Event.off(input, <any>inputType.MOUSE_DOWN, this.onMouseDown, this);
            Event.off(input, <any>inputType.MOUSE_UP, this.onMouseUp, this);
            Event.off(this, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
            Event.off(editor3DData.camera.transform, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
        }

        protected get toolModel()
        {
            return this._toolModel;
        }

        protected set toolModel(value)
        {
            if (this._toolModel)
                this.transform.removeChild(this._toolModel.transform);
            this._toolModel = value;;
            if (this._toolModel)
            {
                this.transform.addChild(this._toolModel.transform);
            }
        }

        public get selectedItem()
        {
            return this._selectedItem;
        }

        public set selectedItem(value)
        {
            if (this._selectedItem == value)
                return;
            if (this._selectedItem)
                this._selectedItem.selected = false;
            this._selectedItem = value;
            if (this._selectedItem)
                this._selectedItem.selected = true;
        }

        public get object3DControllerTarget(): Object3DControllerTarget
        {
            return this._object3DControllerTarget;
        }

        public set object3DControllerTarget(value)
        {
            this._object3DControllerTarget = value;
        }

        protected updateToolModel()
        {

        }

        protected onMouseDown()
        {
            this.selectedItem = null;
            this.ismouseDown = true;
        }

        protected onMouseUp()
        {
            this.ismouseDown = false;
            this.movePlane3D = null;
            this.startSceneTransform = null;
        }

        protected onScenetransformChanged()
        {
            this.updateToolModel();
        }

        protected onCameraScenetransformChanged()
        {
            this.updateToolModel();
        }

        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross()
        {
            //射线与平面交点
            var crossPos = this.getMousePlaneCross();
            //把交点从世界转换为模型空间
            var inverseGlobalMatrix3D = this.startSceneTransform.clone();
            inverseGlobalMatrix3D.invert();
            crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
            return crossPos;
        }

        protected getMousePlaneCross()
        {
            var line3D = editor3DData.camera.getMouseRay3D();
            //射线与平面交点
            var crossPos = this.movePlane3D.lineCross(line3D);
            return crossPos;
        }
    }
}