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
        private isinit: boolean;
        private segmentMaterial: SegmentMaterial;
        private material: ColorMaterial;

        private xArrow: GameObject;

        readonly color = new Color4(1, 0, 0, 0.99)
        private selectedColor = new Color4(1, 1, 0, 0.99);
        private length: number = 100;

        //
        @watch("update")
        selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var xLine = GameObject.create();
            var meshRenderer = xLine.addComponent(MeshRenderer);
            var segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            segmentGeometry.segments.push({ start: new Vector3(), end: new Vector3(0, this.length, 0) });
            this.segmentMaterial = meshRenderer.material = materialFactory.create("segment", { renderParams: { renderMode: RenderMode.LINES } });
            this.gameObject.addChild(xLine);
            //
            this.xArrow = GameObject.create();
            meshRenderer = this.xArrow.addComponent(MeshRenderer);
            meshRenderer.geometry = new ConeGeometry({ bottomRadius: 5, height: 18 });
            this.material = meshRenderer.material = materialFactory.create("color");
            this.xArrow.transform.y = this.length;
            this.xArrow.mouselayer = mouselayer.editor;
            this.gameObject.addChild(this.xArrow);

            var mouseHit = GameObject.create("hitCoordinateAxis");
            meshRenderer = mouseHit.addComponent(MeshRenderer);
            meshRenderer.geometry = new CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length });
            //meshRenderer.material = materialFactory.create("color");
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            mouseHit.mouselayer = mouselayer.editor;
            this.gameObject.addChild(mouseHit);
            
            this.isinit = true;
            this.update();
        }

        update()
        {
            if (!this.isinit) return;
            var color = this.selected ? this.selectedColor : this.color;
            this.segmentMaterial.uniforms.u_segmentColor = color;
            //
            this.material.uniforms.u_diffuseInput = color;
            this.segmentMaterial.renderParams.enableBlend = this.material.renderParams.enableBlend = color.a < 1;
        }
    }

    export class CoordinateCube extends Component
    {
        private isinit = false;
        private colorMaterial: ColorMaterial;
        private oCube: GameObject;

        color = new Color4(1, 1, 1, 0.99);
        selectedColor = new Color4(1, 1, 0, 0.99);
        //
        @watch("update")
        selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            //
            this.oCube = GameObject.create();
            var meshRenderer = this.oCube.addComponent(MeshRenderer)
            meshRenderer.geometry = new CubeGeometry({ width: 8, height: 8, depth: 8 });
            this.colorMaterial = meshRenderer.material = materialFactory.create("color");
            this.oCube.mouseEnabled = true;
            this.oCube.mouselayer = mouselayer.editor;
            this.gameObject.addChild(this.oCube);

            this.isinit = true;
            this.update();
        }

        update()
        {
            if (!this.isinit) return;
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
        }
    }

    export class CoordinatePlane extends Component
    {
        private isinit: boolean;
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
        @watch("update")
        selected = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var plane = GameObject.create("plane");
            var meshRenderer = plane.addComponent(MeshRenderer);
            plane.transform.x = plane.transform.z = this._width / 2;
            meshRenderer.geometry = new PlaneGeometry({ width: this._width, height: this._width });
            this.colorMaterial = meshRenderer.material = materialFactory.create("color");
            this.colorMaterial.renderParams.cullFace = CullFace.NONE;
            plane.mouselayer = mouselayer.editor;
            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);

            var border = GameObject.create("border");
            meshRenderer = border.addComponent(MeshRenderer);
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            var material = meshRenderer.material = materialFactory.create("segment", { renderParams: { renderMode: RenderMode.LINES } });
            material.uniforms.u_segmentColor = new Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.gameObject.addChild(border);

            this.isinit = true;
            this.update();
        }

        update()
        {
            if (!this.isinit) return;

            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;

            var color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments = [{ start: new Vector3(0, 0, 0), end: new Vector3(this._width, 0, 0), startColor: color, endColor: color }];

            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new Vector3(this._width, 0, 0), end: new Vector3(this._width, 0, this._width), startColor: color, endColor: color });

            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new Vector3(this._width, 0, this._width), end: new Vector3(0, 0, this._width), startColor: color, endColor: color });

            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new Vector3(0, 0, this._width), end: new Vector3(0, 0, 0), startColor: color, endColor: color });
        }
    }
}