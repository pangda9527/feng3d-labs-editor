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
            this.xAxis = new CoordinateRotationAxis(new Color(1, 0, 0));
            this.xAxis.transform.ry = 90;
            this.addChild(this.xAxis);

            this.yAxis = new CoordinateRotationAxis(new Color(0, 1, 0));
            this.yAxis.transform.rx = 90;
            this.addChild(this.yAxis);

            this.zAxis = new CoordinateRotationAxis(new Color(0, 0, 1));
            this.addChild(this.zAxis);

            this.cameraAxis = new CoordinateRotationAxis(new Color(1, 1, 1), 88);
            this.addChild(this.cameraAxis);

            this.freeAxis = new CoordinateRotationAxis(new Color(1, 1, 1));
            this.addChild(this.freeAxis);
        }
    }

    export class CoordinateRotationAxis extends Object3D
    {
        private border: SegmentObject3D;
        private sector: SectorObject3D;

        private radius;
        private color: Color;
        private backColor: Color = new Color(0.6, 0.6, 0.6);
        private selectedColor: Color = new Color(1, 1, 0);

        //
        private _selected = false;
        public set selected(value) { this._selected = value; this.update(); }
        public get selected() { return this._selected; }

        /**
         * 过滤法线显示某一面线条
         */
        private filterNormal: Vector3D;

        constructor(color = new Color(1, 0, 0), radius = 80)
        {
            super();
            this.color = color;
            this.radius = radius;
            this.initModels();
        }

        private initModels()
        {
            this.border = new SegmentObject3D();
            this.addChild(this.border);

            this.sector = new SectorObject3D();

            this.update();

            var mouseHit = new TorusObect3D("hit");
            mouseHit.torusGeometry.radius = this.radius;
            mouseHit.torusGeometry.tubeRadius = 2;
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            this.addChild(mouseHit);
        }

        private update()
        {
            var color = this._selected ? this.selectedColor : this.color;

            var inverseGlobalMatrix3D = this.transform.inverseGlobalMatrix3D;
            if (this.filterNormal)
            {
                var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this.filterNormal);
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
                        this.border.segmentGeometry.addSegment(segment, false);
                    } else if (this.selected)
                    {
                        var segment = new Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = this.backColor;
                        this.border.segmentGeometry.addSegment(segment, false);
                    }
                }
            }
            this.border.segmentGeometry.updateGeometry();
        }

        public showSector(startPos: Vector3D, endPos: Vector3D)
        {
            var inverseGlobalMatrix3D = this.transform.inverseGlobalMatrix3D;
            var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
            var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * MathConsts.RADIANS_TO_DEGREES;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * MathConsts.RADIANS_TO_DEGREES;
            this.sector.update(startAngle, endAngle);
            this.addChild(this.sector);
        }

        public hideSector()
        {
            this.removeChild(this.sector);
        }
    }

    /**
     * 扇形对象
     */
    export class SectorObject3D extends Object3D
    {
        public geometry: Geometry;
        public border: SegmentObject3D;
        public borderColor = new Color(0, 1, 1, 0.6);

        public radius = 80

        public _start = 0;
        public _end = 0;

        /**
         * 构建3D对象
         */
        constructor(name = "sector")
        {
            super(name);
            var mesh = this.getOrCreateComponentByClass(MeshFilter);
            this.geometry = mesh.geometry = new Geometry();
            this.getOrCreateComponentByClass(MeshRenderer).material = new ColorMaterial(new Color(0.5, 0.5, 0.5, 0.2));

            this.border = new SegmentObject3D();
            this.addChild(this.border);
        }

        public update(start = 0, end = 0)
        {
            this._start = start;
            this._end = end;
            this.adjustAngle();
            var length = Math.floor(this._end - this._start);
            if (length == 0)
                length = 1;
            var vertexPositionData = new Float32Array((length + 2) * 3);
            var indices = new Uint16Array(length * 3);
            vertexPositionData[0] = 0;
            vertexPositionData[1] = 0;
            vertexPositionData[2] = 0;
            for (var i = 0; i < length; i++)
            {
                vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * MathConsts.DEGREES_TO_RADIANS);
                vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * MathConsts.DEGREES_TO_RADIANS);
                vertexPositionData[i * 3 + 5] = 0;
                if (i > 0)
                {
                    indices[(i - 1) * 3] = 0;
                    indices[(i - 1) * 3 + 1] = i;
                    indices[(i - 1) * 3 + 2] = i + 1;
                }
            }
            this.geometry.setVAData(GLAttribute.a_position, vertexPositionData, 3);
            this.geometry.setIndices(indices);
            //绘制边界
            var startPoint = new Vector3D(this.radius * Math.cos((this._start - 0.1) * MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._start - 0.1) * MathConsts.DEGREES_TO_RADIANS), 0);
            var endPoint = new Vector3D(this.radius * Math.cos((this._end + 0.1) * MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._end + 0.1) * MathConsts.DEGREES_TO_RADIANS), 0);
            //
            this.border.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), startPoint);
            segment.startColor = segment.endColor = this.borderColor;
            this.border.segmentGeometry.addSegment(segment);
            var segment = new Segment(new Vector3D(), endPoint);
            segment.startColor = segment.endColor = this.borderColor;
            this.border.segmentGeometry.addSegment(segment);
        }

        private adjustAngle()
        {
            var min = Math.min(this._start, this._end);
            var max = Math.max(this._start, this._end);
            if (max - min > 180)
            {
                min += 360;
                this._start = max;
                this._end = min;
            } else
            {
                this._start = min;
                this._end = max;
            }
        }
    }
}