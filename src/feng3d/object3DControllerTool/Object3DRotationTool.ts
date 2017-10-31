module feng3d.editor
{
    export class Object3DRotationTool extends Object3DControllerToolBase
    {
        protected toolModel: Object3DRotationModel;
        private startPlanePos: Vector3D;
        private stepPlaneCross: Vector3D;
        private startMousePos: Point;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.toolModel = GameObject.create().addComponent(Object3DRotationModel);
        }
        protected onAddedToScene()
        {
            super.onAddedToScene();

            this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();

            this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
        }


        protected onItemMouseDown(event: EventVO<any>)
        {
            if (!engine.mouseinview)
                return;

            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix3D.position;
            var xDir = globalMatrix3D.right;
            var yDir = globalMatrix3D.up;
            var zDir = globalMatrix3D.forward;
            //摄像机前方方向
            var cameraSceneTransform = engine.camera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            var cameraPos = cameraSceneTransform.position;
            this.movePlane3D = new Plane3D();
            var selectedGameObject: GameObject = <any>event.currentTarget;
            switch (selectedGameObject)
            {
                case this.toolModel.xAxis.gameObject:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(xDir, pos);
                    break;
                case this.toolModel.yAxis.gameObject:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(yDir, pos);
                    break;
                case this.toolModel.zAxis.gameObject:
                    this.selectedItem = this.toolModel.zAxis;
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(zDir, pos);
                    break;
                case this.toolModel.freeAxis.gameObject:
                    this.selectedItem = this.toolModel.freeAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
                case this.toolModel.cameraAxis.gameObject:
                    this.selectedItem = this.toolModel.cameraAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
            }
            this.startPlanePos = this.getMousePlaneCross();
            this.stepPlaneCross = this.startPlanePos.clone();
            //
            this.startMousePos = engine.mousePos.clone();
            this.startSceneTransform = globalMatrix3D.clone();
            this.object3DControllerTarget.startRotate();
            //
            input.on("mousemove", this.onMouseMove, this);
        }

        private onMouseMove()
        {
            switch (this.selectedItem)
            {
                case this.toolModel.xAxis:
                case this.toolModel.yAxis:
                case this.toolModel.zAxis:
                case this.toolModel.cameraAxis:
                    var origin = this.startSceneTransform.position;
                    var planeCross = this.getMousePlaneCross();
                    var startDir = this.stepPlaneCross.subtract(origin);
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
                    this.object3DControllerTarget.rotate1(angle, this.movePlane3D.normal);
                    this.stepPlaneCross.copyFrom(planeCross);
                    this.object3DControllerTarget.startRotate();
                    //绘制扇形区域
                    if (this.selectedItem instanceof CoordinateRotationAxis)
                    {
                        this.selectedItem.showSector(this.startPlanePos, planeCross);
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = engine.mousePos.clone();
                    var offset = endPoint.subtract(this.startMousePos);
                    var cameraSceneTransform = engine.camera.transform.localToWorldMatrix;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    this.object3DControllerTarget.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    this.object3DControllerTarget.startRotate();
                    break;
            }
        }

        protected onMouseUp()
        {
            super.onMouseUp();
            input.off("mousemove", this.onMouseMove, this);

            if (this.selectedItem instanceof CoordinateRotationAxis)
            {
                this.selectedItem.hideSector();
            }

            this.object3DControllerTarget.stopRote();
            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }

        protected updateToolModel()
        {
            var cameraSceneTransform = engine.camera.transform.localToWorldMatrix.clone();
            var cameraDir = cameraSceneTransform.forward;
            cameraDir.negate();
            //
            var xyzAxis = [this.toolModel.xAxis, this.toolModel.yAxis, this.toolModel.zAxis];
            for (var i = 0; i < xyzAxis.length; i++)
            {
                var axis = xyzAxis[i];
                axis.filterNormal = cameraDir;
            }
            //朝向摄像机
            var temp = cameraSceneTransform.clone();
            temp.append(this.toolModel.transform.worldToLocalMatrix);
            var rotation = temp.decompose()[1];
            rotation.scaleBy(MathConsts.RADIANS_TO_DEGREES);
            this.toolModel.freeAxis.transform.rotation = rotation;
            this.toolModel.cameraAxis.transform.rotation = rotation;
        }
    }
}