module feng3d.editor
{
    export class Object3DTransformBinding
    {

        protected _source: GameObject;
        protected _target: GameObject;
        protected _sourceChanging = false;
        protected _targetChanging = false;

        constructor(source: GameObject)
        {
            this._source = source;
        }

        public get target()
        {
            return this._target;
        }

        public set target(value)
        {
            if (this._target == value)
            {
                return;
            }
            if (this._target)
            {
                this._source.removeEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                this._target.removeEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onTargetTransformChanged, this);
            }
            this._target = value;
            if (this._target)
            {
                this._source.addEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                this._target.addEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onTargetTransformChanged, this);
                this.doTargetTransformChanged();
            }
        }

        private onSourceTransformChanged()
        {
            if (this._sourceChanging)
                return;
            this._sourceChanging = true;
            this.doSourceTransformChanged();
            this._sourceChanging = false;
        }

        private onTargetTransformChanged()
        {
            if (this._targetChanging)
                return;
            this._targetChanging = true;
            this.doTargetTransformChanged();
            this._targetChanging = false;
        }

        protected doSourceTransformChanged()
        {
            this._target.transform = this._source.transform;
        }

        protected doTargetTransformChanged()
        {
            this._source.transform = this._target.transform;
        }
    }

    export class Object3DSceneTransformBinding extends Object3DTransformBinding
    {
        protected doSourceTransformChanged()
        {
            this._target.sceneTransform = this._source.sceneTransform;
        }

        protected doTargetTransformChanged()
        {
            this._source.sceneTransform = this._target.sceneTransform;
        }
    }

    export class Object3DControllerToolBinding extends Object3DSceneTransformBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.sceneTransform.decompose();
            var sourceVec = this._source.sceneTransform.decompose();
            //
            targetVec[0] = sourceVec[0];
            targetVec[1] = sourceVec[1];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.sceneTransform = tempMatrix3D;
        }

        protected doTargetTransformChanged()
        {
            var targetVec = this._target.sceneTransform.decompose();
            var sourceVec = this._source.sceneTransform.decompose();
            //
            sourceVec[0] = targetVec[0];
            sourceVec[1] = targetVec[1];
            //
            tempMatrix3D.recompose(sourceVec);
            this._source.sceneTransform = tempMatrix3D;
        }
    }

    export class Object3DMoveBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.sceneTransform.decompose();
            var sourceVec = this._source.sceneTransform.decompose();
            //
            targetVec[0] = sourceVec[0];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.sceneTransform = tempMatrix3D;
        }
    }

    export class Object3DRotationBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.sceneTransform.decompose();
            var sourceVec = this._source.sceneTransform.decompose();
            //
            targetVec[1] = sourceVec[1];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.sceneTransform = tempMatrix3D;
        }
    }

    export class Object3DScaleBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            //不改变目标
        }
    }

    var tempMatrix3D = new Matrix3D();
}