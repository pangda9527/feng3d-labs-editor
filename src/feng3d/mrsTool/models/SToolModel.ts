namespace feng3d.editor
{
    /**
     * 缩放工具模型组件
     */
    export class SToolModel extends Component
    {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "GameObjectScaleModel";
            this.initModels();
        }

        private initModels()
        {
            this.xCube = GameObject.create("xCube").addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);

            this.yCube = GameObject.create("yCube").addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);

            this.zCube = GameObject.create("zCube").addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);

            this.oCube = GameObject.create("oCube").addComponent(CoordinateCube);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    }

    export class CoordinateScaleCube extends Component
    {
        private coordinateCube: CoordinateCube
        private segmentGeometry: SegmentGeometry;

        readonly color = new Color4(1, 0, 0, 0.99)
        private selectedColor = new Color4(1, 1, 0, 0.99);
        private length = 100;
        //
        get selected() { return this._selected; }
        set selected(value) { if (this._selected == value) return; this._selected = value; this.update(); }
        private _selected = false;
        //
        get scaleValue() { return this._scale; }
        set scaleValue(value) { if (this._scale == value) return; this._scale = value; this.update(); }
        private _scale = 1;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            var xLine = GameObject.create();
            var meshRenderer = xLine.addComponent(MeshRenderer);
            var material = meshRenderer.material = materialFactory.create("segment", { renderParams: { renderMode: RenderMode.LINES } });
            material.uniforms.u_segmentColor = new Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = GameObject.create("coordinateCube").addComponent(CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);

            var mouseHit = GameObject.create("hit");
            meshRenderer = mouseHit.addComponent(MeshRenderer);
            meshRenderer.geometry = new CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length - 4 });
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            mouseHit.mouselayer = mouselayer.editor;
            this.gameObject.addChild(mouseHit);

            this.update();
        }

        update()
        {
            this.coordinateCube.color = this.color;
            this.coordinateCube.selectedColor = this.selectedColor;
            this.coordinateCube.update();

            this.segmentGeometry.removeAllSegments();
            var segment = new Segment(new Vector3(), new Vector3(0, this._scale * this.length, 0));
            segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
            this.segmentGeometry.addSegment(segment);

            //
            this.coordinateCube.transform.y = this.length * this._scale;
            this.coordinateCube.selected = this.selected;
        }
    }
}