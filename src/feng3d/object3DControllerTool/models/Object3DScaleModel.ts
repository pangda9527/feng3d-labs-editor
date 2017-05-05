module feng3d.editor
{

    export class Object3DScaleModel extends GameObject
    {
        public xCube: CoordinateScaleCube;
        public yCube: CoordinateScaleCube;
        public zCube: CoordinateScaleCube;
        public oCube: CoordinateCube;

        constructor()
        {
            super();
            this.name = "Object3DScaleModel";
            this.initModels();
        }

        private initModels()
        {
            this.xCube = new CoordinateScaleCube(new Color(1, 0, 0));
            this.xCube.rotationZ = -90;
            this.addChild(this.xCube);

            this.yCube = new CoordinateScaleCube(new Color(0, 1, 0));
            this.addChild(this.yCube);

            this.zCube = new CoordinateScaleCube(new Color(0, 0, 1));
            this.zCube.rotationX = 90;
            this.addChild(this.zCube);

            this.oCube = new CoordinateCube();
            this.addChild(this.oCube);
        }
    }

    export class CoordinateScaleCube extends GameObject
    {
        private coordinateCube: CoordinateCube
        private segmentGeometry: SegmentGeometry;

        private color: Color;
        private selectedColor = new Color(1, 1, 0);
        private length = 100;
        //
        public get selected() { return this._selected; }
        public set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;
        //
        public get scaleValue() { return this._scale; }
        public set scaleValue(value) { if (this._scale == value) return; this._scale = value; this.update(); }
        private _scale = 1;

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
            this.coordinateCube = new CoordinateCube(this.color, this.selectedColor);
            this.addChild(this.coordinateCube);

            var mouseHit = new CylinderObject3D("hit", 5, 5, this.length - 4);
            mouseHit.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.addChild(mouseHit);

            this.update();
        }

        private update()
        {
            this.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this._scale * this.length, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
            this.segmentGeometry.addSegment(segment);

            //
            this.coordinateCube.y = this.length * this._scale;
            this.coordinateCube.selected = this.selected;
        }
    }
}