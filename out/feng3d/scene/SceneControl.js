var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var SceneControl = (function () {
            function SceneControl() {
                this.fpsController = editor.editor3DData.camera.gameObject.addComponent(feng3d.FPSController);
                this.fpsController.auto = false;
                //
                feng3d.shortcut.on("lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
                feng3d.shortcut.on("dragSceneStart", this.onDragSceneStart, this);
                feng3d.shortcut.on("dragScene", this.onDragScene, this);
                feng3d.shortcut.on("fpsViewStart", this.onFpsViewStart, this);
                feng3d.shortcut.on("fpsViewStop", this.onFpsViewStop, this);
                feng3d.shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
                feng3d.shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
                feng3d.shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
                //
            }
            SceneControl.prototype.onDragSceneStart = function () {
                this.dragSceneMousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.dragSceneCameraGlobalMatrix3D = editor.editor3DData.camera.transform.localToWorldMatrix.clone();
            };
            SceneControl.prototype.onDragScene = function () {
                var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
                var scale = editor.editor3DData.camera.getScaleByDepth(300);
                var up = this.dragSceneCameraGlobalMatrix3D.up;
                var right = this.dragSceneCameraGlobalMatrix3D.right;
                up.scaleBy(addPoint.y * scale);
                right.scaleBy(-addPoint.x * scale);
                var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
                globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
                editor.editor3DData.camera.transform.localToWorldMatrix = globalMatrix3D;
            };
            SceneControl.prototype.onFpsViewStart = function () {
                this.fpsController.onMousedown();
            };
            SceneControl.prototype.onFpsViewStop = function () {
                this.fpsController.onMouseup();
            };
            SceneControl.prototype.onMouseRotateSceneStart = function () {
                this.rotateSceneMousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.rotateSceneCameraGlobalMatrix3D = editor.editor3DData.camera.transform.localToWorldMatrix.clone();
                this.rotateSceneCenter = null;
                if (editor.editor3DData.selectedObject) {
                    this.rotateSceneCenter = editor.editor3DData.selectedObject.transform.scenePosition;
                }
                else {
                    this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                    this.rotateSceneCenter.scaleBy(config.lookDistance);
                    this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
                }
            };
            SceneControl.prototype.onMouseRotateScene = function () {
                var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
                var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                var view3DRect = editor.editor3DData.view3DRect;
                var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
                var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
                globalMatrix3D.appendRotation(feng3d.Vector3D.Y_AXIS, rotateY, this.rotateSceneCenter);
                var rotateAxisX = globalMatrix3D.right;
                globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
                editor.editor3DData.camera.transform.localToWorldMatrix = globalMatrix3D;
            };
            SceneControl.prototype.onLookToSelectedObject3D = function () {
                var selectedObject3D = editor.editor3DData.selectedObject;
                if (selectedObject3D) {
                    var cameraObject3D = editor.editor3DData.camera;
                    config.lookDistance = config.defaultLookDistance;
                    var lookPos = cameraObject3D.transform.localToWorldMatrix.forward;
                    lookPos.scaleBy(-config.lookDistance);
                    lookPos.incrementBy(selectedObject3D.transform.scenePosition);
                    var localLookPos = lookPos.clone();
                    if (cameraObject3D.transform.parent) {
                        cameraObject3D.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
                    }
                    egret.Tween.get(editor.editor3DData.camera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
                }
            };
            SceneControl.prototype.onMouseWheelMoveSceneCamera = function (event) {
                var inputEvent = event.data;
                var distance = inputEvent.wheelDelta * config.mouseWheelMoveStep;
                editor.editor3DData.camera.transform.localToWorldMatrix = editor.editor3DData.camera.transform.localToWorldMatrix.moveForward(distance);
                config.lookDistance -= distance;
            };
            return SceneControl;
        }());
        editor.SceneControl = SceneControl;
        var SceneControlConfig = (function () {
            function SceneControlConfig() {
                this.mouseWheelMoveStep = 0.4;
                this.defaultLookDistance = 300;
                //dynamic
                this.lookDistance = 300;
            }
            return SceneControlConfig;
        }());
        editor.SceneControlConfig = SceneControlConfig;
        var config = new SceneControlConfig();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=SceneControl.js.map