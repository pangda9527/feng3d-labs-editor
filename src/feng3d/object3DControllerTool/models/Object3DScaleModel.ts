module feng3d.editor
{

    export class Object3DScaleModel extends Object3D
    {
        public xCube: CoordinateScaleCube;
        public yCube: CoordinateScaleCube;
        public zCube: CoordinateScaleCube;
        public oCube: CoordinateCube;

        /**
         * 增加的缩放值
         */
        public addScale: Vector3D;

        constructor()
        {
            super();
            this.name = "Object3DScaleModel";
            this.initModels();
        }

        private initModels()
        {
            this.xCube = new CoordinateScaleCube(new Color(1, 0, 0));
            this.xCube.transform.rz = -90;
            this.addChild(this.xCube);

            this.yCube = new CoordinateScaleCube(new Color(0, 1, 0));
            this.addChild(this.yCube);

            this.zCube = new CoordinateScaleCube(new Color(0, 0, 1));
            this.zCube.transform.rx = 90;
            this.addChild(this.zCube);

            this.oCube = new CoordinateCube();
            this.addChild(this.oCube);

            Binding.bindProperty(this, ["addScale", "x"], this.xCube, "scale");
            Binding.bindProperty(this, ["addScale", "y"], this.yCube, "scale");
            Binding.bindProperty(this, ["addScale", "z"], this.zCube, "scale");
        }
    }

    export class CoordinateScaleCube extends Object3D
    {
        private coordinateCube: CoordinateCube
        private xLine: SegmentObject3D;

        private color: Color;
        private selectedColor = new Color(1, 1, 0);
        private length = 100;
        public selected = false;
        //
        public scale = 1;

        constructor(color = new Color(1, 0, 0))
        {
            super();
            this.color = color;

            this.xLine = new SegmentObject3D();
            this.addChild(this.xLine);
            this.coordinateCube = new CoordinateCube();
            this.addChild(this.coordinateCube);

            var mouseHit = new CylinderObject3D("hit", 5, 5, this.length - 4);
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            this.addChild(mouseHit);

            this.update();

            Binding.bindHandler(this, ["selected"], this.update, this);
            Binding.bindHandler(this, ["scale"], this.update, this);
        }

        private update()
        {
            this.xLine.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), new Vector3D(0, this.scale * this.length, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
            this.xLine.segmentGeometry.addSegment(segment);

            //
            this.coordinateCube.transform.y = this.length * this.scale;
            this.coordinateCube.color = this.color;
            this.coordinateCube.selectedColor = this.selectedColor;
            this.coordinateCube.selected = this.selected;
        }
    }
}