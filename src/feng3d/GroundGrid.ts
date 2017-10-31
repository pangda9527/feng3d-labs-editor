module feng3d.editor
{
    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    export class GroundGrid extends Component
    {
        private num = 100;
        private segmentGeometry: SegmentGeometry;

        private level: number;
        private step: number;
        private groundGridObject: GameObject;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.gameObject.mouseEnabled = false;

            // engine.cameraObject3D.addEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);

            var meshRenderer = this.gameObject.addComponent(MeshRenderer);
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            var material = meshRenderer.material = new SegmentMaterial();
            material.enableBlend = true;
            this.update();
        }

        private update()
        {
            var cameraGlobalPosition = engine.camera.transform.scenePosition;
            this.level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
            this.step = Math.pow(10, this.level - 1);

            var startX: number = Math.round(cameraGlobalPosition.x / (10 * this.step)) * 10 * this.step;
            var startZ: number = Math.round(cameraGlobalPosition.z / (10 * this.step)) * 10 * this.step;

            //设置在原点
            startX = startZ = 0;
            this.step = 100;

            var halfNum = this.num / 2;

            this.segmentGeometry.removeAllSegments();
            for (var i = -halfNum; i <= halfNum; i++)
            {
                var color = new Color().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                color.a = ((i % 10) == 0) ? 0.5 : 0.1;
                this.segmentGeometry.addSegment(new Segment(new Vector3D(-halfNum * this.step + startX, 0, i * this.step + startZ), new Vector3D(halfNum * this.step + startX, 0, i * this.step + startZ), color, color));
                this.segmentGeometry.addSegment(new Segment(new Vector3D(i * this.step + startX, 0, -halfNum * this.step + startZ), new Vector3D(i * this.step + startX, 0, halfNum * this.step + startZ), color, color));
            }
        }

        // private onCameraScenetransformChanged()
        // {
        //     this.update();
        // }
    }
}