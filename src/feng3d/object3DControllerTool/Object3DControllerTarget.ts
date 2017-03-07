module feng3d.editor
{

    export class Object3DControllerTarget extends Object3D
    {
        private _controllerTargets: Object3D[];
        private startGlobalMatrixVec: Matrix3D[] = [];
        private startScaleVec: Vector3D[] = [];

        private controllerImage: Object3D = new Object3D();
        private startControllerImageGlobalMatrix3D: Matrix3D;

        private isWoldCoordinate = false;
        private isBaryCenter = false;

        //
        private _showObject3D = new Object3D();
        private controllerBindingShowTarget: Object3DTransformBinding;
        private controllerBinding: Object3DSceneTransformBinding;
        private targetBindings: Object3DTransformBinding[] = [];

        constructor()
        {
            super();
            this.controllerBindingShowTarget = new Object3DTransformBinding(this._showObject3D);
            this.controllerBinding = new Object3DSceneTransformBinding(this);
        }

        public set controllerTargets(value: Object3D[])
        {
            if (this._controllerTargets && this._controllerTargets.length > 0)
            {
                this.controllerBindingShowTarget.target = null;
                this.targetBindings.length = 0;
                if (this.controllerImage.parent)
                {
                    this.controllerImage.parent.removeChild(this.controllerImage);
                }
                this.controllerImage.transform.globalMatrix3D = new Matrix3D();
            }
            this._controllerTargets = value;
            if (this._controllerTargets && this._controllerTargets.length > 0)
            {
                this.controllerBindingShowTarget.target = this._controllerTargets[0];
                this._controllerTargets[0].addChild(this.controllerImage);
                this.updateControllerImage();
                this.controllerBinding.target = this.controllerImage;
            }
        }

        private updateControllerImage()
        {
            var object3D = this._controllerTargets[0];
            var position = new Vector3D();
            if (this.isBaryCenter)
            {
                position.copyFrom(object3D.transform.globalPosition);
            } else
            {
                for (var i = 0; i < this._controllerTargets.length; i++)
                {
                    position.incrementBy(this._controllerTargets[i].transform.globalPosition);
                }
                position.scaleBy(1 / this._controllerTargets.length);
            }
            var vec = object3D.transform.globalMatrix3D.decompose();
            vec[0] = position;
            vec[2].setTo(1, 1, 1);
            if (this.isWoldCoordinate)
            {
                vec[1].setTo(0, 0, 0);
            }
            tempGlobalMatrix.recompose(vec);
            this.controllerImage.transform.globalMatrix3D = tempGlobalMatrix;
        }

        public startTranslation()
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                this.startGlobalMatrixVec[i] = this._controllerTargets[i].transform.globalMatrix3D.clone();
            }
        }

        public translation(addPos: Vector3D)
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[i]);
                tempGlobalMatrix.appendTranslation(addPos.x, addPos.y, addPos.z);
                this._controllerTargets[i].transform.globalMatrix3D = tempGlobalMatrix;
            }
        }

        public stopTranslation()
        {
            this.startGlobalMatrixVec.length = 0;
        }

        public startRotate()
        {
            this.startControllerImageGlobalMatrix3D = this.controllerImage.transform.globalMatrix3D.clone();
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                this.startGlobalMatrixVec[i] = this._controllerTargets[i].transform.globalMatrix3D.clone();
            }
        }

        public rotate(angle: number, normal: Vector3D)
        {
            if (!this.isWoldCoordinate && this.isBaryCenter)
            {
                tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[0]);
                tempGlobalMatrix.invert();
                normal = tempGlobalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[i]);
                if (!this.isWoldCoordinate && this.isBaryCenter)
                {
                    tempGlobalMatrix.prependRotation(angle, normal);
                } else
                {
                    if (this.isBaryCenter)
                    {
                        tempGlobalMatrix.appendRotation(angle, normal, tempGlobalMatrix.position);
                    } else
                    {
                        tempGlobalMatrix.appendRotation(angle, normal, this.startControllerImageGlobalMatrix3D.position);
                    }
                }
                this._controllerTargets[i].transform.globalMatrix3D = tempGlobalMatrix;
            }
        }

        public rotate2(angle: number, normal: Vector3D, angle2: number, normal2: Vector3D)
        {
            if (!this.isWoldCoordinate && this.isBaryCenter)
            {
                tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[0]);
                tempGlobalMatrix.invert();
                normal = tempGlobalMatrix.deltaTransformVector(normal);
                normal2 = tempGlobalMatrix.deltaTransformVector(normal2);
            }
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[i]);
                if (!this.isWoldCoordinate && this.isBaryCenter)
                {
                    tempGlobalMatrix.prependRotation(angle2, normal2);
                    tempGlobalMatrix.prependRotation(angle, normal);
                } else
                {
                    if (this.isBaryCenter)
                    {
                        tempGlobalMatrix.appendRotation(angle, normal, tempGlobalMatrix.position);
                        tempGlobalMatrix.appendRotation(angle2, normal2, tempGlobalMatrix.position);
                    } else
                    {
                        tempGlobalMatrix.appendRotation(angle, normal, this.startControllerImageGlobalMatrix3D.position);
                        tempGlobalMatrix.appendRotation(angle2, normal2, this.startControllerImageGlobalMatrix3D.position);
                    }
                }
                this._controllerTargets[i].transform.globalMatrix3D = tempGlobalMatrix;
            }
        }

        public stopRote()
        {
            this.startGlobalMatrixVec.length = 0;
            this.startControllerImageGlobalMatrix3D = null;
        }

        public startScale()
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                this.startScaleVec[i] = this._controllerTargets[i].transform.scale.clone();
            }
        }

        public doScale(scale: Vector3D)
        {
            for (var i = 0; i < this._controllerTargets.length; i++)
            {
                this._controllerTargets[i].transform.sx = this.startScaleVec[i].x * scale.x;
                this._controllerTargets[i].transform.sy = this.startScaleVec[i].y * scale.y;
                this._controllerTargets[i].transform.sz = this.startScaleVec[i].z * scale.z;
            }
        }

        public stopScale()
        {
            this.startScaleVec.length = 0;
        }
    }
    var tempGlobalMatrix = new Matrix3D();
}