namespace feng3d.editor
{
    export class STool extends MRSToolBase
    {
        protected toolModel: SToolModel;
        private startMousePos: Point;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ: Vector3D = new Vector3D();
        private startPlanePos: Vector3D;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.toolModel = GameObject.create().addComponent(SToolModel);
        }

        protected onAddedToScene()
        {
            super.onAddedToScene();

            this.toolModel.xCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();

            this.toolModel.xCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
        }

        protected onItemMouseDown(event: Event<any>)
        {
            if (!engine.mouseinview)
                return;
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
            var cameraSceneTransform = engine.camera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new Plane3D();
            var selectedGameObject: GameObject = <any>event.currentTarget;
            switch (selectedGameObject)
            {
                case this.toolModel.xCube.gameObject:
                    this.selectedItem = this.toolModel.xCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                    this.changeXYZ.setTo(1, 0, 0);
                    break;
                case this.toolModel.yCube.gameObject:
                    this.selectedItem = this.toolModel.yCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                    this.changeXYZ.setTo(0, 1, 0);
                    break;
                case this.toolModel.zCube.gameObject:
                    this.selectedItem = this.toolModel.zCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                    this.changeXYZ.setTo(0, 0, 1);
                    break;
                case this.toolModel.oCube.gameObject:
                    this.selectedItem = this.toolModel.oCube;
                    this.startMousePos = engine.mousePos.clone();
                    this.changeXYZ.setTo(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();

            this.gameobjectControllerTarget.startScale();
            //
            windowEventProxy.on("mousemove", this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var addPos = new Vector3D();
            var addScale = new Vector3D();
            if (this.selectedItem == this.toolModel.oCube)
            {
                var currentMouse = engine.mousePos;
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.setTo(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / (engine.viewRect.height);
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
            this.gameobjectControllerTarget.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            windowEventProxy.off("mousemove", this.onMouseMove, this);

            this.gameobjectControllerTarget.stopScale();
            this.startPlanePos = null;
            this.startSceneTransform = null;
            //
            this.toolModel.xCube.scaleValue = 1;
            this.toolModel.yCube.scaleValue = 1;
            this.toolModel.zCube.scaleValue = 1;
        }
    }
}