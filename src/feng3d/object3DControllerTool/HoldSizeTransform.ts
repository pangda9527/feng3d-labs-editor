module feng3d.editor
{
    export class HoldSizeTransform extends Transform
    {
        public holdSize = 1;

        constructor()
        {
            super();
            editor3DData.cameraObject3D.addEventListener(TransformEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
        }

        private onCameraScenetransformChanged()
        {
            this.invalidateGlobalMatrix3D();
        }

        /**
         * 更新全局矩阵
         */
        protected updateGlobalMatrix3D()
        {
            super.updateGlobalMatrix3D();
            if (this.holdSize)
            {
                var depthScale = this.getDepthScale();
                var vec = this._globalMatrix3D.decompose();
                vec[2].setTo(depthScale, depthScale, depthScale);
                this._globalMatrix3D.recompose(vec);
            }
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