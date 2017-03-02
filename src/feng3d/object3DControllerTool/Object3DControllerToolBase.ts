module feng3d.editor
{
    export class Object3DControllerToolBase extends Object3D
    {
        protected _selectedObject3D: Object3D;
        protected toolModel: Object3D;

        //平移平面，该平面处于场景空间，用于计算位移量
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;

        constructor()
        {
            super();

            Binding.bindProperty(Editor3DData.instance, ["selectedObject3D"], this, "selectedObject3D");
        }

        protected get selectedObject3D()
        {
            return this._selectedObject3D;
        }
        protected set selectedObject3D(value)
        {
            if (this._selectedObject3D == value)
                return;
            if (this._selectedObject3D)
            {
                this.removeChild(this.toolModel);
                this._selectedObject3D.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                Editor3DData.instance.camera3D.object3D.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
            this._selectedObject3D = value;
            if (this._selectedObject3D)
            {
                this.addChild(this.toolModel);
                this.toolModel.transform.globalMatrix3D = this._selectedObject3D.transform.globalMatrix3D;
                this._selectedObject3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                Editor3DData.instance.camera3D.object3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
        }

        protected onScenetransformChanged()
        {
            this.toolModel.transform.globalMatrix3D = this._selectedObject3D.transform.globalMatrix3D;
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
            var line3D = Editor3DData.instance.view3D.getMouseRay3D();
            //射线与平面交点
            var crossPos = this.movePlane3D.lineCross(line3D);
            return crossPos;
        }
    }
}