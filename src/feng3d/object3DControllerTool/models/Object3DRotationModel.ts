module feng3d.editor
{
    export class Object3DRotationModel extends Object3D
    {
        public xAxis: CoordinateRotationAxis;
        public yAxis: CoordinateRotationAxis;
        public zAxis: CoordinateRotationAxis;
        public freeAxis: CoordinateRotationAxis;
        public cameraAxis: CoordinateRotationAxis;

        constructor()
        {
            super();
            this.name = "Object3DRotationModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = new CoordinateRotationAxis();
            this.xAxis.color = new Color(1, 0, 0);
            this.xAxis.transform.ry = 90;
            this.addChild(this.xAxis);

            this.yAxis = new CoordinateRotationAxis();
            this.yAxis.color = new Color(0, 1, 0);
            this.yAxis.transform.rx = 90;
            this.addChild(this.yAxis);

            this.zAxis = new CoordinateRotationAxis();
            this.zAxis.color = new Color(0, 0, 1);
            this.addChild(this.zAxis);

            this.cameraAxis = new CoordinateRotationAxis();
            this.cameraAxis.radius = 88;
            this.cameraAxis.color = new Color(1, 1, 1);
            this.addChild(this.cameraAxis);

            this.freeAxis = new CoordinateRotationAxis();
            this.freeAxis.color = new Color(1, 1, 1);
            this.addChild(this.freeAxis);
        }
    }

    export class CoordinateRotationAxis extends Object3D
    {
        public border: SegmentObject3D;

        public radius = 80;
        public color: Color = new Color(1, 0, 0);
        public backColor: Color = new Color(0.6, 0.6, 0.6);
        public selectedColor: Color = new Color(1, 1, 0);
        public selected = false;

        /**
         * 过滤法线显示某一面线条
         */
        public filterNormal: Vector3D;

        constructor()
        {
            super();
            this.initModels();
        }

        private initModels()
        {
            this.border = new SegmentObject3D();
            this.addChild(this.border);

            this.update();

            //
            Binding.bindHandler(this, ["radius"], this.update, this);
            Binding.bindHandler(this, ["color"], this.update, this);
            Binding.bindHandler(this, ["selectedColor"], this.update, this);
            Binding.bindHandler(this, ["selected"], this.update, this);
            Binding.bindHandler(this, ["filterNormal"], this.update, this);
        }

        private update()
        {
            var color = this.selected ? this.selectedColor : this.color;

            if (this.filterNormal)
            {
                var localNormal = this.transform.inverseGlobalMatrix3D.deltaTransformVector(this.filterNormal);
            }

            this.border.segmentGeometry.removeAllSegments();
            var points: Vector3D[] = [];
            for (var i = 0; i <= 360; i++)
            {
                points[i] = new Vector3D(Math.sin(i * MathConsts.DEGREES_TO_RADIANS), Math.cos(i * MathConsts.DEGREES_TO_RADIANS), 0);
                points[i].scaleBy(this.radius);
                if (i > 0)
                {
                    var show = true;
                    if (localNormal)
                    {
                        show = points[i - 1].dotProduct(localNormal) > 0 && points[i].dotProduct(localNormal) > 0;
                    }
                    if (show)
                    {
                        var segment = new Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = color;
                        this.border.segmentGeometry.addSegment(segment);
                    } else if (this.selected)
                    {
                        var segment = new Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = this.backColor;
                        this.border.segmentGeometry.addSegment(segment);
                    }
                }
            }
        }
    }
}