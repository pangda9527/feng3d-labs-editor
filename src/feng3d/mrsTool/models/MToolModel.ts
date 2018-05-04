namespace feng3d.editor
{
    /**
     * 移动工具模型组件
     */
    export class MToolModel extends Component
    {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;

        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;

        oCube: CoordinateCube;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "GameObjectMoveModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = GameObject.create("xAxis").addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.transform.rz = -90;
            this.gameObject.addChild(this.xAxis.gameObject);

            this.yAxis = GameObject.create("yAxis").addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.yAxis.gameObject);

            this.zAxis = GameObject.create("zAxis").addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1, 1);
            this.zAxis.transform.rx = 90;
            this.gameObject.addChild(this.zAxis.gameObject);

            this.yzPlane = GameObject.create("yzPlane").addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0, 1);
            this.yzPlane.transform.rz = 90;
            this.gameObject.addChild(this.yzPlane.gameObject);

            this.xzPlane = GameObject.create("xzPlane").addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.xzPlane.gameObject);

            this.xyPlane = GameObject.create("xyPlane").addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1, 1);
            this.xyPlane.transform.rx = -90;
            this.gameObject.addChild(this.xyPlane.gameObject);

            this.oCube = GameObject.create("oCube").addComponent(CoordinateCube);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    }

    export class CoordinateAxis extends Component
    {
        private segmentMaterial: SegmentMaterial;
        private material: ColorMaterial;

        private xArrow: GameObject;

        readonly color = new Color4(1, 0, 0, 0.99)
        private selectedColor = new Color4(1, 1, 0, 0.99);
        private length: number = 100;

        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var xLine = GameObject.create();
            var meshRenderer = xLine.addComponent(MeshRenderer);
            var segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            var segment = new Segment(new Vector3(), new Vector3(0, this.length, 0));
            segmentGeometry.addSegment(segment);
            this.segmentMaterial = meshRenderer.material = new SegmentMaterial();
            this.gameObject.addChild(xLine);
            //
            this.xArrow = GameObject.create();
            meshRenderer = this.xArrow.addComponent(MeshRenderer);
            meshRenderer.geometry = new ConeGeometry(5, 18);
            this.material = meshRenderer.material = new ColorMaterial();
            this.xArrow.transform.y = this.length;
            this.xArrow.mouselayer = mouselayer.editor;
            this.gameObject.addChild(this.xArrow);

            this.update();

            var mouseHit = GameObject.create("hitCoordinateAxis");
            meshRenderer = mouseHit.addComponent(MeshRenderer);
            meshRenderer.geometry = new CylinderGeometry(5, 5, this.length);
            //meshRenderer.material = new ColorMaterial();
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            mouseHit.mouselayer = mouselayer.editor;
            this.gameObject.addChild(mouseHit);
        }

        private update()
        {
            var color = this.selected ? this.selectedColor : this.color;
            this.segmentMaterial.uniforms.u_segmentColor = color;
            //
            this.material.uniforms.u_diffuseInput = color;
            this.segmentMaterial.renderParams.enableBlend = this.material.renderParams.enableBlend = color.a < 1;
        }
    }

    export class CoordinateCube extends Component
    {
        private colorMaterial: ColorMaterial;
        private oCube: GameObject;

        color = new Color4(1, 1, 1, 0.99);
        selectedColor = new Color4(1, 1, 0, 0.99);
        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            //
            this.oCube = GameObject.create();
            var meshRenderer = this.oCube.addComponent(MeshRenderer)
            meshRenderer.geometry = new CubeGeometry(8, 8, 8);
            this.colorMaterial = meshRenderer.material = new ColorMaterial();
            this.oCube.mouseEnabled = true;
            this.oCube.mouselayer = mouselayer.editor;
            this.gameObject.addChild(this.oCube);

            this.update();
        }

        update()
        {
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends Component
    {
        private colorMaterial: ColorMaterial;
        private segmentGeometry: SegmentGeometry;

        color = new Color4(1, 0, 0, 0.2);
        borderColor = new Color4(1, 0, 0, 0.99);

        selectedColor = new Color4(1, 0, 0, 0.5);
        private selectedborderColor = new Color4(1, 1, 0, 0.99);

        //
        get width() { return this._width; }
        private _width = 20
        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var plane = GameObject.create("plane");
            var meshRenderer = plane.addComponent(MeshRenderer);
            plane.transform.x = plane.transform.z = this._width / 2;
            meshRenderer.geometry = new PlaneGeometry(this._width, this._width);
            this.colorMaterial = meshRenderer.material = new ColorMaterial();
            this.colorMaterial.renderParams.cullFace = CullFace.NONE;
            plane.mouselayer = mouselayer.editor;
            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);

            var border = GameObject.create("border");
            meshRenderer = border.addComponent(MeshRenderer);
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            var material = meshRenderer.material = new SegmentMaterial();
            material.uniforms.u_segmentColor = new Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.gameObject.addChild(border);

            this.update();
        }

        update()
        {
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;

            this.segmentGeometry.removeAllSegments();

            var segment = new Segment(new Vector3(0, 0, 0), new Vector3(this._width, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3(this._width, 0, 0), new Vector3(this._width, 0, this._width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3(this._width, 0, this._width), new Vector3(0, 0, this._width));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);

            var segment = new Segment(new Vector3(0, 0, this._width), new Vector3(0, 0, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.addSegment(segment);
        }
    }
}