namespace editor
{
    /**
     * 缩放工具模型组件
     */
    export class SToolModel extends feng3d.Component
    {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "GameObjectScaleModel";
            this.initModels();
        }

        private initModels()
        {
            this.xCube = feng3d.GameObject.create("xCube").addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);

            this.yCube = feng3d.GameObject.create("yCube").addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);

            this.zCube = feng3d.GameObject.create("zCube").addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);

            this.oCube = feng3d.GameObject.create("oCube").addComponent(CoordinateCube);
            this.oCube.gameObject.transform.scale = new feng3d.Vector3(1.2, 1.2, 1.2);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    }

    export class CoordinateScaleCube extends feng3d.Component
    {
        private isinit: boolean;
        private coordinateCube: CoordinateCube
        private segmentGeometry: feng3d.SegmentGeometry;

        readonly color = new feng3d.Color4(1, 0, 0, 0.99)
        private selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
        private length = 100;
        //
        @feng3d.watch("update")
        selected = false;
        //
        @feng3d.watch("update")
        scaleValue = 1;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            var xLine = feng3d.GameObject.create();
            var meshRenderer = xLine.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = feng3d.GameObject.create("coordinateCube").addComponent(CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);

            var mouseHit = feng3d.GameObject.create("hit");
            meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length - 4 });
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
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

            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.scaleValue * this.length, 0), startColor: this.color, endColor: this.color }];

            //
            this.coordinateCube.transform.y = this.length * this.scaleValue;
            this.coordinateCube.selected = this.selected;
        }
    }
}