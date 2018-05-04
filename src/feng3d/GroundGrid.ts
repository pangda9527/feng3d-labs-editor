namespace feng3d.editor
{
    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    export class GroundGrid extends Component
    {
        @oav()
        private num = 100;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var groundGridObject = GameObject.create("GroundGrid");
            groundGridObject.mouseEnabled = false;
            groundGridObject.transform.showInInspector = false;

            gameObject.addChild(groundGridObject);

            var __this = this;

            editorCamera.transform.on("transformChanged", update, this);

            var meshRenderer = groundGridObject.addComponent(MeshRenderer);
            var segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            var material = meshRenderer.material = new SegmentMaterial();
            material.renderParams.enableBlend = true;
            update();

            function update()
            {
                var cameraGlobalPosition = editorCamera.transform.scenePosition;
                var level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
                var step = Math.pow(10, level - 1);

                var startX: number = Math.round(cameraGlobalPosition.x / (10 * step)) * 10 * step;
                var startZ: number = Math.round(cameraGlobalPosition.z / (10 * step)) * 10 * step;

                //设置在原点
                startX = startZ = 0;
                step = 1;

                var halfNum = __this.num / 2;

                var xcolor = new Vector4(1, 0, 0, 0.5);
                var zcolor = new Vector4(0, 0, 1, 0.5);
                var color: Vector4;
                segmentGeometry.removeAllSegments();
                for (var i = -halfNum; i <= halfNum; i++)
                {
                    var color0 = new Color().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777).toVector3().toVector4();
                    color0.w = ((i % 10) == 0) ? 0.5 : 0.1;
                    color = (i * step + startZ == 0) ? xcolor : color0;
                    segmentGeometry.addSegment(new Segment(new Vector3(-halfNum * step + startX, 0, i * step + startZ), new Vector3(halfNum * step + startX, 0, i * step + startZ), color, color));
                    color = (i * step + startX == 0) ? zcolor : color0;
                    segmentGeometry.addSegment(new Segment(new Vector3(i * step + startX, 0, -halfNum * step + startZ), new Vector3(i * step + startX, 0, halfNum * step + startZ), color, color));
                }
            }
        }
    }
}