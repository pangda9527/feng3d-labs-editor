namespace feng3d.editor
{
    export class Object3DMoveModel extends Component
    {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;

        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;

        oCube: CoordinateCube;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.gameObject.name = "Object3DMoveModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = GameObject.create("xAxis").addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0);
            this.xAxis.transform.rz = -90;
            this.gameObject.addChild(this.xAxis.gameObject);

            this.yAxis = GameObject.create("yAxis").addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.gameObject.addChild(this.yAxis.gameObject);

            this.zAxis = GameObject.create("zAxis").addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.transform.rx = 90;
            this.gameObject.addChild(this.zAxis.gameObject);

            this.yzPlane = GameObject.create("yzPlane").addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0);
            this.yzPlane.transform.rz = 90;
            this.gameObject.addChild(this.yzPlane.gameObject);

            this.xzPlane = GameObject.create("xzPlane").addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0);
            this.gameObject.addChild(this.xzPlane.gameObject);

            this.xyPlane = GameObject.create("xyPlane").addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1);
            this.xyPlane.transform.rx = -90;
            this.gameObject.addChild(this.xyPlane.gameObject);

            this.oCube = GameObject.create("oCube").addComponent(CoordinateCube);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    }

    export class CoordinateAxis extends Component
    {
        private segmentMaterial: SegmentMaterial;
        private material: ColorMaterial;

        private xArrow: GameObject;

        readonly color = new Color(1, 0, 0)
        private selectedColor: Color = new Color(1, 1, 0);
        private length: number = 100;

        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);

            var xLine = GameObject.create();
            var segmentGeometry = xLine.addComponent(MeshFilter).mesh = new SegmentGeometry();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this.length, 0));
            segmentGeometry.addSegment(segment);
            this.segmentMaterial = xLine.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.gameObject.addChild(xLine);
            //
            this.xArrow = GameObject.create();
            this.xArrow.addComponent(MeshFilter).mesh = new ConeGeometry(5, 18);
            this.material = this.xArrow.addComponent(MeshRenderer).material = new ColorMaterial();
            this.xArrow.transform.y = this.length;
            this.gameObject.addChild(this.xArrow);

            this.update();

            var mouseHit = GameObject.create("hit");
            mouseHit.addComponent(MeshFilter).mesh = new CylinderGeometry(5, 5, this.length - 20);
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
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

        color = new Color(1, 1, 1);
        selectedColor = new Color(1, 1, 0);
        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            //
            this.oCube = GameObject.create();
            this.oCube.addComponent(MeshFilter).mesh = new CubeGeometry(8, 8, 8);
            this.colorMaterial = this.oCube.addComponent(MeshRenderer).material = new ColorMaterial();
            this.oCube.mouseEnabled = true;
            this.gameObject.addChild(this.oCube);

            this.update();
        }

        update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends Component
    {
        private colorMaterial: ColorMaterial;
        private segmentGeometry: SegmentGeometry;

        color = new Color(1, 0, 0, 0.2);
        borderColor = new Color(1, 0, 0);

        selectedColor = new Color(1, 0, 0, 0.5);
        private selectedborderColor = new Color(1, 1, 0);

        //
        get width() { return this._width; }
        private _width = 20
        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);

            var plane = GameObject.create("plane");
            plane.transform.x = plane.transform.z = this._width / 2;
            plane.addComponent(MeshFilter).mesh = new PlaneGeometry(this._width, this._width);
            this.colorMaterial = plane.addComponent(MeshRenderer).material = new ColorMaterial();

            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);

            var border = GameObject.create("border");
            this.segmentGeometry = border.addComponent(MeshFilter).mesh = new SegmentGeometry();
            border.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.gameObject.addChild(border);

            this.update();
        }

        update()
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