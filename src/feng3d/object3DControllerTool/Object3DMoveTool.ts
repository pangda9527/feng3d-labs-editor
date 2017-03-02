module feng3d.editor
{

    export class Object3DMoveTool extends Object3DControllerToolBase
    {
        protected toolModel: Object3DMoveModel;

        private _selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ: Vector3D = new Vector3D();
        private startPlanePos: Vector3D;
        private startPos: Vector3D;

        private ismouseDown = false;

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
            this.toolModel.oCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);

            $mouseKeyInput.addEventListener($mouseKeyType.mousedown, this.onMouseDown, this);
            $mouseKeyInput.addEventListener($mouseKeyType.mouseup, this.onMouseUp, this);
        }

        private onMouseDown()
        {
            this.selectedItem = null;
            this.ismouseDown = true;
        }

        private onItemMouseDown(event: Event)
        {
            this.selectedItem = <any>event.currentTarget;
            //全局矩阵
            var globalMatrix3D = this.toolModel.transform.globalMatrix3D;
            this.startSceneTransform = globalMatrix3D.clone();
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix3D.transformVector(new Vector3D(0, 0, 0));
            var px = globalMatrix3D.transformVector(new Vector3D(1, 0, 0));
            var py = globalMatrix3D.transformVector(new Vector3D(0, 1, 0));
            var pz = globalMatrix3D.transformVector(new Vector3D(0, 0, 1));
            //
            var ox = px.subtract(po);
            var oy = py.subtract(po);
            var oz = pz.subtract(po);
            //摄像机前方方向
            var cameraSceneTransform = Editor3DData.instance.camera3D.object3D.transform.globalMatrix3D;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new Plane3D();
            //
            switch (this.selectedItem)
            {
                case this.toolModel.xAxis:
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                    this.changeXYZ.setTo(1, 0, 0);
                    break;
                case this.toolModel.yAxis:
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                    this.changeXYZ.setTo(0, 1, 0);
                    break;
                case this.toolModel.zAxis:
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                    this.changeXYZ.setTo(0, 0, 1);
                    break;
                case this.toolModel.yzPlane:
                    this.movePlane3D.fromPoints(po, py, pz);
                    this.changeXYZ.setTo(0, 1, 1);
                    break;
                case this.toolModel.xzPlane:
                    this.movePlane3D.fromPoints(po, px, pz);
                    this.changeXYZ.setTo(1, 0, 1);
                    break;
                case this.toolModel.xyPlane:
                    this.movePlane3D.fromPoints(po, px, py);
                    this.changeXYZ.setTo(1, 1, 0);
                    break;
                case this.toolModel.oCube:
                    this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                    this.changeXYZ.setTo(1, 1, 1);
                    break;
            }
            //
            this.startPlanePos = this.getLocalMousePlaneCross();
            this.startPos = this.toolModel.transform.position.clone();

            //
            $mouseKeyInput.addEventListener($mouseKeyType.mousemove, this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var crossPos = this.getLocalMousePlaneCross();
            var addPos = crossPos.subtract(this.startPlanePos);
            addPos.x *= this.changeXYZ.x;
            addPos.y *= this.changeXYZ.y;
            addPos.z *= this.changeXYZ.z;
            var sceneTransform = this.startSceneTransform.clone();
            sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
            var sceneAddPos = sceneTransform.position.subtract(this.startSceneTransform.position);
            //
            sceneTransform = this.startSceneTransform.clone();
            sceneTransform.appendTranslation(sceneAddPos.x, sceneAddPos.y, sceneAddPos.z);
            this._selectedObject3D.transform.globalMatrix3D = sceneTransform;
        }

        private onMouseUp()
        {
            $mouseKeyInput.removeEventListener($mouseKeyType.mousemove, this.onMouseMove, this);

            this.ismouseDown = false;
            this.movePlane3D = null;
            this.startPos = null;
            this.startSceneTransform = null;
            this.updateToolModel();
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
            //鼠标按下时不更新
            if (this.ismouseDown)
                return;
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