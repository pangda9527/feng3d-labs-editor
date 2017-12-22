namespace feng3d.editor
{
    export class SceneControl
    {
        private dragSceneMousePoint: Point;
        private dragSceneCameraGlobalMatrix3D: Matrix3D;
        private fpsController: FPSController;

        constructor()
        {
            this.fpsController = engine.camera.gameObject.addComponent(FPSController);
            this.fpsController.auto = false;
            //
            shortcut.on("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
            shortcut.on("dragSceneStart", this.onDragSceneStart, this);
            shortcut.on("dragScene", this.onDragScene, this);
            shortcut.on("fpsViewStart", this.onFpsViewStart, this);
            shortcut.on("fpsViewStop", this.onFpsViewStop, this);
            shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
            shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
            //
            editorDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
        }

        private onEditorCameraRotate(e: Event<Vector3D>)
        {
            var resultRotation = e.data;
            var camera = engine.camera;
            var forward = camera.transform.forwardVector;
            var lookDistance: number;
            if (editorData.selectedGameObjects.length > 0)
            {
                //计算观察距离
                var selectedObj = editorData.selectedGameObjects[0];
                var lookray = selectedObj.transform.scenePosition.subtract(camera.transform.scenePosition);
                lookDistance = Math.max(0, forward.dotProduct(lookray));
            } else
            {
                lookDistance = sceneControlConfig.lookDistance;
            }
            //旋转中心
            var rotateCenter = camera.transform.scenePosition.add(forward.scaleBy(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new Quaternion();
            resultRotation.scaleBy(Math.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * Math.DEG2RAD, camera.transform.ry * Math.DEG2RAD, camera.transform.rz * Math.DEG2RAD)
            var rate = { rate: 0.0 };
            egret.Tween.get(rate, {
                onChange: () =>
                {
                    var cameraQuat = new Quaternion();
                    cameraQuat.slerp(sourceQuat, targetQuat, rate.rate);
                    camera.transform.orientation = cameraQuat;
                    //
                    var translation = camera.transform.forwardVector;
                    translation.negate();
                    translation.scaleBy(lookDistance);
                    camera.transform.position = rotateCenter.add(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        }

        private onDragSceneStart()
        {
            this.dragSceneMousePoint = new Point(windowEventProxy.clientX, windowEventProxy.clientY);
            this.dragSceneCameraGlobalMatrix3D = engine.camera.transform.localToWorldMatrix.clone();
        }

        private onDragScene()
        {
            var mousePoint = new Point(windowEventProxy.clientX, windowEventProxy.clientY);
            var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
            var scale = engine.camera.getScaleByDepth(300);
            var up = this.dragSceneCameraGlobalMatrix3D.up;
            var right = this.dragSceneCameraGlobalMatrix3D.right;
            up.scaleBy(addPoint.y * scale);
            right.scaleBy(-addPoint.x * scale);
            var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            engine.camera.transform.localToWorldMatrix = globalMatrix3D;
        }

        private onFpsViewStart()
        {
            this.fpsController.onMousedown();
        }

        private onFpsViewStop()
        {
            this.fpsController.onMouseup();
        }

        private rotateSceneCenter: Vector3D;
        private rotateSceneCameraGlobalMatrix3D: Matrix3D;
        private rotateSceneMousePoint: Point;
        private onMouseRotateSceneStart()
        {
            this.rotateSceneMousePoint = new Point(windowEventProxy.clientX, windowEventProxy.clientY);
            this.rotateSceneCameraGlobalMatrix3D = engine.camera.transform.localToWorldMatrix.clone();
            this.rotateSceneCenter = null;
            //获取第一个 游戏对象
            var firstObject = editorData.firstSelectedGameObject;
            if (firstObject)
            {
                this.rotateSceneCenter = firstObject.transform.scenePosition;
            } else
            {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scaleBy(sceneControlConfig.lookDistance);
                this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        }

        private onMouseRotateScene()
        {
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new Point(windowEventProxy.clientX, windowEventProxy.clientY);
            var view3DRect = engine.viewRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(Vector3D.Y_AXIS, rotateY, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
            engine.camera.transform.localToWorldMatrix = globalMatrix3D;
        }

        private onLookToSelectedGameObject()
        {
            var selectedGameObject = editorData.firstSelectedGameObject;
            if (selectedGameObject)
            {
                var cameraGameObject = engine.camera;
                sceneControlConfig.lookDistance = sceneControlConfig.defaultLookDistance;
                var lookPos = cameraGameObject.transform.localToWorldMatrix.forward;
                lookPos.scaleBy(-sceneControlConfig.lookDistance);
                lookPos.incrementBy(selectedGameObject.transform.scenePosition);
                var localLookPos = lookPos.clone();
                if (cameraGameObject.transform.parent)
                {
                    cameraGameObject.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
                }
                egret.Tween.get(engine.camera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
            }
        }

        private onMouseWheelMoveSceneCamera()
        {
            var distance = windowEventProxy.wheelDelta * sceneControlConfig.mouseWheelMoveStep;
            engine.camera.transform.localToWorldMatrix = engine.camera.transform.localToWorldMatrix.moveForward(distance);
            sceneControlConfig.lookDistance -= distance;
        }
    }

    export class SceneControlConfig
    {
        mouseWheelMoveStep = 0.4;
        defaultLookDistance = 300;

        //dynamic
        lookDistance = 300;

        sceneCameraForwardBackwardStep = 1;
    }
    export var sceneControlConfig = new SceneControlConfig();
}