namespace feng3d.editor
{
    /**
     * 位移工具
     */
    export class MTool extends MRSToolBase
    {
        protected toolModel: MToolModel;

        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ: Vector3 = new Vector3();
        private startPlanePos: Vector3;
        private startPos: Vector3;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            this.toolModel = GameObject.create().addComponent(MToolModel);
        }

        protected onAddedToScene()
        {
            super.onAddedToScene();
            this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.xzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.xyPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();
            this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.xzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.xyPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
        }

        protected onItemMouseDown(event: Event<any>)
        {
            if (!engine.mouseinview)
                return;
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix3D.transformVector(new Vector3(0, 0, 0));
            var px = globalMatrix3D.transformVector(new Vector3(1, 0, 0));
            var py = globalMatrix3D.transformVector(new Vector3(0, 1, 0));
            var pz = globalMatrix3D.transformVector(new Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new Plane3D();
            var selectedGameObject: GameObject = <any>event.currentTarget;
            //
            switch (selectedGameObject)
            {
                case this.toolModel.xAxis.gameObject:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.init(1, 0, 0);
                    break;
                case this.toolModel.yAxis.gameObject:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.init(0, 1, 0);
                    break;
                case this.toolModel.zAxis.gameObject:
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.init(0, 0, 1);
                    break;
                case this.toolModel.yzPlane.gameObject:
                    this.selectedItem = this.toolModel.yzPlane;
                    this.movePlane3D.fromPoints(po, py, pz);
                    this.changeXYZ.init(0, 1, 1);
                    break;
                case this.toolModel.xzPlane.gameObject:
                    this.selectedItem = this.toolModel.xzPlane;
                    this.movePlane3D.fromPoints(po, px, pz);
                    this.changeXYZ.init(1, 0, 1);
                    break;
                case this.toolModel.xyPlane.gameObject:
                    this.selectedItem = this.toolModel.xyPlane;
                    this.movePlane3D.fromPoints(po, px, py);
                    this.changeXYZ.init(1, 1, 0);
                    break;
                case this.toolModel.oCube.gameObject:
                    this.selectedItem = this.toolModel.oCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                    this.changeXYZ.init(1, 1, 1);
                    break;
            }
            //
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            this.startPos = this.toolModel.transform.position;
            this.gameobjectControllerTarget.startTranslation();
            //
            windowEventProxy.on("mousemove", this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var crossPos = this.getLocalMousePlaneCross();
            var addPos = crossPos.subTo(this.startPlanePos);
            addPos.x *= this.changeXYZ.x;
            addPos.y *= this.changeXYZ.y;
            addPos.z *= this.changeXYZ.z;
            var sceneTransform = this.startSceneTransform.clone();
            sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
            var sceneAddpos = sceneTransform.position.subTo(this.startSceneTransform.position);
            this.gameobjectControllerTarget.translation(sceneAddpos);
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            windowEventProxy.off("mousemove", this.onMouseMove, this);

            this.gameobjectControllerTarget.stopTranslation();
            this.startPos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
            this.updateToolModel();
        }

        protected updateToolModel()
        {
            //鼠标按下时不更新
            if (this.ismouseDown)
                return;
            var cameraPos = editorCamera.transform.scenePosition;
            var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);

            this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
            this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;

            this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
            this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;

            this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
            this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
        }
    }
}