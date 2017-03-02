module feng3d.editor
{
    export class Object3DMoveModel extends Object3D
    {
        public xAxis: CoordinateAxis;
        public yAxis: CoordinateAxis;
        public zAxis: CoordinateAxis;

        public yzPlane: CoordinatePlane;
        public xzPlane: CoordinatePlane;
        public xyPlane: CoordinatePlane;

        public oCube: CoordinateCube;

        constructor()
        {
            super();
            this.name = "Object3DMoveModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = new CoordinateAxis();
            this.xAxis.color = new Color(1, 0, 0);
            this.xAxis.transform.rz = -90;
            this.addChild(this.xAxis);

            this.yAxis = new CoordinateAxis();
            this.yAxis.color = new Color(0, 1, 0);
            this.addChild(this.yAxis);

            this.zAxis = new CoordinateAxis();
            this.zAxis.color = new Color(0, 0, 1);
            this.zAxis.transform.rx = 90;
            this.addChild(this.zAxis);

            this.yzPlane = new CoordinatePlane();
            this.yzPlane.color = new Color(1, 0, 0, 0.2);
            this.yzPlane.selectedColor = new Color(1, 0, 0, 0.5);
            this.yzPlane.borderColor = new Color(1, 0, 0);
            this.yzPlane.transform.rz = 90;
            this.addChild(this.yzPlane);

            this.xzPlane = new CoordinatePlane();
            this.xzPlane.color = new Color(0, 1, 0, 0.2);
            this.xzPlane.selectedColor = new Color(0, 1, 0, 0.5);
            this.xzPlane.borderColor = new Color(0, 1, 0);
            this.addChild(this.xzPlane);

            this.xyPlane = new CoordinatePlane();
            this.xyPlane.color = new Color(0, 0, 1, 0.2);
            this.xyPlane.selectedColor = new Color(0, 0, 1, 0.5);
            this.xyPlane.borderColor = new Color(0, 0, 1);
            this.xyPlane.transform.rx = -90;
            this.addChild(this.xyPlane);

            this.oCube = new CoordinateCube();
            this.addChild(this.oCube);
        }
    }

    export class CoordinateAxis extends Object3D
    {
        public xLine: SegmentObject3D;
        public xArrow: ConeObject3D;

        public color: Color = new Color(1, 0, 0);
        public selectedColor: Color = new Color(1, 1, 0);
        public length: number = 100;

        public selected = false;

        constructor()
        {
            super();
            this.xLine = new SegmentObject3D();
            this.addChild(this.xLine);
            //
            this.xArrow = new ConeObject3D(5, 18);
            this.addChild(this.xArrow);
            this.update();

            //
            Binding.bindHandler(this, ["color"], this.update, this);
            Binding.bindHandler(this, ["selectedColor"], this.update, this);
            Binding.bindHandler(this, ["length"], this.update, this);
            Binding.bindHandler(this, ["selected"], this.update, this);
        }

        private update()
        {
            this.xLine.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this.length, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
            this.xLine.segmentGeometry.addSegment(segment);
            //
            this.xArrow.transform.y = this.length;
            this.xArrow.colorMaterial.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinateCube extends Object3D
    {
        public colorMaterial: ColorMaterial;
        public oCube: CubeObject3D;

        public color = new Color(1, 1, 1);
        public selectedColor = new Color(1, 1, 0);
        public selected = false;

        constructor()
        {
            super();
            this.oCube = new CubeObject3D(8);
            this.colorMaterial = new ColorMaterial();
            this.oCube.getOrCreateComponentByClass(MeshRenderer).material = this.colorMaterial;
            this.addChild(this.oCube);

            this.update();

            //
            Binding.bindHandler(this, ["color"], this.update, this);
            Binding.bindHandler(this, ["selectedColor"], this.update, this);
            Binding.bindHandler(this, ["selected"], this.update, this);
        }

        private update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends Object3D
    {
        public colorMaterial: ColorMaterial;
        public border: SegmentObject3D;

        public color = new Color(1, 0, 0, 0.2);
        public borderColor = new Color(1, 0, 0);
        public width = 20

        public selectedColor = new Color(1, 0, 0, 0.5);
        public selectedborderColor = new Color(1, 1, 0);
        public selected = false;

        constructor()
        {
            super();
            var plane = new PlaneObject3D(this.width);
            plane.transform.x = plane.transform.z = this.width / 2;
            this.colorMaterial = new ColorMaterial();
            plane.getOrCreateComponentByClass(MeshRenderer).material = this.colorMaterial;
            this.addChild(plane);

            this.border = new SegmentObject3D();
            this.addChild(this.border);

            this.update();

            //
            Binding.bindHandler(this, ["color"], this.update, this);
            Binding.bindHandler(this, ["selectedColor"], this.update, this);
            Binding.bindHandler(this, ["borderColor"], this.update, this);
            Binding.bindHandler(this, ["selectedborderColor"], this.update, this);
            Binding.bindHandler(this, ["selected"], this.update, this);
        }

        private update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;

            var border = this.border;
            var segment = new Segment(new Vector3D(0, 0, 0), new Vector3D(this.width, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(this.width, 0, 0), new Vector3D(this.width, 0, this.width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(this.width, 0, this.width), new Vector3D(0, 0, this.width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(0, 0, this.width), new Vector3D(0, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment);
        }
    }
}