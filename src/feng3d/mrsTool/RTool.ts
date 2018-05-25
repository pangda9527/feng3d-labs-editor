namespace editor
{
    export class RTool extends MRSToolBase
    {
        protected toolModel: RToolModel;
        private startPlanePos: feng3d.Vector3;
        private stepPlaneCross: feng3d.Vector3;
        private startMousePos: feng3d.Vector2;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.toolModel = feng3d.GameObject.create().addComponent(RToolModel);
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


        protected onItemMouseDown(event: feng3d.Event<any>)
        {
            if (!engine.mouseinview)
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix3D.position;
            var xDir = globalMatrix3D.right;
            var yDir = globalMatrix3D.up;
            var zDir = globalMatrix3D.forward;
            //摄像机前方方向
            var cameraSceneTransform = editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            var cameraPos = cameraSceneTransform.position;
            this.movePlane3D = new feng3d.Plane3D();
            var selectedGameObject: feng3d.GameObject = <any>event.currentTarget;
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
            this.gameobjectControllerTarget.startRotate();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
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
                    var startDir = this.stepPlaneCross.subTo(origin);
                    startDir.normalize();
                    var endDir = planeCross.subTo(origin);
                    endDir.normalize();
                    //计算夹角
                    var cosValue = startDir.dot(endDir);
                    var angle = Math.acos(cosValue) * feng3d.FMath.RAD2DEG;
                    //计算是否顺时针
                    var sign = this.movePlane3D.getNormal().cross(startDir).dot(endDir);
                    sign = sign > 0 ? 1 : -1;
                    angle = angle * sign;
                    //
                    this.gameobjectControllerTarget.rotate1(angle, this.movePlane3D.getNormal());
                    this.stepPlaneCross.copy(planeCross);
                    this.gameobjectControllerTarget.startRotate();
                    //绘制扇形区域
                    if (this.selectedItem instanceof CoordinateRotationAxis)
                    {
                        this.selectedItem.showSector(this.startPlanePos, planeCross);
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = engine.mousePos.clone();
                    var offset = endPoint.subTo(this.startMousePos);
                    var cameraSceneTransform = editorCamera.transform.localToWorldMatrix;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    this.gameobjectControllerTarget.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    this.gameobjectControllerTarget.startRotate();
                    break;
            }
        }

        protected onMouseUp()
        {
            super.onMouseUp();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);

            if (this.selectedItem instanceof CoordinateRotationAxis)
            {
                this.selectedItem.hideSector();
            }

            this.gameobjectControllerTarget.stopRote();
            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }

        protected updateToolModel()
        {
            var cameraSceneTransform = editorCamera.transform.localToWorldMatrix.clone();
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
            rotation.scale(feng3d.FMath.RAD2DEG);
            this.toolModel.freeAxis.transform.rotation = rotation;
            this.toolModel.cameraAxis.transform.rotation = rotation;
        }
    }
}