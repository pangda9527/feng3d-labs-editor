module feng3d.editor
{
    export class Object3DTransformBinding
    {

        protected _source: Transform;
        protected _target: Transform;
        protected _sourceChanging = false;
        protected _targetChanging = false;

        constructor(source: Transform)
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
                Event.off(this._source, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                Event.off(this._target, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onTargetTransformChanged, this);
            }
            this._target = value;
            if (this._target)
            {
                Event.on(this._source, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                Event.on(this._target, <any>Object3DEvent.SCENETRANSFORM_CHANGED, this.onTargetTransformChanged, this);
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
            this._target.matrix3d = this._source.matrix3d;
        }

        protected doTargetTransformChanged()
        {
            this._source.matrix3d = this._target.matrix3d;
        }
    }

    export class Object3DSceneTransformBinding extends Object3DTransformBinding
    {
        protected doSourceTransformChanged()
        {
            this._target.localToWorldMatrix = this._source.localToWorldMatrix;
        }

        protected doTargetTransformChanged()
        {
            this._source.localToWorldMatrix = this._target.localToWorldMatrix;
        }
    }

    export class Object3DControllerToolBinding extends Object3DSceneTransformBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.localToWorldMatrix.decompose();
            var sourceVec = this._source.localToWorldMatrix.decompose();
            //
            targetVec[0] = sourceVec[0];
            targetVec[1] = sourceVec[1];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.localToWorldMatrix = tempMatrix3D;
        }

        protected doTargetTransformChanged()
        {
            var targetVec = this._target.localToWorldMatrix.decompose();
            var sourceVec = this._source.localToWorldMatrix.decompose();
            //
            sourceVec[0] = targetVec[0];
            sourceVec[1] = targetVec[1];
            //
            tempMatrix3D.recompose(sourceVec);
            this._source.localToWorldMatrix = tempMatrix3D;
        }
    }

    export class Object3DMoveBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.localToWorldMatrix.decompose();
            var sourceVec = this._source.localToWorldMatrix.decompose();
            //
            targetVec[0] = sourceVec[0];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.localToWorldMatrix = tempMatrix3D;
        }
    }

    export class Object3DRotationBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.localToWorldMatrix.decompose();
            var sourceVec = this._source.localToWorldMatrix.decompose();
            //
            targetVec[1] = sourceVec[1];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.localToWorldMatrix = tempMatrix3D;
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