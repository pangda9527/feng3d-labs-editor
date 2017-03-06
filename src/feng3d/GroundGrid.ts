module feng3d.editor
{

    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    export class GroundGrid extends Object3D
    {
        constructor()
        {
            super("GroundGrid");
            this.init();
            editor3DData.scene3D.addChild(this);
        }

        /**
         * 创建地面网格对象
         */
        private init()
        {
            this.getOrCreateComponentByClass(MeshRenderer).material = new SegmentMaterial();
            var segmentGeometry = new SegmentGeometry();
            var geometry = this.getOrCreateComponentByClass(Geometry);
            geometry.addComponent(segmentGeometry);

            var step = 10;
            var num = 100;
            var halfNum = num / 2;
            var thickness = 1;

            segmentGeometry.removeAllSegments();
            for (var i = -halfNum; i <= halfNum; i++)
            {
                var color = (i % 10) != 0 ? 0xFF757575 : 0x88757575;
                segmentGeometry.addSegment(new Segment(new Vector3D(-halfNum * step, 0, i * step), new Vector3D(halfNum * step, 0, i * step), color, color), false);
                segmentGeometry.addSegment(new Segment(new Vector3D(i * step, 0, -halfNum * step), new Vector3D(i * step, 0, halfNum * step), color, color), false);
            }
            segmentGeometry.updateGeometry();
        }
    }
}