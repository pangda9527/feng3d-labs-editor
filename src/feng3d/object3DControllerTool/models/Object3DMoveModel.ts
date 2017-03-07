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
            this.xAxis = new CoordinateAxis(new Color(1, 0, 0));
            this.xAxis.transform.rz = -90;
            this.addChild(this.xAxis);

            this.yAxis = new CoordinateAxis(new Color(0, 1, 0));
            this.addChild(this.yAxis);

            this.zAxis = new CoordinateAxis(new Color(0, 0, 1));
            this.zAxis.transform.rx = 90;
            this.addChild(this.zAxis);

            this.yzPlane = new CoordinatePlane(new Color(1, 0, 0, 0.2), new Color(1, 0, 0, 0.5), new Color(1, 0, 0));
            this.yzPlane.transform.rz = 90;
            this.addChild(this.yzPlane);

            this.xzPlane = new CoordinatePlane(new Color(0, 1, 0, 0.2), new Color(0, 1, 0, 0.5), new Color(0, 1, 0));
            this.addChild(this.xzPlane);

            this.xyPlane = new CoordinatePlane(new Color(0, 0, 1, 0.2), new Color(0, 0, 1, 0.5), new Color(0, 0, 1));
            this.xyPlane.transform.rx = -90;
            this.addChild(this.xyPlane);

            this.oCube = new CoordinateCube();
            this.addChild(this.oCube);
        }
    }

    export class CoordinateAxis extends Object3D
    {
        private xLine: SegmentObject3D;
        private xArrow: ConeObject3D;

        private color: Color;
        private selectedColor: Color = new Color(1, 1, 0);
        private length: number = 100;

        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(color = new Color(1, 0, 0))
        {
            super();
            this.color = color;

            this.xLine = new SegmentObject3D();
            this.addChild(this.xLine);
            //
            this.xArrow = new ConeObject3D(5, 18);
            this.addChild(this.xArrow);
            this.update();

            var mouseHit = new CylinderObject3D("hit", 5, 5, this.length - 20);
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            this.addChild(mouseHit);
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
        private colorMaterial: ColorMaterial;
        private oCube: CubeObject3D;

        private color: Color;
        private selectedColor: Color;
        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(color = new Color(1, 1, 1), selectedColor = new Color(1, 1, 0))
        {
            super();
            this.color = color;
            this.selectedColor = selectedColor;
            //
            this.oCube = new CubeObject3D(8);
            this.colorMaterial = new ColorMaterial();
            this.oCube.getOrCreateComponentByClass(MeshRenderer).material = this.colorMaterial;
            this.addChild(this.oCube);

            this.update();
        }

        private update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends Object3D
    {
        private colorMaterial: ColorMaterial;
        private border: SegmentObject3D;

        private color: Color;
        private borderColor: Color;

        private selectedColor: Color;
        private selectedborderColor = new Color(1, 1, 0);

        //
        public get width() { return this._width; }
        private _width = 20
        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(color = new Color(1, 0, 0, 0.2), selectedColor = new Color(1, 0, 0, 0.5), borderColor = new Color(1, 0, 0))
        {
            super();
            this.color = color;
            this.selectedColor = selectedColor;
            this.borderColor = borderColor;

            var plane = new PlaneObject3D(this._width);
            plane.transform.x = plane.transform.z = this._width / 2;
            this.colorMaterial = new ColorMaterial();
            plane.getOrCreateComponentByClass(MeshRenderer).material = this.colorMaterial;
            this.addChild(plane);

            this.border = new SegmentObject3D();
            this.addChild(this.border);

            this.update();
        }

        private update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;

            var border = this.border;
            border.segmentGeometry.removeAllSegments();

            var segment = new Segment(new Vector3D(0, 0, 0), new Vector3D(this._width, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment, false);

            var segment = new Segment(new Vector3D(this._width, 0, 0), new Vector3D(this._width, 0, this._width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment, false);

            var segment = new Segment(new Vector3D(this._width, 0, this._width), new Vector3D(0, 0, this._width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment, false);

            var segment = new Segment(new Vector3D(0, 0, this._width), new Vector3D(0, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            border.segmentGeometry.addSegment(segment, false);

            border.segmentGeometry.updateGeometry();
        }
    }
}