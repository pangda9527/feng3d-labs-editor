module feng3d.editor
{
    export class Object3DMoveModel extends GameObject
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
            this.xAxis.transform.rotationZ = -90;
            this.transform.addChild(this.xAxis.transform);

            this.yAxis = new CoordinateAxis(new Color(0, 1, 0));
            this.transform.addChild(this.yAxis.transform);

            this.zAxis = new CoordinateAxis(new Color(0, 0, 1));
            this.zAxis.transform.rotationX = 90;
            this.transform.addChild(this.zAxis.transform);

            this.yzPlane = new CoordinatePlane(new Color(1, 0, 0, 0.2), new Color(1, 0, 0, 0.5), new Color(1, 0, 0));
            this.yzPlane.transform.rotationZ = 90;
            this.transform.addChild(this.yzPlane.transform);

            this.xzPlane = new CoordinatePlane(new Color(0, 1, 0, 0.2), new Color(0, 1, 0, 0.5), new Color(0, 1, 0));
            this.transform.addChild(this.xzPlane.transform);

            this.xyPlane = new CoordinatePlane(new Color(0, 0, 1, 0.2), new Color(0, 0, 1, 0.5), new Color(0, 0, 1));
            this.xyPlane.transform.rotationX = -90;
            this.transform.addChild(this.xyPlane.transform);

            this.oCube = new CoordinateCube();
            this.transform.addChild(this.oCube.transform);
        }
    }

    export class CoordinateAxis extends GameObject
    {
        private segmentGeometry: SegmentGeometry;
        private material: ColorMaterial;

        private xArrow: GameObject;

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

            var xLine = new GameObject();
            this.segmentGeometry = xLine.addComponent(MeshFilter).mesh = new SegmentGeometry();
            xLine.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.transform.addChild(xLine.transform);
            //
            this.xArrow = new GameObject();
            this.xArrow.addComponent(MeshFilter).mesh = new ConeGeometry(5, 18);
            this.material = this.xArrow.addComponent(MeshRenderer).material = new ColorMaterial();
            this.transform.addChild(this.xArrow.transform);

            this.update();

            var mouseHit = new GameObject("hit");
            mouseHit.addComponent(MeshFilter).mesh = new CylinderGeometry(5, 5, this.length - 20);
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.transform.visible = false;
            mouseHit.transform.mouseEnabled = true;
            this.transform.addChild(mouseHit.transform);
        }

        private update()
        {
            this.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this.length, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
            this.segmentGeometry.addSegment(segment);
            //
            this.xArrow.transform.y = this.length;
            this.material.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinateCube extends GameObject
    {
        private colorMaterial: ColorMaterial;
        private oCube: GameObject;

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
            this.oCube = new GameObject();
            this.oCube.addComponent(MeshFilter).mesh = new CubeGeometry(8, 8, 8);
            this.colorMaterial = this.oCube.addComponent(MeshRenderer).material = new ColorMaterial();
            this.oCube.transform.mouseEnabled = true;
            this.transform.addChild(this.oCube.transform);

            this.update();
        }

        private update()
        {
            this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends GameObject
    {
        private colorMaterial: ColorMaterial;
        private segmentGeometry: SegmentGeometry;

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

            var plane = new GameObject();
            plane.transform.x = plane.transform.z = this._width / 2;
            plane.addComponent(MeshFilter).mesh = new PlaneGeometry(this._width, this._width);
            this.colorMaterial = plane.addComponent(MeshRenderer).material = new ColorMaterial();

            plane.transform.mouseEnabled = true;
            this.transform.addChild(plane.transform);

            var border = new GameObject();
            this.segmentGeometry = border.addComponent(MeshFilter).mesh = new SegmentGeometry();
            border.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.transform.addChild(border.transform);

            this.update();
        }

        private update()
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