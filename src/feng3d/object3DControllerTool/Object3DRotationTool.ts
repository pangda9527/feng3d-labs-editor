module feng3d.editor
{
    export class Object3DRotationTool extends Object3DControllerToolBase
    {
        protected toolModel: Object3DRotationModel;
        private startPlanePos: Vector3D;
        private startMousePos: Point;

        constructor()
        {
            super();
            this.toolModel = new Object3DRotationModel();

            this.toolModel.xAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.yAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.zAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.freeAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.cameraAxis.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);

        }

        protected onItemMouseDown(event: Event)
        {
            super.onItemMouseDown(event);

            //全局矩阵
            var globalMatrix3D = this._selectedObject3D.transform.globalMatrix3D;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix3D.position;
            var xDir = globalMatrix3D.right;
            var yDir = globalMatrix3D.up;
            var zDir = globalMatrix3D.forward;
            //摄像机前方方向
            var cameraSceneTransform = editor3DData.camera3D.object3D.transform.globalMatrix3D;
            var cameraDir = cameraSceneTransform.forward;
            var cameraPos = cameraSceneTransform.position;
            this.movePlane3D = new Plane3D();
            switch (this.selectedItem)
            {
                case this.toolModel.xAxis:
                    this.movePlane3D.fromNormalAndPoint(xDir, pos);
                    break;
                case this.toolModel.yAxis:
                    this.movePlane3D.fromNormalAndPoint(yDir, pos);
                    break;
                case this.toolModel.zAxis:
                    this.movePlane3D.fromNormalAndPoint(zDir, pos);
                    break;
                case this.toolModel.freeAxis:
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
                case this.toolModel.cameraAxis:
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
            }
            this.startPlanePos = this.getMousePlaneCross();
            this.startMousePos = editor3DData.mouseInView3D.clone();
            this.startSceneTransform = globalMatrix3D.clone();
            //
            input.addEventListener(inputType.MOUSE_MOVE, this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var tempSceneTransform = this.startSceneTransform.clone();
            switch (this.selectedItem)
            {
                case this.toolModel.xAxis:
                case this.toolModel.yAxis:
                case this.toolModel.zAxis:
                case this.toolModel.cameraAxis:
                    var origin = this.startSceneTransform.position;
                    var planeCross = this.getMousePlaneCross();
                    var startDir = this.startPlanePos.subtract(origin);
                    startDir.normalize();
                    var endDir = planeCross.subtract(origin);
                    endDir.normalize();
                    //计算夹角
                    var cosValue = startDir.dotProduct(endDir);
                    var angle = Math.acos(cosValue) * MathConsts.RADIANS_TO_DEGREES;
                    //计算是否顺时针
                    var sign = this.movePlane3D.normal.crossProduct(startDir).dotProduct(endDir);
                    sign = sign > 0 ? 1 : -1;
                    angle = angle * sign;
                    //
                    tempSceneTransform.appendRotation(angle, this.movePlane3D.normal, tempSceneTransform.position);
                    this._selectedObject3D.transform.globalMatrix3D = tempSceneTransform;
                    //绘制扇形区域
                    if (this.selectedItem instanceof CoordinateRotationAxis)
                    {
                        this.selectedItem.startPos = this.startPlanePos;
                        this.selectedItem.endPos = planeCross;
                        this.selectedItem.showSector = true;
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = editor3DData.mouseInView3D.clone();
                    var offset = endPoint.subtract(this.startMousePos);
                    var cameraSceneTransform = editor3DData.camera3D.globalMatrix3D;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    tempSceneTransform.appendRotation(-offset.y, right, tempSceneTransform.position);
                    tempSceneTransform.appendRotation(-offset.x, up, tempSceneTransform.position);
                    this._selectedObject3D.transform.globalMatrix3D = tempSceneTransform;
                    break;
            }
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            input.removeEventListener(inputType.MOUSE_MOVE, this.onMouseMove, this);

            if (this.selectedItem instanceof CoordinateRotationAxis)
            {
                this.selectedItem.showSector = false;
            }

            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }

        public set selectedObject3D(value)
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
            var cameraSceneTransform = editor3DData.camera3D.globalMatrix3D.clone();
            var cameraDir = cameraSceneTransform.forward;
            cameraDir.negate();
            //
            var xyzAxis = [this.toolModel.xAxis, this.toolModel.zAxis, this.toolModel.zAxis];
            for (var i = 0; i < xyzAxis.length; i++)
            {
                var axis = xyzAxis[i];
                axis.filterNormal = cameraDir;
            }
            //朝向摄像机
            var temp = cameraSceneTransform.clone();
            temp.append(this.toolModel.transform.inverseGlobalMatrix3D);
            var rotation = temp.decompose()[1];
            rotation.scaleBy(MathConsts.RADIANS_TO_DEGREES);
            this.toolModel.freeAxis.transform.rotation = rotation;
            this.toolModel.cameraAxis.transform.rotation = rotation;
        }
    }
}