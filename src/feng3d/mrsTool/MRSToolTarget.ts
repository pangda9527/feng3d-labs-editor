namespace editor
{
    export class MRSToolTarget
    {
        //
        private _controllerTargets: feng3d.Transform[];
        private _startScaleVec: feng3d.Vector3[] = [];
        private _showGameObject: feng3d.Transform;
        private _controllerToolTransfrom: feng3d.Transform = new feng3d.GameObject({ name: "controllerToolTransfrom" }).transform;
        private _controllerTool: feng3d.Transform;
        private _startTransformDic: Map<feng3d.Transform, TransformData>;

        //
        get showGameObject()
        {
            return this._showGameObject;
        }
        set showGameObject(value)
        {
            if (this._showGameObject)
                this._showGameObject.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
            this._showGameObject = value;
            if (this._showGameObject)
                this._showGameObject.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
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

        set controllerTargets(value: feng3d.Transform[])
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
            feng3d.feng3dDispatcher.on("editor.isWoldCoordinateChanged", this.updateControllerImage, this);
            feng3d.feng3dDispatcher.on("editor.isBaryCenterChanged", this.updateControllerImage, this);
        }

        private onShowObjectTransformChanged(event: feng3d.Event<any>)
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

            var transform = this._controllerTargets[this._controllerTargets.length - 1];
            var position = new feng3d.Vector3();
            if (editorData.isBaryCenter)
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
            var rotation = new feng3d.Vector3();
            if (!editorData.isWoldCoordinate)
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
            this._startTransformDic = new Map<feng3d.Transform, TransformData>();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        }

        translation(addPos: feng3d.Vector3)
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
            this._startTransformDic = new Map<feng3d.Transform, TransformData>();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++)
            {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        }

        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: feng3d.Vector3)
        {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var localnormal: feng3d.Vector3;
            var gameobject = objects[0];
            if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
            {
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++)
            {
                gameobject = objects[i];
                var tempTransform = this._startTransformDic.get(gameobject);
                if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
                {
                    gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                } else
                {
                    localnormal = normal.clone();
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (editorData.isBaryCenter)
                    {
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                    } else
                    {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
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
        rotate2(angle1: number, normal1: feng3d.Vector3, angle2: number, normal2: feng3d.Vector3)
        {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var gameobject = objects[0];
            if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
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
                if (!editorData.isWoldCoordinate && editorData.isBaryCenter)
                {
                    tempRotation = this.rotateRotation(tempRotation, normal2, angle2);
                    gameobject.rotation = this.rotateRotation(tempRotation, normal1, angle1);
                } else
                {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (gameobject.parent)
                    {
                        localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (editorData.isBaryCenter)
                    {
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    } else
                    {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = feng3d.Matrix4x4.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;

                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
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

        doScale(scale: feng3d.Vector3)
        {
            feng3d.debuger && feng3d.assert(!!scale.length);
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

        private getTransformData(transform: feng3d.Transform)
        {
            return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
        }

        private rotateRotation(rotation: feng3d.Vector3, axis: feng3d.Vector3, angle)
        {
            var rotationmatrix3d = new feng3d.Matrix4x4();
            rotationmatrix3d.appendRotation(feng3d.Vector3.X_AXIS, rotation.x);
            rotationmatrix3d.appendRotation(feng3d.Vector3.Y_AXIS, rotation.y);
            rotationmatrix3d.appendRotation(feng3d.Vector3.Z_AXIS, rotation.z);
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

    interface TransformData
    {
        position: feng3d.Vector3, rotation: feng3d.Vector3, scale: feng3d.Vector3
    }

}