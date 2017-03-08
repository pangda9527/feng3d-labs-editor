module feng3d.editor
{

    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    export class GroundGrid extends Object3D
    {
        private num = 100;
        private segmentGeometry: SegmentGeometry;

        private level: number;
        private step: number;

        constructor()
        {
            super("GroundGrid");
            this.init();
            editor3DData.scene3D.addChild(this);

            editor3DData.cameraObject3D.addEventListener(TransformEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
        }

        /**
         * 创建地面网格对象
         */
        private init()
        {
            this.getOrCreateComponentByClass(MeshRenderer).material = new SegmentMaterial();
            this.segmentGeometry = new SegmentGeometry();
            var geometry = this.getOrCreateComponentByClass(Geometry);
            geometry.addComponent(this.segmentGeometry);
            this.update();
        }

        private update()
        {
            var cameraGlobalPosition = editor3DData.cameraObject3D.transform.globalPosition;
            this.level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
            this.step = Math.pow(10, this.level - 1);

            var startX: number = Math.round(cameraGlobalPosition.x / (10 * this.step)) * 10 * this.step;
            var startZ: number = Math.round(cameraGlobalPosition.z / (10 * this.step)) * 10 * this.step;

            var halfNum = this.num / 2;

            this.segmentGeometry.removeAllSegments();
            for (var i = -halfNum; i <= halfNum; i++)
            {
                var color = (i % 10) == 0 ? 0x222222 : 0x111111;
                var thickness = (i % 10) == 0 ? 2 : 1;
                this.segmentGeometry.addSegment(new Segment(new Vector3D(-halfNum * this.step + startX, 0, i * this.step + startZ), new Vector3D(halfNum * this.step + startX, 0, i * this.step + startZ), color, color, thickness), false);
                this.segmentGeometry.addSegment(new Segment(new Vector3D(i * this.step + startX, 0, -halfNum * this.step + startZ), new Vector3D(i * this.step + startX, 0, halfNum * this.step + startZ), color, color, thickness), false);
            }
            this.segmentGeometry.updateGeometry();
        }

        private onCameraScenetransformChanged()
        {
            this.update();
        }
    }
}