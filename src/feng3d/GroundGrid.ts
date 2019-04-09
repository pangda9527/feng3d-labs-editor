namespace feng3d { export interface ComponentMap { GroundGrid: editor.GroundGrid } }

namespace editor
{
    /**
     * 地面网格
     */
    export class GroundGrid extends feng3d.Component
    {
        @feng3d.oav()
        private num = 100;

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v)
        {
            if (this._editorCamera == v) return;
            if (this._editorCamera)
            {
                this._editorCamera.transform.off("transformChanged", this.update, this);
            }
            this._editorCamera = v;
            if (this._editorCamera)
            {
                this._editorCamera.transform.on("transformChanged", this.update, this);
                this.update();
            }
        }
        private _editorCamera: feng3d.Camera;
        private segmentGeometry: feng3d.SegmentGeometry;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            var groundGridObject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "GroundGrid" });
            groundGridObject.mouseEnabled = false;

            gameObject.addChild(groundGridObject);

            var model = groundGridObject.addComponent(feng3d.Model);
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.renderParams.enableBlend = true;
        }

        update()
        {
            if (!this.editorCamera) return;

            var cameraGlobalPosition = this.editorCamera.transform.scenePosition;
            var level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
            var step = Math.pow(10, level - 1);

            var startX: number = Math.round(cameraGlobalPosition.x / (10 * step)) * 10 * step;
            var startZ: number = Math.round(cameraGlobalPosition.z / (10 * step)) * 10 * step;

            //设置在原点
            startX = startZ = 0;
            step = 1;

            var halfNum = this.num / 2;

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
            this.segmentGeometry.segments = segments;
        }
    }
}