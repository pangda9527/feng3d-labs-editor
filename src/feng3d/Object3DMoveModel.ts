module feng3d
{
    export class Object3DMoveModel extends Object3D
    {
        public xAxis: Object3D;
        public yAxis: Object3D;
        public zAxis: Object3D;

        public yzPlane: Object3D;
        public xzPlane: Object3D;
        public xyPlane: Object3D;

        public oCube: CubeObject3D;

        constructor()
        {
            super();
            this.name = "Object3DMoveModel";
            this.initModels(100);
        }

        private initModels(length: number)
        {
            this.xAxis = new CoordinateAxis(new Color(1, 0, 0), length);
            this.xAxis.transform.rz = -90;
            this.addChild(this.xAxis);

            this.yAxis = new CoordinateAxis(new Color(0, 1, 0), length);
            this.addChild(this.yAxis);

            this.zAxis = new CoordinateAxis(new Color(0, 0, 1), length);
            this.zAxis.transform.rx = 90;
            this.addChild(this.zAxis);

            this.yzPlane = new CoordinatePlane(new Color(1, 0, 0, 0.2), new Color(1, 0, 0));
            this.yzPlane.transform.rz = 90;
            this.addChild(this.yzPlane);

            this.xzPlane = new CoordinatePlane(new Color(0, 1, 0, 0.2), new Color(0, 1, 0));
            this.addChild(this.xzPlane);

            this.xyPlane = new CoordinatePlane(new Color(0, 0, 1, 0.2), new Color(0, 0, 1));
            this.xyPlane.transform.rx = -90;
            this.addChild(this.xyPlane);

            this.oCube = new CubeObject3D(8);
            this.addChild(this.oCube);
        }
    }

    class CoordinateAxis extends Object3D
    {
        public xLine: SegmentObject3D;
        public xArrow: ConeObject3D;

        constructor(color = new Color(1, 0, 0), length = 100)
        {
            super();
            this.xLine = new SegmentObject3D();
            var segment = new Segment(new Vector3D(), new Vector3D(0, length, 0));
            segment.startColor = segment.endColor = color;
            this.xLine.segmentGeometry.addSegment(segment);
            this.addChild(this.xLine);
            //
            this.xArrow = new ConeObject3D(5, 18);
            this.xArrow.transform.y = length;
            this.xArrow.colorMaterial.color = color;
            this.addChild(this.xArrow);
        }
    }

    class CoordinatePlane extends Object3D
    {
        constructor(color = new Color(1, 0, 0, 0.2), borderColor = new Color(1, 0, 0), width = 20)
        {
            super();
            var plane = new PlaneObject3D(width);
            plane.getOrCreateComponentByClass(MeshRenderer).material = new ColorMaterial(color);
            plane.transform.x = plane.transform.z = width / 2;
            this.addChild(plane);

            var border = new SegmentObject3D();
            var segment = new Segment(new Vector3D(0, 0, 0), new Vector3D(width, 0, 0));
            segment.startColor = segment.endColor = borderColor;
            border.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(width, 0, 0), new Vector3D(width, 0, width));
            segment.startColor = segment.endColor = borderColor;
            border.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(width, 0, width), new Vector3D(0, 0, width));
            segment.startColor = segment.endColor = borderColor;
            border.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(0, 0, width), new Vector3D(0, 0, 0));
            segment.startColor = segment.endColor = borderColor;
            border.segmentGeometry.addSegment(segment);

            this.addChild(border);
        }
    }
}