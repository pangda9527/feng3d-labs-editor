namespace editor
{
    export class STool extends MRSToolBase
    {
        protected toolModel: SToolModel;
        private startMousePos: feng3d.Vector2;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ = new feng3d.Vector3();
        private startPlanePos: feng3d.Vector3;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.toolModel = feng3d.GameObject.create().addComponent(SToolModel);
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

        protected onItemMouseDown(event: feng3d.Event<any>)
        {
            if (!engine.mouseinview)
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix3D.transformVector(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix3D.transformVector(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new feng3d.Plane3D();
            var selectedGameObject: feng3d.GameObject = <any>event.currentTarget;
            switch (selectedGameObject)
            {
                case this.toolModel.xCube.gameObject:
                    this.selectedItem = this.toolModel.xCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.init(1, 0, 0);
                    break;
                case this.toolModel.yCube.gameObject:
                    this.selectedItem = this.toolModel.yCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.init(0, 1, 0);
                    break;
                case this.toolModel.zCube.gameObject:
                    this.selectedItem = this.toolModel.zCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.init(0, 0, 1);
                    break;
                case this.toolModel.oCube.gameObject:
                    this.selectedItem = this.toolModel.oCube;
                    this.startMousePos = engine.mousePos.clone();
                    this.changeXYZ.init(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();

            this.gameobjectControllerTarget.startScale();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var addPos = new feng3d.Vector3();
            var addScale = new feng3d.Vector3();
            if (this.selectedItem == this.toolModel.oCube)
            {
                var currentMouse = engine.mousePos;
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.init(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / (engine.viewRect.height);
                addScale.init(scale, scale, scale);
            } else
            {
                var crossPos = this.getLocalMousePlaneCross();
                var offset = crossPos.subTo(this.startPlanePos);
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
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);

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