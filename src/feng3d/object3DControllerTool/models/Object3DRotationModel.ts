namespace feng3d.editor
{
    export class Object3DRotationModel extends Component
    {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.gameObject.name = "Object3DRotationModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = GameObject.create("xAxis").addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);

            this.yAxis = GameObject.create("yAxis").addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);

            this.zAxis = GameObject.create("zAxis").addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);

            this.cameraAxis = GameObject.create("cameraAxis").addComponent(CoordinateRotationAxis);
            this.cameraAxis.color.setTo(1, 1, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);

            this.freeAxis = GameObject.create("freeAxis").addComponent(CoordinateRotationFreeAxis);
            this.freeAxis.color.setTo(1, 1, 1);
            this.freeAxis.update();
            this.gameObject.addChild(this.freeAxis.gameObject);
        }
    }

    export class CoordinateRotationAxis extends Component
    {
        private segmentGeometry: SegmentGeometry;
        private torusGeometry: TorusGeometry;
        private sector: SectorObject3D;

        radius = 80;
        readonly color = new Color(1, 0, 0)
        private backColor: Color = new Color(0.6, 0.6, 0.6);
        private selectedColor: Color = new Color(1, 1, 0);

        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        /**
         * 过滤法线显示某一面线条
         */
        get filterNormal() { return this._filterNormal; }
        set filterNormal(value) { this._filterNormal = value; this.update(); }
        private _filterNormal: Vector3D;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.initModels();
        }

        private initModels()
        {
            var border = GameObject.create();
            border.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.segmentGeometry = border.addComponent(MeshFilter).mesh = new SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = GameObject.create("sector").addComponent(SectorObject3D);


            var mouseHit = GameObject.create("hit");
            this.torusGeometry = mouseHit.addComponent(MeshFilter).mesh = new TorusGeometry(this.radius, 2);
            mouseHit.addComponent(MeshRenderer).material = new StandardMaterial();
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);

            this.update();
        }

        update()
        {
            this.sector.radius = this.radius;
            this.torusGeometry.radius = this.radius;
            var color = this._selected ? this.selectedColor : this.color;

            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            if (this._filterNormal)
            {
                var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this._filterNormal);
            }

            this.segmentGeometry.removeAllSegments();
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
                        this.segmentGeometry.addSegment(segment);
                    } else if (this.selected)
                    {
                        var segment = new Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = this.backColor;
                        this.segmentGeometry.addSegment(segment);
                    }
                }
            }
        }

        showSector(startPos: Vector3D, endPos: Vector3D)
        {
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
            var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * MathConsts.RADIANS_TO_DEGREES;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * MathConsts.RADIANS_TO_DEGREES;

            //
            var min = Math.min(startAngle, endAngle);
            var max = Math.max(startAngle, endAngle);
            if (max - min > 180)
            {
                min += 360;
            }
            this.sector.update(min, max);
            this.gameObject.addChild(this.sector.gameObject);
        }

        hideSector()
        {
            if (this.sector.gameObject.parent)
                this.sector.gameObject.parent.removeChild(this.sector.gameObject);
        }
    }

    /**
     * 扇形对象
     */
    export class SectorObject3D extends Component
    {
        private segmentGeometry: SegmentGeometry;
        private geometry: Geometry;
        private borderColor = new Color(0, 1, 1, 0.6);

        radius = 80;

        private _start = 0;
        private _end = 0;

        /**
         * 构建3D对象
         */
        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.gameObject.name = "sector";

            this.geometry = this.gameObject.addComponent(MeshFilter).mesh = new Geometry();
            this.gameObject.addComponent(MeshRenderer).material = new ColorMaterial(new Color(0.5, 0.5, 0.5, 0.2));

            var border = GameObject.create("border");
            border.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.segmentGeometry = border.addComponent(MeshFilter).mesh = new SegmentGeometry();
            this.gameObject.addChild(border);

            this.update(0, 0);
        }

        update(start = 0, end = 0)
        {
            this._start = Math.min(start, end);
            this._end = Math.max(start, end);
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
            this.geometry.setVAData("a_position", vertexPositionData, 3);
            this.geometry.setIndices(indices);
            //绘制边界
            var startPoint = new Vector3D(this.radius * Math.cos((this._start - 0.1) * MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._start - 0.1) * MathConsts.DEGREES_TO_RADIANS), 0);
            var endPoint = new Vector3D(this.radius * Math.cos((this._end + 0.1) * MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._end + 0.1) * MathConsts.DEGREES_TO_RADIANS), 0);
            //
            this.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3D(), startPoint);
            segment.startColor = segment.endColor = this.borderColor;
            this.segmentGeometry.addSegment(segment);
            var segment = new Segment(new Vector3D(), endPoint);
            segment.startColor = segment.endColor = this.borderColor;
            this.segmentGeometry.addSegment(segment);
        }
    }

    export class CoordinateRotationFreeAxis extends Component
    {
        private segmentGeometry: SegmentGeometry;
        private sector: SectorObject3D;

        private radius = 80;
        color = new Color(1, 0, 0)
        private backColor: Color = new Color(0.6, 0.6, 0.6);
        private selectedColor: Color = new Color(1, 1, 0);

        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        constructor(gameObject: GameObject)
        {
            super(gameObject);
            this.initModels();
        }

        private initModels()
        {
            var border = GameObject.create("border");
            border.addComponent(MeshRenderer).material = new SegmentMaterial();
            this.segmentGeometry = border.addComponent(MeshFilter).mesh = new SegmentGeometry();
            this.gameObject.addChild(border);

            this.sector = GameObject.create("sector").addComponent(SectorObject3D);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.gameObject.addChild(this.sector.gameObject);

            this.update();
        }

        update()
        {
            this.sector.radius = this.radius;
            var color = this._selected ? this.selectedColor : this.color;

            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;

            this.segmentGeometry.removeAllSegments();
            var points: Vector3D[] = [];
            for (var i = 0; i <= 360; i++)
            {
                points[i] = new Vector3D(Math.sin(i * MathConsts.DEGREES_TO_RADIANS), Math.cos(i * MathConsts.DEGREES_TO_RADIANS), 0);
                points[i].scaleBy(this.radius);
                if (i > 0)
                {
                    var segment = new Segment(points[i - 1], points[i]);
                    segment.startColor = segment.endColor = color;
                    this.segmentGeometry.addSegment(segment);
                }
            }
        }
    }
}