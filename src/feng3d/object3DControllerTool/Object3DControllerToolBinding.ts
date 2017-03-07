module feng3d.editor
{
    export class Object3DTransformBinding
    {

        protected _source: Object3D;
        protected _target: Object3D;
        protected _sourceChanging = false;
        protected _targetChanging = false;

        constructor(source: Object3D)
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
                this._source.removeEventListener(TransfromEvent.TRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                this._target.removeEventListener(TransfromEvent.TRANSFORM_CHANGED, this.onTargetTransformChanged, this);
            }
            this._target = value;
            if (this._target)
            {
                this._source.addEventListener(TransfromEvent.TRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                this._target.addEventListener(TransfromEvent.TRANSFORM_CHANGED, this.onTargetTransformChanged, this);
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
            this._target.transform.matrix3d = this._source.transform.matrix3d;
        }

        protected doTargetTransformChanged()
        {
            this._source.transform.matrix3d = this._target.transform.matrix3d;
        }
    }

    export class Object3DSceneTransformBinding extends Object3DTransformBinding
    {
        protected doSourceTransformChanged()
        {
            this._target.transform.globalMatrix3D = this._source.transform.globalMatrix3D;
        }

        protected doTargetTransformChanged()
        {
            this._source.transform.globalMatrix3D = this._target.transform.globalMatrix3D;
        }
    }

    export class Object3DControllerToolBinding extends Object3DSceneTransformBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.transform.globalMatrix3D.decompose();
            var sourceVec = this._source.transform.globalMatrix3D.decompose();
            //
            targetVec[0] = sourceVec[0];
            targetVec[1] = sourceVec[1];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.transform.globalMatrix3D = tempMatrix3D;
        }

        protected doTargetTransformChanged()
        {
            var targetVec = this._target.transform.globalMatrix3D.decompose();
            var sourceVec = this._source.transform.globalMatrix3D.decompose();
            //
            sourceVec[0] = targetVec[0];
            sourceVec[1] = targetVec[1];
            //
            tempMatrix3D.recompose(sourceVec);
            this._source.transform.globalMatrix3D = tempMatrix3D;
        }
    }

    export class Object3DMoveBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.transform.globalMatrix3D.decompose();
            var sourceVec = this._source.transform.globalMatrix3D.decompose();
            //
            targetVec[0] = sourceVec[0];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.transform.globalMatrix3D = tempMatrix3D;
        }
    }

    export class Object3DRotationBinding extends Object3DControllerToolBinding
    {
        protected doSourceTransformChanged()
        {
            var targetVec = this._target.transform.globalMatrix3D.decompose();
            var sourceVec = this._source.transform.globalMatrix3D.decompose();
            //
            targetVec[1] = sourceVec[1];
            //
            tempMatrix3D.recompose(targetVec);
            this._target.transform.globalMatrix3D = tempMatrix3D;
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