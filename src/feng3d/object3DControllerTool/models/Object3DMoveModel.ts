module feng3d.editor
{
    export class Object3DMoveModel extends Component
    {
        public xAxis: CoordinateAxis;
        public yAxis: CoordinateAxis;
        public zAxis: CoordinateAxis;

        public yzPlane: CoordinatePlane;
        public xzPlane: CoordinatePlane;
        public xyPlane: CoordinatePlane;

        public oCube: CoordinateCube;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.name = "Object3DMoveModel";
            this.initModels();
        }

        private initModels()
        {
            var xAxis = GameObject.create("xAxis");
            this.xAxis = xAxis.addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0);
            xAxis.transform.rotationZ = -90;
            this.transform.addChild(xAxis.transform);

            var yAxis = GameObject.create("yAxis");
            this.yAxis = yAxis.addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.transform.addChild(yAxis.transform);

            var zAxis = GameObject.create("zAxis");
            this.zAxis = zAxis.addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1);
            zAxis.transform.rotationX = 90;
            this.transform.addChild(zAxis.transform);

            var yzPlane = GameObject.create("yzPlane");
            this.yzPlane = yzPlane.addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0);
            yzPlane.transform.rotationZ = 90;
            this.transform.addChild(this.yzPlane.transform);

            this.xzPlane = GameObject.create("xzPlane").addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0);
            this.transform.addChild(this.xzPlane.transform);

            this.xyPlane = GameObject.create("xyPlane").addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1);
            this.xyPlane.transform.rotationX = -90;
            this.transform.addChild(this.xyPlane.transform);

            this.oCube = GameObject.create("oCube").addComponent(CoordinateCube);
            this.transform.addChild(this.oCube.transform);
        }
    }

    export class CoordinateAxis extends Component
    {
        private segmentMaterial: SegmentMaterial;
        private material: ColorMaterial;

        private xArrow: GameObject;

        public readonly color = new Color(1, 0, 0)
        private selectedColor: Color = new Color(1, 1, 0);
        private length: number = 100;

        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);

            var xLine = GameObject.create();
            var segmentGeometry = xLine.addComponent(MeshFilter).mesh = new SegmentGeometry();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this.length, 0));
            segmentGeometry.addSegment(segment);
            this.segmentMaterial = xLine.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.transform.addChild(xLine.transform);
            //
            this.xArrow = GameObject.create();
            this.xArrow.addComponent(MeshFilter).mesh = new ConeGeometry(5, 18);
            this.material = this.xArrow.addComponent(MeshRenderer).material = new ColorMaterial();
            this.xArrow.transform.y = this.length;
            this.transform.addChild(this.xArrow.transform);

            this.update();

            var mouseHit = GameObject.create("hit");
            mouseHit.addComponent(MeshFilter).mesh = new CylinderGeometry(5, 5, this.length - 20);
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.transform.visible = false;
            mouseHit.transform.mouseEnabled = true;
            this.transform.addChild(mouseHit.transform);
        }

        private update()
        {
            this.segmentMaterial.color.copyFrom(this.selected ? this.selectedColor : this.color);
            //
            this.material.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinateCube extends Component
    {
        private colorMaterial: ColorMaterial;
        private oCube: GameObject;

        public color = new Color(1, 1, 1);
        public selectedColor = new Color(1, 1, 0);
        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            //
            this.oCube = GameObject.create();
            this.oCube.addComponent(MeshFilter).mesh = new CubeGeometry(8, 8, 8);
            this.colorMaterial = this.oCube.addComponent(MeshRenderer).material = new ColorMaterial();
            this.oCube.transform.mouseEnabled = true;
            this.transform.addChild(this.oCube.transform);

            this.update();
        }

        public update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends Component
    {
        private colorMaterial: ColorMaterial;
        private segmentGeometry: SegmentGeometry;

        public color = new Color(1, 0, 0, 0.2);
        public borderColor = new Color(1, 0, 0);

        public selectedColor = new Color(1, 0, 0, 0.5);
        private selectedborderColor = new Color(1, 1, 0);

        //
        public get width() { return this._width; }
        private _width = 20
        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);

            var plane = GameObject.create("plane");
            plane.transform.x = plane.transform.z = this._width / 2;
            plane.addComponent(MeshFilter).mesh = new PlaneGeometry(this._width, this._width);
            this.colorMaterial = plane.addComponent(MeshRenderer).material = new ColorMaterial();

            plane.transform.mouseEnabled = true;
            this.transform.addChild(plane.transform);

            var border = GameObject.create("border");
            this.segmentGeometry = border.addComponent(MeshFilter).mesh = new SegmentGeometry();
            border.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.transform.addChild(border.transform);

            this.update();
        }

        public update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;

            this.segmentGeometry.removeAllSegments();

            var segment = new Segment(new Vector3D(0, 0, 0), new Vector3D(this._width, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(this._width, 0, 0), new Vector3D(this._width, 0, this._width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(this._width, 0, this._width), new Vector3D(0, 0, this._width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3D(0, 0, this._width), new Vector3D(0, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);
        }
    }
}