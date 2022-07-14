namespace feng3d { export interface ComponentMap { STool: editor.STool } }

namespace editor
{
    export interface STool
    {
        get toolModel(): SToolModel;
        set toolModel(v: SToolModel);
    }

    @feng3d.RegisterComponent()
    export class STool extends MRSToolBase
    {
        private startMousePos: feng3d.Vector2;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ = new feng3d.Vector3();
        private startPlanePos: feng3d.Vector3;

        init()
        {
            super.init();
            this.toolModel = new feng3d.GameObject().addComponent(SToolModel);
        }

        protected onAddedToScene()
        {
            super.onAddedToScene();

            this.toolModel.xCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
        }

        protected onRemovedFromScene()
        {
            super.onRemovedFromScene();

            this.toolModel.xCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
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
            var po = globalMatrix.transformPoint3(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix.transformPoint3(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix.transformPoint3(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix.transformPoint3(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.getAxisZ();
            this.movePlane3D = new feng3d.Plane();
            switch (event.currentTarget)
            {
                case this.toolModel.xCube:
                    this.selectedItem = this.toolModel.xCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.set(1, 0, 0);
                    break;
                case this.toolModel.yCube:
                    this.selectedItem = this.toolModel.yCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.set(0, 1, 0);
                    break;
                case this.toolModel.zCube:
                    this.selectedItem = this.toolModel.zCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.set(0, 0, 1);
                    break;
                case this.toolModel.oCube:
                    this.selectedItem = this.toolModel.oCube;
                    this.startMousePos = new feng3d.Vector2(editorui.stage.stageX, editorui.stage.stageY);
                    this.changeXYZ.set(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();

            this.mrsToolTarget.startScale();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        }

        private onMouseMove()
        {
            var addPos = new feng3d.Vector3();
            var addScale = new feng3d.Vector3();
            if (this.selectedItem == this.toolModel.oCube)
            {
                var currentMouse = new feng3d.Vector2(editorui.stage.stageX, editorui.stage.stageY);
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.set(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / editorui.stage.stageHeight;
                addScale.set(scale, scale, scale);
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
            this.mrsToolTarget.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        }

        protected onMouseUp()
        {
            super.onMouseUp()
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);

            this.mrsToolTarget.stopScale();
            this.startPlanePos = null;
            this.startSceneTransform = null;
            //
            this.toolModel.xCube.scaleValue = 1;
            this.toolModel.yCube.scaleValue = 1;
            this.toolModel.zCube.scaleValue = 1;
        }
    }
}