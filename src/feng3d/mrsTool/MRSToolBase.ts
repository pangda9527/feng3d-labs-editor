namespace editor
{
    export class MRSToolBase extends feng3d.Component
    {
        private _selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateScaleCube | CoordinateRotationAxis | CoordinateRotationFreeAxis;
        //
        private _toolModel: feng3d.Component;

        protected ismouseDown = false;

        //平移平面，该平面处于场景空间，用于计算位移量
        protected movePlane3D: feng3d.Plane;
        protected startSceneTransform: feng3d.Matrix4x4;

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.invalidate(); }
        private _editorCamera: feng3d.Camera;

        mrsToolTarget: MRSToolTarget;

        init()
        {
            super.init();
            var holdSizeComponent = this.gameObject.addComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.holdSize = 0.005;
            //
            this.on("addedToScene", this.onAddedToScene, this);
            this.on("removedFromScene", this.onRemovedFromScene, this);
        }

        protected onAddedToScene()
        {
            this.mrsToolTarget.controllerTool = this.transform;
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);

            feng3d.ticker.onframe(this.updateToolModel, this);
        }

        protected onRemovedFromScene()
        {
            this.mrsToolTarget.controllerTool = null;
            //
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);

            feng3d.ticker.offframe(this.updateToolModel, this);
        }

        private invalidate()
        {
            feng3d.ticker.nextframe(this.update, this);
        }

        private update()
        {
            var holdSizeComponent = this.gameObject.getComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.camera = this._editorCamera;
        }

        protected onItemMouseDown(event: feng3d.Event<any>)
        {
            feng3d.shortcut.activityState("inTransforming");
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

            feng3d.ticker.nextframe(() =>
            {
                feng3d.shortcut.deactivityState("inTransforming");
            });
        }

        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross()
        {
            //射线与平面交点
            var crossPos = this.getMousePlaneCross();
            //把交点从世界转换为模型空间
            var inverseGlobalMatrix = this.startSceneTransform.clone();
            inverseGlobalMatrix.invert();
            crossPos = inverseGlobalMatrix.transformVector(crossPos);
            return crossPos;
        }

        protected getMousePlaneCross()
        {
            var line3D = this.gameObject.scene.mouseRay3D;
            //射线与平面交点
            var crossPos = <feng3d.Vector3>this.movePlane3D.intersectWithLine3D(line3D);
            return crossPos;
        }
    }
}