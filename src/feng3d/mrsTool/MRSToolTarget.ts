namespace feng3d.editor
{
    export class MRSToolTarget
    {
        //
        private _controllerTargets: Transform[];
        private _startScaleVec: Vector3[] = [];
        private _showGameObject: Transform;
        private _controllerToolTransfrom: Transform = GameObject.create("controllerToolTransfrom").transform;
        private _controllerTool: Transform;
        private _startTransformDic: Map<Transform, TransformData>;

        //
        get showGameObject()
        {
            return this._showGameObject;
        }
        set showGameObject(value)
        {
            if (this._showGameObject)
                this._showGameObject.gameObject.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
            this._showGameObject = value;
            if (this._showGameObject)
                this._showGameObject.gameObject.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
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
                this.showGameObject = null;
            }
            this._controllerTargets = value;
            if (this._controllerTargets && this._controllerTargets.length > 0)
            {
                this.showGameObject = this._controllerTargets[0];
                this.updateControllerImage();
            }
        }

        constructor()
        {
            watcher.watch(mrsTool, "isWoldCoordinate", this.updateControllerImage, this);
            watcher.watch(mrsTool, "isBaryCenter", this.updateControllerImage, this);
        }

        private onShowObjectTransformChanged(event: Event<any>)
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                if (this._controllerTargets[i] != this._showGameObject)
                {
                    this._controllerTargets[i].position = this._showGameObject.position;
                    this._controllerTargets[i].rotation = this._showGameObject.rotation;
                    this._controllerTargets[i].scale = this._showGameObject.scale;
                }
            }
            this.updateControllerImage();
        }

        private updateControllerImage()
        {
            if (!this._controllerTargets || this._controllerTargets.length == 0)
                return;

            var transform = this._controllerTargets[0];
            var position = new Vector3();
            if (mrsTool.isBaryCenter)
            {
                position.copy(transform.scenePosition);
            } else
            {
                for (var i = 0; i < this._controllerTargets.length; i++)
                {
                    position.add(this._controllerTargets[i].scenePosition);
                }
                position.scale(1 / this._controllerTargets.length);
            }
            var rotation = new Vector3();
            if (!mrsTool.isWoldCoordinate)
            {
                rotation = this._showGameObject.rotation;
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
            this._startTransformDic = new Map<Transform, TransformData>();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var transform = objects[i];
                this._startTransformDic.set(transform, getTransformData(transform));
            }
        }

        translation(addPos: Vector3)
        {
            if (!this._controllerTargets)
                return;
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var gameobject = objects[i];
                var transform = this._startTransformDic.get(gameobject);
                var localMove = addPos.clone();
                if (gameobject.parent)
                    localMove = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                gameobject.position = transform.position.addTo(localMove);
            }
        }

        stopTranslation()
        {
            this._startTransformDic = null;
        }

        startRotate()
        {
            this._startTransformDic = new Map<Transform, TransformData>();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var transform = objects[i];
                this._startTransformDic.set(transform, getTransformData(transform));
            }
        }

        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: Vector3)
        {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var localnormal: Vector3;
            var gameobject = objects[0];
            if (!mrsTool.isWoldCoordinate && mrsTool.isBaryCenter)
            {
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++)
            {
                gameobject = objects[i];
                var tempTransform = this._startTransformDic.get(gameobject);
                if (!mrsTool.isWoldCoordinate && mrsTool.isBaryCenter)
                {
                    gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                } else
                {
                    localnormal = normal.clone();
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (mrsTool.isBaryCenter)
                    {
                        gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                    } else
                    {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        gameobject.position = Matrix4x4.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                        gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
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
        rotate2(angle1: number, normal1: Vector3, angle2: number, normal2: Vector3)
        {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var gameobject = objects[0];
            if (!mrsTool.isWoldCoordinate && mrsTool.isBaryCenter)
            {
                if (gameobject.parent)
                {
                    normal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                    normal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                }
            }
            for (var i = 0; i < objects.length; i++)
            {
                gameobject = objects[i];
                var tempsceneTransform = this._startTransformDic.get(gameobject);
                var tempPosition = tempsceneTransform.position.clone();
                var tempRotation = tempsceneTransform.rotation.clone();
                if (!mrsTool.isWoldCoordinate && mrsTool.isBaryCenter)
                {
                    tempRotation = rotateRotation(tempRotation, normal2, angle2);
                    gameobject.rotation = rotateRotation(tempRotation, normal1, angle1);
                } else
                {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (gameobject.parent)
                    {
                        localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (mrsTool.isBaryCenter)
                    {
                        tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                    } else
                    {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = Matrix4x4.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        gameobject.position = Matrix4x4.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;

                        tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = rotateRotation(tempRotation, localnormal2, angle2);
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
                this._startScaleVec[i] = this._controllerTargets[i].scale.clone();
            }
        }

        doScale(scale: Vector3)
        {
            debuger && assert(!!scale.length);
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                var result = this._startScaleVec[i].multiplyTo(scale);
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

    interface TransformData
    {
        position: Vector3, rotation: Vector3, scale: Vector3
    }

    function getTransformData(transform: Transform)
    {
        return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
    }

    function rotateRotation(rotation: Vector3, axis: Vector3, angle)
    {
        var rotationmatrix3d = new Matrix4x4();
        rotationmatrix3d.appendRotation(Vector3.X_AXIS, rotation.x);
        rotationmatrix3d.appendRotation(Vector3.Y_AXIS, rotation.y);
        rotationmatrix3d.appendRotation(Vector3.Z_AXIS, rotation.z);
        rotationmatrix3d.appendRotation(axis, angle);
        var newrotation = rotationmatrix3d.decompose()[1];
        newrotation.scale(180 / Math.PI);
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