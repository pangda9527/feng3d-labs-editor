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

            Event.on(shortcut, <any>"lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
            Event.on(shortcut, <any>"dragSceneStart", this.onDragSceneStart, this);
            Event.on(shortcut, <any>"dragScene", this.onDragScene, this);
            Event.on(shortcut, <any>"fpsViewStart", this.onFpsViewStart, this);
            Event.on(shortcut, <any>"fpsViewStop", this.onFpsViewStop, this);
            Event.on(shortcut, <any>"mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            Event.on(shortcut, <any>"mouseRotateScene", this.onMouseRotateScene, this);
            Event.on(shortcut, <any>"mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
            //
        }

        private onDragSceneStart()
        {
            this.dragSceneMousePoint = new Point(input.clientX, input.clientY);
            this.dragSceneCameraGlobalMatrix3D = editor3DData.camera.transform.localToWorldMatrix.clone();
        }

        private onDragScene()
        {
            var mousePoint = new Point(input.clientX, input.clientY);
            var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
            var scale = editor3DData.camera.getScaleByDepth(300);
            var up = this.dragSceneCameraGlobalMatrix3D.up;
            var right = this.dragSceneCameraGlobalMatrix3D.right;
            up.scaleBy(addPoint.y * scale);
            right.scaleBy(-addPoint.x * scale);
            var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            editor3DData.camera.transform.localToWorldMatrix = globalMatrix3D;
        }

        private onFpsViewStart()
        {
            this.controller.targetObject = editor3DData.camera.gameObject;
            this.controller["onMousedown"]();
        }

        private onFpsViewStop()
        {
            this.controller.targetObject = null;
            this.controller["onMouseup"]();
        }

        private rotateSceneCenter: Vector3D;
        private rotateSceneCameraGlobalMatrix3D: Matrix3D;
        private rotateSceneMousePoint: Point;
        private onMouseRotateSceneStart()
        {
            this.rotateSceneMousePoint = new Point(input.clientX, input.clientY);
            this.rotateSceneCameraGlobalMatrix3D = editor3DData.camera.transform.localToWorldMatrix.clone();
            this.rotateSceneCenter = null;
            if (editor3DData.selectedObject)
            {
                this.rotateSceneCenter = editor3DData.selectedObject.transform.scenePosition;
            } else
            {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scaleBy(config.lookDistance);
                this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        }

        private onMouseRotateScene()
        {
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new Point(input.clientX, input.clientY);
            var view3DRect = editor3DData.view3DRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(Vector3D.Y_AXIS, rotateY, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
            editor3DData.camera.transform.localToWorldMatrix = globalMatrix3D;
        }

        private onLookToSelectedObject3D()
        {
            var selectedObject3D = editor3DData.selectedObject;
            if (selectedObject3D)
            {
                var cameraObject3D = editor3DData.camera;
                config.lookDistance = config.defaultLookDistance;
                var lookPos = cameraObject3D.transform.localToWorldMatrix.forward;
                lookPos.scaleBy(-config.lookDistance);
                lookPos.incrementBy(selectedObject3D.transform.scenePosition);
                var localLookPos = lookPos.clone();
                if (cameraObject3D.transform.parent)
                {
                    cameraObject3D.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
                }
                egret.Tween.get(editor3DData.camera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
            }
        }

        private onMouseWheelMoveSceneCamera(event: EventVO<any>)
        {
            var inputEvent: InputEvent = event.data;
            var distance = inputEvent.wheelDelta * config.mouseWheelMoveStep;
            editor3DData.camera.transform.localToWorldMatrix = editor3DData.camera.transform.localToWorldMatrix.moveForward(distance);
            config.lookDistance -= distance;
        }
    }

    export class SceneControlConfig
    {
        public mouseWheelMoveStep = 0.4;
        public defaultLookDistance = 300;

        //dynamic
        public lookDistance = 300;
    }
    var config = new SceneControlConfig();
}