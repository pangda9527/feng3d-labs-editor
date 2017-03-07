module feng3d.editor
{
    export class Object3DControllerToolBase extends Object3D
    {
        private _selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateScaleCube | CoordinateRotationAxis | CoordinateRotationFreeAxis;
        //
        private _toolModel: Object3D;

        protected ismouseDown = false;

        //平移平面，该平面处于场景空间，用于计算位移量
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;

        protected object3DControllerToolBingding: Object3DControllerToolBinding;

        constructor()
        {
            super();
        }

        protected get toolModel()
        {
            return this._toolModel;
        }

        protected set toolModel(value)
        {
            if (this._toolModel)
                this.removeChild(this._toolModel);
            this._toolModel = value;;
            if (this._toolModel)
            {
                this._toolModel.transform = new HoldSizeTransform();
                this.addChild(this._toolModel);
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

        public get bindingObject3D(): Object3DControllerTarget
        {
            return <any>this.object3DControllerToolBingding.target;
        }

        public set bindingObject3D(value)
        {
            this.object3DControllerToolBingding.target = value;
            if (value)
            {
                this.updateToolModel();
                input.addEventListener(inputType.MOUSE_DOWN, this.onMouseDown, this);
                input.addEventListener(inputType.MOUSE_UP, this.onMouseUp, this);
                this.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                editor3DData.cameraObject3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            } else
            {
                input.removeEventListener(inputType.MOUSE_DOWN, this.onMouseDown, this);
                input.removeEventListener(inputType.MOUSE_UP, this.onMouseUp, this);
                this.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                editor3DData.cameraObject3D.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
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

        protected onItemMouseDown(event: Event)
        {
            this.selectedItem = <any>event.currentTarget;
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
            var line3D = editor3DData.view3D.getMouseRay3D();
            //射线与平面交点
            var crossPos = this.movePlane3D.lineCross(line3D);
            return crossPos;
        }
    }
}