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
        private isinit: boolean;
        private coordinateCube: CoordinateCube
        private segmentGeometry: SegmentGeometry;

        readonly color = new Color4(1, 0, 0, 0.99)
        private selectedColor = new Color4(1, 1, 0, 0.99);
        private length = 100;
        //
        @watch("update")
        selected = false;
        //
        @watch("update")
        scaleValue = 1;

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

            this.isinit = true;
            this.update();
        }

        update()
        {
            if (!this.isinit) return;

            this.coordinateCube.color = this.color;
            this.coordinateCube.selectedColor = this.selectedColor;
            this.coordinateCube.update();

            this.segmentGeometry.segments = [{ start: new Vector3(), end: new Vector3(0, this.scaleValue * this.length, 0), startColor: this.color, endColor: this.color }];

            //
            this.coordinateCube.transform.y = this.length * this.scaleValue;
            this.coordinateCube.selected = this.selected;
        }
    }
}