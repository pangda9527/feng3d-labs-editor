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

        constructor()
        {
            super();
            this.object3DControllerToolBingding = new Object3DScaleBinding(this.transform);

            this.toolModel = new Object3DScaleModel();
        }

        protected onAddedToScene()
        {
            super.onAddedToScene();

            this.toolModel.xCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.yCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.zCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.oCube.addEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();

            this.toolModel.xCube.removeEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.yCube.removeEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.zCube.removeEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            this.toolModel.oCube.removeEventListener(Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
        }

        protected onItemMouseDown(event: Event)
        {
            super.onItemMouseDown(event);
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
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
            var cameraSceneTransform = editor3DData.cameraObject3D.transform.localToWorldMatrix;
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

            this.bindingObject3D.startScale();
            //
            input.addEventListener(inputType.MOUSE_MOVE, this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var addPos = new Vector3D();
            var addScale = new Vector3D();
            if (this.selectedItem == this.toolModel.oCube)
            {
                var currentMouse = editor3DData.mouseInView3D;
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.setTo(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / (editor3DData.view3DRect.height);
                addScale.setTo(scale, scale, scale);
            } else
            {
                var crossPos = this.getLocalMousePlaneCross();
                var offset = crossPos.subtract(this.startPlanePos);
                if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0)
                {
                    addScale.x = offset.x / this.startPlanePos.x;
                }
                if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0)
                {
                    addScale.y = offset.y / this.startPlanePos.y;
                }
                if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0)
                {
                    addScale.z = offset.z / this.startPlanePos.z;
                }
                addScale.x += 1;
                addScale.y += 1;
                addScale.z += 1;
            }
            this.bindingObject3D.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            input.removeEventListener(inputType.MOUSE_MOVE, this.onMouseMove, this);

            this.startPlanePos = null;
            this.startSceneTransform = null;
            //
            this.toolModel.xCube.scaleValue = 1;
            this.toolModel.yCube.scaleValue = 1;
            this.toolModel.zCube.scaleValue = 1;
        }
    }
}