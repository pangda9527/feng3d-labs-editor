namespace feng3d { export interface ComponentMap { SToolModel: editor.SToolModel } }

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
            this.xCube = new feng3d.GameObject({ name: "xCube" }).addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);

            this.yCube = new feng3d.GameObject({ name: "yCube" }).addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);

            this.zCube = new feng3d.GameObject({ name: "zCube" }).addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);

            this.oCube = new feng3d.GameObject({ name: "oCube" }).addComponent(CoordinateCube);
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
            var xLine = new feng3d.GameObject();
            var model = xLine.addComponent(feng3d.Model);
            var material = model.material = new feng3d.SegmentMaterial({ renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = new feng3d.GameObject({ name: "coordinateCube" }).addComponent(CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);

            var mouseHit = new feng3d.GameObject({ name: "hit" });
            model = mouseHit.addComponent(feng3d.Model);
            model.geometry = new feng3d.CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length - 4 });
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