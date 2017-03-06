module feng3d.editor
{
    export class HoldSizeTransform extends Transform
    {
        public holdSize = 1;

        constructor()
        {
            super();
            editor3DData.cameraObject3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            Binding.bindHandler(this, ["holdSize"], this.invalidateMatrix3D, this);
        }

        private onCameraScenetransformChanged()
        {
            this.invalidateMatrix3D();
        }

        /**
         * 变换矩阵
         */
        public get matrix3d(): Matrix3D
        {
            return super.matrix3d;
        }

        public set matrix3d(value: Matrix3D)
        {
            var vecs = value.decompose();
            vecs[1].scaleBy(MathConsts.RADIANS_TO_DEGREES);
            var depthScale = this.getDepthScale();
            vecs[1].scaleBy(1 / depthScale);

            this._position.copyFrom(vecs[0]);
            this._rotation.copyFrom(vecs[1]);
            this._scale.copyFrom(vecs[2]);
        }

        /**
         * 变换矩阵
         */
        protected updateMatrix3D()
        {
            var rotation = this._rotation.clone();
            rotation.scaleBy(MathConsts.DEGREES_TO_RADIANS);
            var scale = this._scale.clone();
            var depthScale = this.getDepthScale();
            scale.scaleBy(depthScale);
            this._matrix3D.recompose([//
                this._position,//
                rotation,//
                scale,//
            ]);
            this._matrix3DDirty = false;
        }

        private getDepthScale()
        {
            var cameraTranform = editor3DData.cameraObject3D.transform;
            var distance = this.globalPosition.subtract(cameraTranform.globalPosition);
            var depth = distance.dotProduct(cameraTranform.globalMatrix3D.forward);
            var scale = editor3DData.view3D.getScaleByDepth(depth);
            return scale;
        }
    }
}