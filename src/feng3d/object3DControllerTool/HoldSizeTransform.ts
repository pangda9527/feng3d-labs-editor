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
            this._matrix3DDirty = false;
            //
            var depthScale = this.getDepthScale();
            this._matrix3D.rawData.set(value.rawData);
            var vecs = this._matrix3D.decompose();
            this._x = vecs[0].x;
            this._y = vecs[0].y;
            this._z = vecs[0].z;
            this._rx = vecs[1].x * MathConsts.RADIANS_TO_DEGREES;
            this._ry = vecs[1].y * MathConsts.RADIANS_TO_DEGREES;
            this._rz = vecs[1].z * MathConsts.RADIANS_TO_DEGREES;
            this._sx = vecs[2].x / depthScale;
            this._sy = vecs[2].y / depthScale;
            this._sz = vecs[2].z / depthScale;

            this.notifyMatrix3DChanged();
            this.invalidateGlobalMatrix3D();
        }

        /**
         * 变换矩阵
         */
        protected updateMatrix3D()
        {
            var depthScale = this.getDepthScale();
            //
            this._matrix3D.recompose([//
                new Vector3D(this.x, this.y, this.z),//
                new Vector3D(this.rx * MathConsts.DEGREES_TO_RADIANS, this.ry * MathConsts.DEGREES_TO_RADIANS, this.rz * MathConsts.DEGREES_TO_RADIANS),//
                new Vector3D(this.sx * depthScale, this.sy * depthScale, this.sz * depthScale),//
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