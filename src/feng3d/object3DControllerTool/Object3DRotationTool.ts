module feng3d.editor
{
    export class Object3DRotationTool extends Object3DControllerToolBase
    {
        protected toolModel: Object3DRotationModel;
        private startPlanePos: Vector3D;
        private startMousePos: Point;

        constructor(gameObject: GameObject)
        {
            super(gameObject);

            this.object3DControllerToolBingding = new Object3DRotationBinding(this.transform);

            this.toolModel = GameObject.create().addComponent(Object3DRotationModel);
        }
        protected onAddedToScene()
        {
            super.onAddedToScene();

            Event.on(this.toolModel.xAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.on(this.toolModel.yAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.on(this.toolModel.zAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.on(this.toolModel.freeAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.on(this.toolModel.cameraAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();

            Event.off(this.toolModel.xAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.off(this.toolModel.yAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.off(this.toolModel.zAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.off(this.toolModel.freeAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            Event.off(this.toolModel.cameraAxis, <any>Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
        }


        protected onItemMouseDown(event: EventVO<any>)
        {
            super.onItemMouseDown(event);

            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix3D.position;
            var xDir = globalMatrix3D.right;
            var yDir = globalMatrix3D.up;
            var zDir = globalMatrix3D.forward;
            //摄像机前方方向
            var cameraSceneTransform = editor3DData.cameraObject3D.transform.localToWorldMatrix;
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
            this.bindingObject3D.startRotate();
            //
            Event.on(input, <any>inputType.MOUSE_MOVE, this.onMouseMove, this);
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
                    this.bindingObject3D.rotate1(angle, this.movePlane3D.normal);
                    //绘制扇形区域
                    if (this.selectedItem instanceof CoordinateRotationAxis)
                    {
                        this.selectedItem.showSector(this.startPlanePos, planeCross);
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = editor3DData.mouseInView3D.clone();
                    var offset = endPoint.subtract(this.startMousePos);
                    var cameraSceneTransform = editor3DData.cameraObject3D.transform.localToWorldMatrix;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    this.bindingObject3D.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    this.bindingObject3D.startRotate();
                    break;
            }
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            Event.off(input, <any>inputType.MOUSE_MOVE, this.onMouseMove, this);

            if (this.selectedItem instanceof CoordinateRotationAxis)
            {
                this.selectedItem.hideSector();
            }

            this.bindingObject3D.stopRote();
            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }

        protected updateToolModel()
        {
            var cameraSceneTransform = editor3DData.cameraObject3D.transform.localToWorldMatrix.clone();
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
            this.toolModel.freeAxis.transform.setRotation(rotation.x, rotation.y, rotation.z);
            this.toolModel.cameraAxis.transform.setRotation(rotation.x, rotation.y, rotation.z);
        }
    }
}