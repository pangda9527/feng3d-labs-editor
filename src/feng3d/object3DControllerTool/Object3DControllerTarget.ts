module feng3d.editor
{
    export class Object3DControllerTarget
    {
        private static _instance: Object3DControllerTarget;
        static get instance()
        {
            return this._instance || (this._instance = new Object3DControllerTarget());
        }

        //
        private _controllerTargets: Transform[];
        private _startScaleVec: Vector3D[] = [];
        private _isWoldCoordinate = false;
        private _isBaryCenter = false;
        private _showObject3D: Transform;
        private _controllerToolTransfrom: Transform = GameObject.create("controllerToolTransfrom").transform;
        private _controllerTool: Transform;
        private _startTransformDic: Map<Transform, { position: Vector3D, rotation: Vector3D, scale: Vector3D }>;

        //
        get showObject3D()
        {
            return this._showObject3D;
        }
        set showObject3D(value)
        {
            if (this._showObject3D)
                this._showObject3D.gameObject.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
            this._showObject3D = value;
            if (this._showObject3D)
                this._showObject3D.gameObject.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
        }

        get controllerTool()
        {
            return this._controllerTool;
        }

        set controllerTool(value)
        {
            this._controllerTool = value;
            if (this._controllerTool)
            {
                this._controllerTool.position = this._controllerToolTransfrom.position;
                this._controllerTool.rotation = this._controllerToolTransfrom.rotation;
            }
        }

        set controllerTargets(value: Transform[])
        {
            if (this._controllerTargets && this._controllerTargets.length > 0)
            {
                this.showObject3D = null;
            }
            this._controllerTargets = value;
            if (this._controllerTargets && this._controllerTargets.length > 0)
            {
                this.showObject3D = this._controllerTargets[0];
                this.updateControllerImage();
            }
        }

        private constructor() { }

        private onShowObjectTransformChanged(event: EventVO<any>)
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                if (this._controllerTargets[i] != this._showObject3D)
                {
                    this._controllerTargets[i].position = this._showObject3D.position;
                    this._controllerTargets[i].rotation = this._showObject3D.rotation;
                    this._controllerTargets[i].scale = this._showObject3D.scale;
                }
            }
            this.updateControllerImage();
        }

        private updateControllerImage()
        {
            var object3D = this._controllerTargets[0];
            var position = new Vector3D();
            if (this._isBaryCenter)
            {
                position.copyFrom(object3D.scenePosition);
            } else
            {
                for (var i = 0; i < this._controllerTargets.length; i++)
                {
                    position.incrementBy(this._controllerTargets[i].scenePosition);
                }
                position.scaleBy(1 / this._controllerTargets.length);
            }
            var rotation = new Vector3D();
            if (this._isWoldCoordinate)
            {
                rotation = this._showObject3D.rotation;
            }
            this._controllerToolTransfrom.position = position;
            this._controllerToolTransfrom.rotation = rotation;
            if (this._controllerTool)
            {
                this._controllerTool.position = position;
                this._controllerTool.rotation = rotation;
            }
        }

        /**
         * 开始移动
         */
        startTranslation()
        {
            this._startTransformDic = new Map<Transform, { position: Vector3D, rotation: Vector3D, scale: Vector3D }>();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var object3d = objects[i];
                this._startTransformDic.push(object3d, { position: object3d.position, rotation: object3d.rotation, scale: object3d.scale });
            }
        }

        translation(addPos: Vector3D)
        {
            if (!this._controllerTargets)
                return;
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var object3d = objects[i];
                var transform = this._startTransformDic.get(object3d);
                var localMove = addPos.clone();
                if (object3d.parent)
                    localMove = object3d.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                object3d.position = transform.position.add(localMove);
            }
        }

        stopTranslation()
        {
            this._startTransformDic = null;
        }

        startRotate()
        {
            this._startTransformDic = new Map<Transform, { position: Vector3D, rotation: Vector3D, scale: Vector3D }>();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var object3d = objects[i];
                this._startTransformDic.push(object3d, { position: object3d.position, rotation: object3d.rotation, scale: object3d.scale });
            }
        }

        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: Vector3D)
        {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var localnormal: Vector3D;
            var object3d = objects[0];
            if (!this._isWoldCoordinate && this._isBaryCenter)
            {
                if (object3d.parent)
                    localnormal = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++)
            {
                object3d = objects[i];
                var tempTransform = this._startTransformDic.get(object3d);
                if (!this._isWoldCoordinate && this._isBaryCenter)
                {
                    object3d.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                } else
                {
                    localnormal = normal.clone();
                    if (object3d.parent)
                        localnormal = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (this._isBaryCenter)
                    {
                        object3d.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                    } else
                    {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (object3d.parent)
                            localPivotPoint = object3d.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        object3d.position = Matrix3D.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                        object3d.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                }
            }
        }

        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1: number, normal1: Vector3D, angle2: number, normal2: Vector3D)
        {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var object3d = objects[0];
            if (!this._isWoldCoordinate && this._isBaryCenter)
            {
                if (object3d.parent)
                {
                    normal1 = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                    normal2 = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                }
            }
            for (var i = 0; i < objects.length; i++)
            {
                object3d = objects[i];
                var tempsceneTransform = this._startTransformDic.get(object3d);
                var tempPosition = tempsceneTransform.position.clone();
                var tempRotation = tempsceneTransform.rotation.clone();
                if (!this._isWoldCoordinate && this._isBaryCenter)
                {
                    tempRotation = rotateRotation(tempRotation, normal2, angle2);
                    object3d.rotation = rotateRotation(tempRotation, normal1, angle1);
                } else
                {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (object3d.parent)
                    {
                        localnormal1 = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (this._isBaryCenter)
                    {
                        tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                        object3d.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                    } else
                    {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (object3d.parent)
                            localPivotPoint = object3d.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        object3d.position = Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;

                        tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                        object3d.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                    }
                }
            }
        }

        stopRote()
        {
            this._startTransformDic = null;
        }

        startScale()
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                this._startScaleVec[i] = this._controllerTargets[i].scale;
            }
        }

        doScale(scale: Vector3D)
        {
            debuger && console.assert(!!scale.length);
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                var result = this._startScaleVec[i].multiply(scale);
                this._controllerTargets[i].sx = result.x;
                this._controllerTargets[i].sy = result.y;
                this._controllerTargets[i].sz = result.z;
            }
        }

        stopScale()
        {
            this._startScaleVec.length = 0;
        }
    }

    function rotateRotation(rotation: Vector3D, axis: Vector3D, angle)
    {
        var rotationmatrix3d = new Matrix3D();
        rotationmatrix3d.appendRotation(Vector3D.X_AXIS, rotation.x);
        rotationmatrix3d.appendRotation(Vector3D.Y_AXIS, rotation.y);
        rotationmatrix3d.appendRotation(Vector3D.Z_AXIS, rotation.z);
        rotationmatrix3d.appendRotation(axis, angle);
        var newrotation = rotationmatrix3d.decompose()[1];
        newrotation.scaleBy(180 / Math.PI);
        var v = Math.round((newrotation.x - rotation.x) / 180);
        if (v % 2 != 0)
        {
            newrotation.x += 180;
            newrotation.y = 180 - newrotation.y;
            newrotation.z += 180;
        }

        function toround(a: number, b: number, c: number = 360)
        {
            return Math.round((b - a) / c) * c + a;
        }

        newrotation.x = toround(newrotation.x, rotation.x);
        newrotation.y = toround(newrotation.y, rotation.y);
        newrotation.z = toround(newrotation.z, rotation.z);
        return newrotation;
    }
}