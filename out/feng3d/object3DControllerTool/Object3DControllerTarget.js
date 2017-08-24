var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DControllerTarget = (function () {
            function Object3DControllerTarget() {
                this._startScaleVec = [];
                this._isWoldCoordinate = false;
                this._isBaryCenter = false;
                this._controllerToolTransfrom = feng3d.GameObject.create("controllerToolTransfrom").transform;
            }
            Object.defineProperty(Object3DControllerTarget, "instance", {
                get: function () {
                    return this._instance || (this._instance = new Object3DControllerTarget());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerTarget.prototype, "showObject3D", {
                //
                get: function () {
                    return this._showObject3D;
                },
                set: function (value) {
                    if (this._showObject3D)
                        this._showObject3D.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
                    this._showObject3D = value;
                    if (this._showObject3D)
                        this._showObject3D.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerTarget.prototype, "controllerTool", {
                get: function () {
                    return this._controllerTool;
                },
                set: function (value) {
                    this._controllerTool = value;
                    if (this._controllerTool) {
                        this._controllerTool.position = this._controllerToolTransfrom.position;
                        this._controllerTool.rotation = this._controllerToolTransfrom.rotation;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerTarget.prototype, "controllerTargets", {
                set: function (value) {
                    if (this._controllerTargets && this._controllerTargets.length > 0) {
                        this.showObject3D = null;
                    }
                    this._controllerTargets = value;
                    if (this._controllerTargets && this._controllerTargets.length > 0) {
                        this.showObject3D = this._controllerTargets[0];
                        this.updateControllerImage();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object3DControllerTarget.prototype.onShowObjectTransformChanged = function (event) {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    if (this._controllerTargets[i] != this._showObject3D) {
                        this._controllerTargets[i].position = this._showObject3D.position;
                        this._controllerTargets[i].rotation = this._showObject3D.rotation;
                        this._controllerTargets[i].scale = this._showObject3D.scale;
                    }
                }
                this.updateControllerImage();
            };
            Object3DControllerTarget.prototype.updateControllerImage = function () {
                var object3D = this._controllerTargets[0];
                var position = new feng3d.Vector3D();
                if (this._isBaryCenter) {
                    position.copyFrom(object3D.scenePosition);
                }
                else {
                    for (var i = 0; i < this._controllerTargets.length; i++) {
                        position.incrementBy(this._controllerTargets[i].scenePosition);
                    }
                    position.scaleBy(1 / this._controllerTargets.length);
                }
                var rotation = new feng3d.Vector3D();
                if (this._isWoldCoordinate) {
                    rotation = this._showObject3D.rotation;
                }
                this._controllerToolTransfrom.position = position;
                this._controllerToolTransfrom.rotation = rotation;
                if (this._controllerTool) {
                    this._controllerTool.position = position;
                    this._controllerTool.rotation = rotation;
                }
            };
            /**
             * 开始移动
             */
            Object3DControllerTarget.prototype.startTranslation = function () {
                this._startTransformDic = {};
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var object3d = objects[i];
                    this._startTransformDic[object3d.uuid] = { position: object3d.position, rotation: object3d.rotation, scale: object3d.scale };
                }
            };
            Object3DControllerTarget.prototype.translation = function (addPos) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var object3d = objects[i];
                    var transform = this._startTransformDic[object3d.uuid];
                    var localMove = addPos.clone();
                    if (object3d.parent)
                        localMove = object3d.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                    object3d.position = transform.position.add(localMove);
                }
            };
            Object3DControllerTarget.prototype.stopTranslation = function () {
                this._startTransformDic = null;
            };
            Object3DControllerTarget.prototype.startRotate = function () {
                this._startTransformDic = {};
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var object3d = objects[i];
                    this._startTransformDic[object3d.uuid] = { position: object3d.position, rotation: object3d.rotation, scale: object3d.scale };
                }
            };
            /**
             * 绕指定轴旋转
             * @param angle 旋转角度
             * @param normal 旋转轴
             */
            Object3DControllerTarget.prototype.rotate1 = function (angle, normal) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                var localnormal;
                var object3d = objects[0];
                if (!this._isWoldCoordinate && this._isBaryCenter) {
                    if (object3d.parent)
                        localnormal = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal);
                }
                for (var i = 0; i < objects.length; i++) {
                    object3d = objects[i];
                    var tempTransform = this._startTransformDic[object3d.uuid];
                    if (!this._isWoldCoordinate && this._isBaryCenter) {
                        object3d.rotation = feng3d.Matrix3D.fromAxisRotate(localnormal, angle).transformRotation(tempTransform.rotation);
                    }
                    else {
                        localnormal = normal.clone();
                        if (object3d.parent)
                            localnormal = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                        if (this._isBaryCenter) {
                            object3d.rotation = feng3d.Matrix3D.fromAxisRotate(localnormal, angle).transformRotation(tempTransform.rotation);
                        }
                        else {
                            var localPivotPoint = this._controllerToolTransfrom.position;
                            if (object3d.parent)
                                localPivotPoint = object3d.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                            object3d.position = feng3d.Matrix3D.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                            object3d.rotation = feng3d.Matrix3D.fromAxisRotate(localnormal, angle).transformRotation(tempTransform.rotation);
                        }
                    }
                }
            };
            /**
             * 按指定角旋转
             * @param angle1 第一方向旋转角度
             * @param normal1 第一方向旋转轴
             * @param angle2 第二方向旋转角度
             * @param normal2 第二方向旋转轴
             */
            Object3DControllerTarget.prototype.rotate2 = function (angle1, normal1, angle2, normal2) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                var object3d = objects[0];
                if (!this._isWoldCoordinate && this._isBaryCenter) {
                    if (object3d.parent) {
                        normal1 = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                        normal2 = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                    }
                }
                for (var i = 0; i < objects.length; i++) {
                    object3d = objects[i];
                    var tempsceneTransform = this._startTransformDic[object3d.uuid];
                    var tempPosition = tempsceneTransform.position.clone();
                    var tempRotation = tempsceneTransform.rotation.clone();
                    if (!this._isWoldCoordinate && this._isBaryCenter) {
                        tempRotation = feng3d.Matrix3D.fromAxisRotate(normal2, angle2).transformRotation(tempRotation);
                        object3d.rotation = feng3d.Matrix3D.fromAxisRotate(normal1, angle1).transformRotation(tempRotation);
                    }
                    else {
                        var localnormal1 = normal1.clone();
                        var localnormal2 = normal2.clone();
                        if (object3d.parent) {
                            localnormal1 = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                            localnormal2 = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                        }
                        if (this._isBaryCenter) {
                            tempRotation = feng3d.Matrix3D.fromAxisRotate(localnormal1, angle1).transformRotation(tempRotation);
                            object3d.rotation = feng3d.Matrix3D.fromAxisRotate(localnormal2, angle2).transformRotation(tempRotation);
                        }
                        else {
                            var localPivotPoint = this._controllerToolTransfrom.position;
                            if (object3d.parent)
                                localPivotPoint = object3d.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                            //
                            tempPosition = feng3d.Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                            object3d.position = feng3d.Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                            tempRotation = feng3d.Matrix3D.fromAxisRotate(localnormal1, angle1).transformRotation(tempRotation);
                            object3d.rotation = feng3d.Matrix3D.fromAxisRotate(localnormal2, angle2).transformRotation(tempRotation);
                        }
                    }
                }
            };
            Object3DControllerTarget.prototype.stopRote = function () {
                this._startTransformDic = null;
            };
            Object3DControllerTarget.prototype.startScale = function () {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    this._startScaleVec[i] = this._controllerTargets[i].scale;
                }
            };
            Object3DControllerTarget.prototype.doScale = function (scale) {
                feng3d.debuger && console.assert(!!scale.length);
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    var result = this._startScaleVec[i].multiply(scale);
                    this._controllerTargets[i].sx = result.x;
                    this._controllerTargets[i].sy = result.y;
                    this._controllerTargets[i].sz = result.z;
                }
            };
            Object3DControllerTarget.prototype.stopScale = function () {
                this._startScaleVec.length = 0;
            };
            return Object3DControllerTarget;
        }());
        editor.Object3DControllerTarget = Object3DControllerTarget;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DControllerTarget.js.map