module feng3d.editor
{
    export class Object3DControllerToolBase extends Object3D
    {
        private _selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateScaleCube | CoordinateRotationAxis;
        //
        protected _selectedObject3D: Object3D;
        private _toolModel: Object3D;

        protected ismouseDown = false;

        //平移平面，该平面处于场景空间，用于计算位移量
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;

        private selectedObject3DWatcher: Watcher;

        constructor()
        {
            super();

            input.addEventListener(inputType.MOUSE_DOWN, this.onMouseDown, this);
            input.addEventListener(inputType.MOUSE_UP, this.onMouseUp, this);
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
                this.addChild(this._toolModel);
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

        public get selectedObject3D()
        {
            return this._selectedObject3D;
        }
        public set selectedObject3D(value)
        {
            if (this._selectedObject3D == value)
                return;
            if (this._selectedObject3D)
            {
                this._selectedObject3D.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                editor3DData.camera3D.object3D.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
            this._selectedObject3D = value;
            if (this._selectedObject3D)
            {
                this.updatePositionRotation();
                this._selectedObject3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                editor3DData.camera3D.object3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
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

        protected updatePositionRotation()
        {
            var vec = this._selectedObject3D.transform.globalMatrix3D.decompose();
            vec[2].setTo(1, 1, 1);
            var mat = new Matrix3D();
            mat.recompose(vec);
            this.toolModel.transform.globalMatrix3D = mat;
        }

        protected onScenetransformChanged()
        {
            this.updatePositionRotation();
        }

        protected onCameraScenetransformChanged()
        {
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