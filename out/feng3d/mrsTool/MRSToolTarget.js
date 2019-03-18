define(["require", "exports", "../../global/EditorData"], function (require, exports, EditorData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MRSToolTarget = /** @class */ (function () {
        function MRSToolTarget() {
            this._startScaleVec = [];
            this._position = new feng3d.Vector3();
            this._rotation = new feng3d.Vector3();
            feng3d.dispatcher.on("editor.isWoldCoordinateChanged", this.updateControllerImage, this);
            feng3d.dispatcher.on("editor.isBaryCenterChanged", this.updateControllerImage, this);
            //
            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
        }
        Object.defineProperty(MRSToolTarget.prototype, "controllerTool", {
            get: function () {
                return this._controllerTool;
            },
            set: function (value) {
                this._controllerTool = value;
                if (this._controllerTool) {
                    this._controllerTool.position = this._position;
                    this._controllerTool.rotation = this._rotation;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MRSToolTarget.prototype, "controllerTargets", {
            set: function (value) {
                this._controllerTargets = value;
                this.updateControllerImage();
            },
            enumerable: true,
            configurable: true
        });
        MRSToolTarget.prototype.onSelectedGameObjectChange = function () {
            //筛选出 工具控制的对象
            var transforms = EditorData_1.editorData.selectedGameObjects.reduce(function (result, item) {
                result.push(item.transform);
                return result;
            }, []);
            if (transforms.length > 0) {
                this.controllerTargets = transforms;
            }
            else {
                this.controllerTargets = null;
            }
        };
        MRSToolTarget.prototype.updateControllerImage = function () {
            if (!this._controllerTargets || this._controllerTargets.length == 0)
                return;
            var transform = this._controllerTargets[this._controllerTargets.length - 1];
            var position = new feng3d.Vector3();
            if (EditorData_1.editorData.isBaryCenter) {
                position.copy(transform.scenePosition);
            }
            else {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    position.add(this._controllerTargets[i].scenePosition);
                }
                position.scaleNumber(1 / this._controllerTargets.length);
            }
            var rotation = new feng3d.Vector3();
            if (!EditorData_1.editorData.isWoldCoordinate) {
                rotation = this._controllerTargets[0].rotation;
            }
            this._position = position;
            this._rotation = rotation;
            if (this._controllerTool) {
                this._controllerTool.position = position;
                this._controllerTool.rotation = rotation;
            }
        };
        /**
         * 开始移动
         */
        MRSToolTarget.prototype.startTranslation = function () {
            this._startTransformDic = new Map();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        };
        MRSToolTarget.prototype.translation = function (addPos) {
            if (!this._controllerTargets)
                return;
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var gameobject = objects[i];
                var transform = this._startTransformDic.get(gameobject);
                var localMove = addPos.clone();
                if (gameobject.parent)
                    localMove = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                gameobject.position = transform.position.addTo(localMove);
            }
        };
        MRSToolTarget.prototype.stopTranslation = function () {
            this._startTransformDic = null;
        };
        MRSToolTarget.prototype.startRotate = function () {
            this._startTransformDic = new Map();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        };
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        MRSToolTarget.prototype.rotate1 = function (angle, normal) {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var localnormal;
            var gameobject = objects[0];
            if (!EditorData_1.editorData.isWoldCoordinate && EditorData_1.editorData.isBaryCenter) {
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempTransform = this._startTransformDic.get(gameobject);
                if (!EditorData_1.editorData.isWoldCoordinate && EditorData_1.editorData.isBaryCenter) {
                    gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                }
                else {
                    localnormal = normal.clone();
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (EditorData_1.editorData.isBaryCenter) {
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                    else {
                        var localPivotPoint = this._position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempTransform.position.x, tempTransform.position.y, tempTransform.position.z).appendRotation(localnormal, angle, localPivotPoint).position;
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
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
        MRSToolTarget.prototype.rotate2 = function (angle1, normal1, angle2, normal2) {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var gameobject = objects[0];
            if (!EditorData_1.editorData.isWoldCoordinate && EditorData_1.editorData.isBaryCenter) {
                if (gameobject.parent) {
                    normal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                    normal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                }
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempsceneTransform = this._startTransformDic.get(gameobject);
                var tempPosition = tempsceneTransform.position.clone();
                var tempRotation = tempsceneTransform.rotation.clone();
                if (!EditorData_1.editorData.isWoldCoordinate && EditorData_1.editorData.isBaryCenter) {
                    tempRotation = this.rotateRotation(tempRotation, normal2, angle2);
                    gameobject.rotation = this.rotateRotation(tempRotation, normal1, angle1);
                }
                else {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (gameobject.parent) {
                        localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (EditorData_1.editorData.isBaryCenter) {
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    }
                    else {
                        var localPivotPoint = this._position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = feng3d.Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    }
                }
            }
        };
        MRSToolTarget.prototype.stopRote = function () {
            this._startTransformDic = null;
        };
        MRSToolTarget.prototype.startScale = function () {
            for (var i = 0; i < this._controllerTargets.length; i++) {
                this._startScaleVec[i] = this._controllerTargets[i].scale.clone();
            }
        };
        MRSToolTarget.prototype.doScale = function (scale) {
            feng3d.debuger && feng3d.assert(!!scale.length);
            for (var i = 0; i < this._controllerTargets.length; i++) {
                var result = this._startScaleVec[i].multiplyTo(scale);
                this._controllerTargets[i].sx = result.x;
                this._controllerTargets[i].sy = result.y;
                this._controllerTargets[i].sz = result.z;
            }
        };
        MRSToolTarget.prototype.stopScale = function () {
            this._startScaleVec.length = 0;
        };
        MRSToolTarget.prototype.getTransformData = function (transform) {
            return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
        };
        MRSToolTarget.prototype.rotateRotation = function (rotation, axis, angle) {
            var rotationmatrix3d = new feng3d.Matrix4x4();
            rotationmatrix3d.appendRotation(feng3d.Vector3.X_AXIS, rotation.x);
            rotationmatrix3d.appendRotation(feng3d.Vector3.Y_AXIS, rotation.y);
            rotationmatrix3d.appendRotation(feng3d.Vector3.Z_AXIS, rotation.z);
            rotationmatrix3d.appendRotation(axis, angle);
            var newrotation = rotationmatrix3d.decompose()[1];
            newrotation.scaleNumber(180 / Math.PI);
            var v = Math.round((newrotation.x - rotation.x) / 180);
            if (v % 2 != 0) {
                newrotation.x += 180;
                newrotation.y = 180 - newrotation.y;
                newrotation.z += 180;
            }
            function toround(a, b, c) {
                if (c === void 0) { c = 360; }
                return Math.round((b - a) / c) * c + a;
            }
            newrotation.x = toround(newrotation.x, rotation.x);
            newrotation.y = toround(newrotation.y, rotation.y);
            newrotation.z = toround(newrotation.z, rotation.z);
            return newrotation;
        };
        return MRSToolTarget;
    }());
    exports.MRSToolTarget = MRSToolTarget;
    exports.mrsToolTarget = new MRSToolTarget();
});
//# sourceMappingURL=MRSToolTarget.js.map