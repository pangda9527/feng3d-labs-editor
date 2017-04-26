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
            this.xAxis.rotationZ = -90;
            this.addChild(this.xAxis);

            this.yAxis = new CoordinateAxis(new Color(0, 1, 0));
            this.addChild(this.yAxis);

            this.zAxis = new CoordinateAxis(new Color(0, 0, 1));
            this.zAxis.rotationX = 90;
            this.addChild(this.zAxis);

            this.yzPlane = new CoordinatePlane(new Color(1, 0, 0, 0.2), new Color(1, 0, 0, 0.5), new Color(1, 0, 0));
            this.yzPlane.rotationZ = 90;
            this.addChild(this.yzPlane);

            this.xzPlane = new CoordinatePlane(new Color(0, 1, 0, 0.2), new Color(0, 1, 0, 0.5), new Color(0, 1, 0));
            this.addChild(this.xzPlane);

            this.xyPlane = new CoordinatePlane(new Color(0, 0, 1, 0.2), new Color(0, 0, 1, 0.5), new Color(0, 0, 1));
            this.xyPlane.rotationX = -90;
            this.addChild(this.xyPlane);

            this.oCube = new CoordinateCube();
            this.addChild(this.oCube);
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
            var model = new Model();
            model.material = new SegmentMaterial();
            this.segmentGeometry = model.geometry = new SegmentGeometry();
            xLine.addComponent(model);
            this.addChild(xLine);
            //
            this.xArrow = new GameObject();
            var model = new Model();
            this.material = model.material = new ColorMaterial();
            model.geometry = new ConeGeometry(5, 18);
            this.xArrow.addComponent(model);
            this.addChild(this.xArrow);

            this.update();

            var mouseHit = new CylinderObject3D("hit", 5, 5, this.length - 20);
            mouseHit.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.addChild(mouseHit);
        }

        private update()
        {
            this.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this.length, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
            this.segmentGeometry.addSegment(segment);
            //
            this.xArrow.y = this.length;
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
            var model = new Model();
            model.geometry = new CubeGeometry(8, 8, 8);
            this.colorMaterial = model.material = new ColorMaterial();
            this.oCube.addComponent(model);

            this.addChild(this.oCube);

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
            plane.x = plane.z = this._width / 2;
            var model = new Model();
            model.geometry = new PlaneGeometry(this._width, this._width);
            this.colorMaterial = model.material = new ColorMaterial();
            plane.addComponent(model);
            this.addChild(plane);

            var border = new GameObject();
            var model = new Model();
            model.material = new SegmentMaterial();
            this.segmentGeometry = model.geometry = new SegmentGeometry();
            border.addComponent(model);
            this.addChild(border);

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