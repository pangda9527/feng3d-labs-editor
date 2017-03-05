module feng3d.editor
{
    export class Object3DScaleTool extends Object3DControllerToolBase
    {
        protected toolModel: Object3DScaleModel;
        private startMousePos: Point;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ: Vector3D = new Vector3D();
        private startPlanePos: Vector3D;
        /**
         * 初始缩放
         */
        private startScale: Vector3D;
        /**
         * 增加的缩放值
         */
        private addScale: Vector3D = new Vector3D();

        constructor()
        {
            super();
            this.toolModel = new Object3DScaleModel();
            this.toolModel.addScale = this.addScale;

            this.toolModel.xCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.yCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.zCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.oCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
        }

        protected onItemMouseDown(event: Event)
        {
            super.onItemMouseDown(event);
            //全局矩阵
            var globalMatrix3D = this._selectedObject3D.transform.globalMatrix3D;
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
            var cameraSceneTransform = editor3DData.camera3D.object3D.transform.globalMatrix3D;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new Plane3D();
            switch (this.selectedItem)
            {
                case this.toolModel.xCube:
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                    this.changeXYZ.setTo(1, 0, 0);
                    break;
                case this.toolModel.yCube:
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                    this.changeXYZ.setTo(0, 1, 0);
                    break;
                case this.toolModel.zCube:
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                    this.changeXYZ.setTo(0, 0, 1);
                    break;
                case this.toolModel.oCube:
                    this.startMousePos = editor3DData.mouseInView3D.clone();
                    this.changeXYZ.setTo(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            this.startScale = this.selectedObject3D.transform.scale.clone();

            //
            input.addEventListener(inputType.MOUSE_MOVE, this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var addPos = new Vector3D();
            if (this.selectedItem == this.toolModel.oCube)
            {
                var currentMouse = editor3DData.mouseInView3D;
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.setTo(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / (editor3DData.view3DRect.height);
                this.addScale.setTo(scale, scale, scale);
            } else
            {
                var crossPos = this.getLocalMousePlaneCross();
                addPos.x = (crossPos.x - this.startPlanePos.x) * this.changeXYZ.x;
                addPos.y = (crossPos.y - this.startPlanePos.y) * this.changeXYZ.y;
                addPos.z = (crossPos.z - this.startPlanePos.z) * this.changeXYZ.z;
                this.addScale.setTo(1 + addPos.x / this.startPlanePos.x, 1 + addPos.y / this.startPlanePos.y, 1 + addPos.z / this.startPlanePos.z);
            }
            if (this.changeXYZ.x)
                this._selectedObject3D.transform.sx = this.startScale.x * this.addScale.x;
            if (this.changeXYZ.y)
                this._selectedObject3D.transform.sy = this.startScale.y * this.addScale.y;
            if (this.changeXYZ.z)
                this._selectedObject3D.transform.sz = this.startScale.z * this.addScale.z;
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            input.removeEventListener(inputType.MOUSE_MOVE, this.onMouseMove, this);

            this.startPlanePos = null;
            this.startSceneTransform = null;
            this.startScale = null;
            this.addScale.setTo(1, 1, 1);
        }
    }
}