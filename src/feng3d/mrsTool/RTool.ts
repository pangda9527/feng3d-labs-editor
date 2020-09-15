namespace feng3d { export interface ComponentMap { RTool: editor.RTool } }

namespace editor
{
    @feng3d.RegisterComponent()
    export class RTool extends MRSToolBase
    {
        protected toolModel: RToolModel;
        private startPlanePos: feng3d.Vector3;
        private stepPlaneCross: feng3d.Vector3;
        private startMousePos: feng3d.Vector2;

        init()
        {
            super.init();
            this.toolModel = new feng3d.GameObject().addComponent(RToolModel);
        }
        protected onAddedToScene()
        {
            super.onAddedToScene();

            this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.on("mousedown", this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();

            this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.off("mousedown", this.onItemMouseDown, this);
        }

        protected onItemMouseDown(event: feng3d.Event<any>)
        {
            if (!feng3d.shortcut.getState("mouseInView3D")) return;
            if (feng3d.shortcut.keyState.getKeyState("alt")) return;
            if (!this.editorCamera) return;

            super.onItemMouseDown(event);
            //全局矩阵
            var globalMatrix = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix.getPosition();
            var xDir = globalMatrix.right;
            var yDir = globalMatrix.up;
            var zDir = globalMatrix.forward;
            //摄像机前方方向
            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            var cameraPos = cameraSceneTransform.getPosition();
            this.movePlane3D = new feng3d.Plane();
            switch (event.currentTarget)
            {
                case this.toolModel.xAxis:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(xDir, pos);
                    break;
                case this.toolModel.yAxis:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(yDir, pos);
                    break;
                case this.toolModel.zAxis:
                    this.selectedItem = this.toolModel.zAxis;
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(zDir, pos);
                    break;
                case this.toolModel.freeAxis:
                    this.selectedItem = this.toolModel.freeAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
                case this.toolModel.cameraAxis:
                    this.selectedItem = this.toolModel.cameraAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
            }
            this.startPlanePos = this.getMousePlaneCross();
            this.stepPlaneCross = this.startPlanePos.clone();
            //
            this.startMousePos = new feng3d.Vector2(editorui.stage.stageX, editorui.stage.stageY);
            this.startSceneTransform = globalMatrix.clone();
            this.mrsToolTarget.startRotate();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }

        private onMouseMove()
        {
            if (!this.editorCamera) return;

            switch (this.selectedItem)
            {
                case this.toolModel.xAxis:
                case this.toolModel.yAxis:
                case this.toolModel.zAxis:
                case this.toolModel.cameraAxis:
                    var origin = this.startSceneTransform.getPosition();
                    var planeCross = this.getMousePlaneCross();
                    var startDir = this.stepPlaneCross.subTo(origin);
                    startDir.normalize();
                    var endDir = planeCross.subTo(origin);
                    endDir.normalize();
                    //计算夹角
                    var cosValue = startDir.dot(endDir);
                    cosValue = Math.clamp(cosValue, -1, 1);
                    var angle = Math.acos(cosValue) * Math.RAD2DEG;
                    //计算是否顺时针
                    var sign = this.movePlane3D.getNormal().cross(startDir).dot(endDir);
                    sign = sign > 0 ? 1 : -1;
                    angle = angle * sign;
                    //
                    this.mrsToolTarget.rotate1(angle, this.movePlane3D.getNormal());
                    this.stepPlaneCross.copy(planeCross);
                    this.mrsToolTarget.startRotate();
                    //绘制扇形区域
                    if (this.selectedItem instanceof CoordinateRotationAxis)
                    {
                        this.selectedItem.showSector(this.startPlanePos, planeCross);
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = new feng3d.Vector2(editorui.stage.stageX, editorui.stage.stageY);
                    var offset = endPoint.subTo(this.startMousePos);
                    var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    this.mrsToolTarget.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    this.mrsToolTarget.startRotate();
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

            this.mrsToolTarget.stopRote();
            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        }

        protected updateToolModel()
        {
            if (!this.editorCamera) return;

            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix.clone();
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
            this.toolModel.freeAxis.transform.rotation = rotation;
            this.toolModel.cameraAxis.transform.rotation = rotation;
        }
    }
}