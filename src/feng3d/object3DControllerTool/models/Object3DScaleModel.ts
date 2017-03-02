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
            this.xCube = new CoordinateScaleCube();
            this.xCube.color = new Color(1, 0, 0);
            this.xCube.transform.rz = -90;
            this.addChild(this.xCube);

            this.yCube = new CoordinateScaleCube();
            this.yCube.color = new Color(0, 1, 0);
            this.addChild(this.yCube);

            this.zCube = new CoordinateScaleCube();
            this.zCube.color = new Color(0, 0, 1);
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
        public coordinateCube: CoordinateCube
        public xLine: SegmentObject3D;

        public color = new Color(1, 0, 0);
        public selectedColor = new Color(1, 1, 0);
        public length = 100;
        public scale = 1;
        public selected = false;

        constructor()
        {
            super();

            this.xLine = new SegmentObject3D();
            this.addChild(this.xLine);
            this.coordinateCube = new CoordinateCube();
            this.addChild(this.coordinateCube);

            this.update();

            //
            Binding.bindHandler(this, ["color"], this.update, this);
            Binding.bindHandler(this, ["selectedColor"], this.update, this);
            Binding.bindHandler(this, ["length"], this.update, this);
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