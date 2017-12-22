namespace feng3d.editor
{
    /**
     * 旋转工具模型组件
     */
    export class RToolModel extends Component
    {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "GameObjectRotationModel";
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
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
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
        private sector: SectorGameObject;

        radius = 80;
        readonly color = new Color(1, 0, 0, 0.99)
        private backColor: Color = new Color(0.6, 0.6, 0.6, 0.99);
        private selectedColor: Color = new Color(1, 1, 0, 0.99);

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

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.initModels();
        }

        private initModels()
        {
            var border = GameObject.create();
            var meshRenderer = border.addComponent(MeshRenderer);
            var material = meshRenderer.material = new SegmentMaterial();
            material.color = new Color(1, 1, 1, 0.99);
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = GameObject.create("sector").addComponent(SectorGameObject);


            var mouseHit = GameObject.create("hit");
            meshRenderer = mouseHit.addComponent(MeshRenderer);
            this.torusGeometry = meshRenderer.geometry = new TorusGeometry(this.radius, 2);
            meshRenderer.material = new StandardMaterial();
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouselayer = mouselayer.editor;
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
    export class SectorGameObject extends Component
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
        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "sector";

            var meshRenderer = this.gameObject.addComponent(MeshRenderer);
            this.geometry = meshRenderer.geometry = new CustomGeometry();
            meshRenderer.material = new ColorMaterial(new Color(0.5, 0.5, 0.5, 0.2));

            var border = GameObject.create("border");
            meshRenderer = border.addComponent(MeshRenderer);
            var material = meshRenderer.material = new SegmentMaterial();
            material.color = new Color(1, 1, 1, 0.99);
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
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
            var vertexPositionData = [];
            var indices = [];
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
            this.geometry.indices = indices;
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
        private sector: SectorGameObject;

        private radius = 80;
        color = new Color(1, 0, 0, 0.99)
        private backColor: Color = new Color(0.6, 0.6, 0.6, 0.99);
        private selectedColor: Color = new Color(1, 1, 0, 0.99);

        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.initModels();
        }

        private initModels()
        {
            var border = GameObject.create("border");
            var meshRenderer = border.addComponent(MeshRenderer);
            var material = meshRenderer.material = new SegmentMaterial();
            material.color = new Color(1, 1, 1, 0.99);
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            this.gameObject.addChild(border);

            this.sector = GameObject.create("sector").addComponent(SectorGameObject);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.sector.gameObject.mouselayer = mouselayer.editor;
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