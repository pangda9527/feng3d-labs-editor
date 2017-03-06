module feng3d.editor
{
    export class SceneControl
    {
        private dragSceneMousePoint: Point;
        private dragSceneCameraGlobalMatrix3D: Matrix3D;

        private controller: FPSController;

        constructor()
        {
            this.controller = new FPSController();

            shortcut.addEventListener("lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
            shortcut.addEventListener("dragSceneStart", this.onDragSceneStart, this);
            shortcut.addEventListener("dragScene", this.onDragScene, this);
            shortcut.addEventListener("fpsViewStart", this.onFpsViewStart, this);
            shortcut.addEventListener("fpsViewStop", this.onFpsViewStop, this);
            shortcut.addEventListener("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            shortcut.addEventListener("mouseRotateScene", this.onMouseRotateScene, this);
            //
            $ticker.addEventListener(Event.ENTER_FRAME, this.process, this);
            //
        }
        process(event: Event)
        {
            this.controller.update();
        }

        private onDragSceneStart()
        {
            this.dragSceneMousePoint = new Point(input.clientX, input.clientY);
            this.dragSceneCameraGlobalMatrix3D = editor3DData.camera3D.globalMatrix3D.clone();
        }

        private onDragScene()
        {
            var mousePoint = new Point(input.clientX, input.clientY);
            var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
            var scale = editor3DData.view3D.getScaleByDepth(300);
            var up = this.dragSceneCameraGlobalMatrix3D.up;
            var right = this.dragSceneCameraGlobalMatrix3D.right;
            up.scaleBy(addPoint.y * scale);
            right.scaleBy(-addPoint.x * scale);
            var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            editor3DData.camera3D.object3D.transform.globalMatrix3D = globalMatrix3D;
        }

        private onFpsViewStart()
        {
            this.controller.target = editor3DData.cameraObject3D.transform;
        }

        private onFpsViewStop()
        {
            this.controller.target = null;
        }

        private rotateSceneCenter: Vector3D;
        private rotateSceneCameraGlobalMatrix3D: Matrix3D;
        private rotateSceneMousePoint: Point;
        private onMouseRotateSceneStart()
        {
            this.rotateSceneMousePoint = new Point(input.clientX, input.clientY);
            this.rotateSceneCameraGlobalMatrix3D = editor3DData.camera3D.globalMatrix3D.clone();
            this.rotateSceneCenter = null;
            if (editor3DData.selectedObject3D)
            {
                this.rotateSceneCenter = editor3DData.selectedObject3D.transform.globalPosition;
            } else
            {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scaleBy(300);
                this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        }

        private onMouseRotateScene()
        {
            var camera3D = editor3DData.camera3D;
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new Point(input.clientX, input.clientY);
            var view3DRect = editor3DData.view3DRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(rotateY, Vector3D.Y_AXIS, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateX, rotateAxisX, this.rotateSceneCenter);
            camera3D.object3D.transform.globalMatrix3D = globalMatrix3D;
        }

        private onLookToSelectedObject3D()
        {
            var selectedObject3D = editor3DData.selectedObject3D;
            if (selectedObject3D)
            {
                var lookPos = editor3DData.camera3D.globalMatrix3D.forward;
                lookPos.scaleBy(-300);
                lookPos.incrementBy(selectedObject3D.transform.globalPosition);
                egret.Tween.get(editor3DData.camera3D.object3D.transform).to({ x: lookPos.x, y: lookPos.y, z: lookPos.z }, 300, egret.Ease.sineIn);
            }
        }
    }
    export var sceneControl = new SceneControl();
}