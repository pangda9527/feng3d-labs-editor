namespace editor
{
    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    export class GroundGrid extends feng3d.Component
    {
        @feng3d.oav()
        private num = 100;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            var groundGridObject = feng3d.GameObject.create("GroundGrid");
            groundGridObject.mouseEnabled = false;
            groundGridObject.transform.showInInspector = false;

            gameObject.addChild(groundGridObject);

            var __this = this;

            editorCamera.transform.on("transformChanged", update, this);

            var model = groundGridObject.addComponent(feng3d.Model);
            var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            var material = model.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
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

                var xcolor = new feng3d.Color4(1, 0, 0, 0.5);
                var zcolor = new feng3d.Color4(0, 0, 1, 0.5);
                var color: feng3d.Color4;
                var segments: feng3d.Segment[] = [];
                for (var i = -halfNum; i <= halfNum; i++)
                {
                    var color0 = new feng3d.Color4().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                    color0.a = ((i % 10) == 0) ? 0.5 : 0.1;
                    color = (i * step + startZ == 0) ? xcolor : color0;
                    segments.push({ start: new feng3d.Vector3(-halfNum * step + startX, 0, i * step + startZ), end: new feng3d.Vector3(halfNum * step + startX, 0, i * step + startZ), startColor: color, endColor: color });
                    color = (i * step + startX == 0) ? zcolor : color0;
                    segments.push({ start: new feng3d.Vector3(i * step + startX, 0, -halfNum * step + startZ), end: new feng3d.Vector3(i * step + startX, 0, halfNum * step + startZ), startColor: color, endColor: color });
                }
                segmentGeometry.segments = segments;
            }
        }
    }
}