namespace feng3d.editor
{
    export class Object3DControllerToolBase extends Component
    {
        private _selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateScaleCube | CoordinateRotationAxis | CoordinateRotationFreeAxis;
        //
        private _toolModel: Component;

        protected ismouseDown = false;

        //平移平面，该平面处于场景空间，用于计算位移量
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;

        protected _object3DControllerTarget: Object3DControllerTarget;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            var holdSizeComponent = this.gameObject.addComponent(HoldSizeComponent);
            holdSizeComponent.holdSize = 1;
            holdSizeComponent.camera = editor3DData.camera;
            //
            this.gameObject.on("addedToScene", this.onAddedToScene, this);
            this.gameObject.on("removedFromScene", this.onRemovedFromScene, this);
        }

        protected onAddedToScene()
        {
            this.updateToolModel();
            this._object3DControllerTarget.controllerTool = this.transform;
            //
            input.on("mousedown", this.onMouseDown, this);
            input.on("mouseup", this.onMouseUp, this);
            this.transform.on("scenetransformChanged", this.onScenetransformChanged, this);
            editor3DData.camera.transform.on("scenetransformChanged", this.onCameraScenetransformChanged, this);
        }

        protected onRemovedFromScene()
        {
            this._object3DControllerTarget.controllerTool = null;
            //
            input.off("mousedown", this.onMouseDown, this);
            input.off("mouseup", this.onMouseUp, this);
            this.transform.off("scenetransformChanged", this.onScenetransformChanged, this);
            editor3DData.camera.transform.off("scenetransformChanged", this.onCameraScenetransformChanged, this);
        }

        protected get toolModel()
        {
            return this._toolModel;
        }

        protected set toolModel(value)
        {
            if (this._toolModel)
                this.gameObject.removeChild(this._toolModel.gameObject);
            this._toolModel = value;;
            if (this._toolModel)
            {
                this.gameObject.addChild(this._toolModel.gameObject);
            }
        }

        get selectedItem()
        {
            return this._selectedItem;
        }

        set selectedItem(value)
        {
            if (this._selectedItem == value)
                return;
            if (this._selectedItem)
                this._selectedItem.selected = false;
            this._selectedItem = value;
            if (this._selectedItem)
                this._selectedItem.selected = true;
        }

        get object3DControllerTarget(): Object3DControllerTarget
        {
            return this._object3DControllerTarget;
        }

        set object3DControllerTarget(value)
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