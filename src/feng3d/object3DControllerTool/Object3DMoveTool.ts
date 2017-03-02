module feng3d.editor
{

    export class Object3DMoveTool extends Object3DControllerToolBase
    {
        protected toolModel: Object3DMoveModel;

        private _selectedItem: CoordinateAxis | CoordinatePlane;

        constructor()
        {
            super();

            this.toolModel = new Object3DMoveModel();
            this.toolModel.xAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.yAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.zAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.yzPlane.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.xzPlane.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.xyPlane.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);

            $mouseKeyInput.addEventListener($mouseKeyType.mousedown, this.onMouseDown, this);
        }

        private onMouseDown()
        {
            this.selectedItem = null;
        }

        private onItemMouseDown(event: Event)
        {
            var selected = null;
            switch (event.currentTarget)
            {
                case this.toolModel.xAxis:
                    selected = this.toolModel.xAxis;
                    break;
                case this.toolModel.yAxis:
                    selected = this.toolModel.yAxis;
                    break;
                case this.toolModel.zAxis:
                    selected = this.toolModel.zAxis;
                    break;
                case this.toolModel.yzPlane:
                    selected = this.toolModel.yzPlane;
                    break;
                case this.toolModel.xzPlane:
                    selected = this.toolModel.xzPlane;
                    break;
                case this.toolModel.xyPlane:
                    selected = this.toolModel.xyPlane;
                    break;
            }
            this.selectedItem = selected;
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

        protected set selectedObject3D(value)
        {
            if (this._selectedObject3D == value)
                return;
            super.selectedObject3D = value;
            if (this._selectedObject3D)
            {
                this.updateToolModel();
            }
        }

        protected onScenetransformChanged()
        {
            super.onScenetransformChanged();
            this.updateToolModel();
        }

        protected onCameraScenetransformChanged()
        {
            super.onCameraScenetransformChanged();
            this.updateToolModel();
        }

        private updateToolModel()
        {
            var cameraPos = Editor3DData.instance.camera3D.object3D.transform.globalPosition;
            var localCameraPos = this.toolModel.transform.inverseGlobalMatrix3D.transformVector(cameraPos);

            this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
            this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;

            this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
            this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;

            this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
            this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
        }
    }
}