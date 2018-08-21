namespace feng3d { export interface ComponentMap { MToolModel: editor.MToolModel } }

namespace editor
{
    /**
     * 移动工具模型组件
     */
    export class MToolModel extends feng3d.Component
    {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;

        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;

        oCube: CoordinateCube;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "GameObjectMoveModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.transform.rz = -90;
            this.gameObject.addChild(this.xAxis.gameObject);

            this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.yAxis.gameObject);

            this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1, 1);
            this.zAxis.transform.rx = 90;
            this.gameObject.addChild(this.zAxis.gameObject);

            this.yzPlane = feng3d.GameObject.create("yzPlane").addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0, 1);
            this.yzPlane.transform.rz = 90;
            this.gameObject.addChild(this.yzPlane.gameObject);

            this.xzPlane = feng3d.GameObject.create("xzPlane").addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.xzPlane.gameObject);

            this.xyPlane = feng3d.GameObject.create("xyPlane").addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1, 1);
            this.xyPlane.transform.rx = -90;
            this.gameObject.addChild(this.xyPlane.gameObject);

            this.oCube = feng3d.GameObject.create("oCube").addComponent(CoordinateCube);
            this.gameObject.addChild(this.oCube.gameObject);
        }
    }

    export class CoordinateAxis extends feng3d.Component
    {
        private isinit: boolean;
        private segmentMaterial: feng3d.SegmentMaterial;
        private material: feng3d.ColorMaterial;

        private xArrow: feng3d.GameObject;

        readonly color = new feng3d.Color4(1, 0, 0, 0.99)
        private selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
        private length: number = 100;

        //
        @feng3d.watch("update")
        selected = false;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            var xLine = feng3d.GameObject.create();
            var model = xLine.addComponent(feng3d.Model);
            var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.length, 0) });
            this.segmentMaterial = model.material = new feng3d.SegmentMaterial({ renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true } });
            this.gameObject.addChild(xLine);
            //
            this.xArrow = feng3d.GameObject.create();
            model = this.xArrow.addComponent(feng3d.Model);
            model.geometry = new feng3d.ConeGeometry({ bottomRadius: 5, height: 18 });
            this.material = model.material = new feng3d.ColorMaterial();
            this.material.renderParams.enableBlend = true;
            this.xArrow.transform.y = this.length;
            this.gameObject.addChild(this.xArrow);

            var mouseHit = feng3d.GameObject.create("hitCoordinateAxis");
            model = mouseHit.addComponent(feng3d.Model);
            model.geometry = new feng3d.CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length });
            //model.material = materialFactory.create("color");
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
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
        }
    }

    export class CoordinateCube extends feng3d.Component
    {
        private isinit = false;
        private colorMaterial: feng3d.ColorMaterial;
        private oCube: feng3d.GameObject;

        color = new feng3d.Color4(1, 1, 1, 0.99);
        selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
        //
        @feng3d.watch("update")
        selected = false;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            //
            this.oCube = feng3d.GameObject.create();
            var model = this.oCube.addComponent(feng3d.Model)
            model.geometry = new feng3d.CubeGeometry({ width: 8, height: 8, depth: 8 });
            this.colorMaterial = model.material = new feng3d.ColorMaterial();
            this.colorMaterial.renderParams.enableBlend = true;
            this.oCube.mouseEnabled = true;
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

    export class CoordinatePlane extends feng3d.Component
    {
        private isinit: boolean;
        private colorMaterial: feng3d.ColorMaterial;
        private segmentGeometry: feng3d.SegmentGeometry;

        color = new feng3d.Color4(1, 0, 0, 0.2);
        borderColor = new feng3d.Color4(1, 0, 0, 0.99);

        selectedColor = new feng3d.Color4(1, 0, 0, 0.5);
        private selectedborderColor = new feng3d.Color4(1, 1, 0, 0.99);

        //
        get width() { return this._width; }
        private _width = 20
        //
        @feng3d.watch("update")
        selected = false;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            var plane = feng3d.GameObject.create("plane");
            var model = plane.addComponent(feng3d.Model);
            plane.transform.x = plane.transform.z = this._width / 2;
            model.geometry = new feng3d.PlaneGeometry({ width: this._width, height: this._width });
            this.colorMaterial = model.material = new feng3d.ColorMaterial();
            this.colorMaterial.renderParams.cullFace = feng3d.CullFace.NONE;
            this.colorMaterial.renderParams.enableBlend = true;
            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);

            var border = feng3d.GameObject.create("border");
            model = border.addComponent(feng3d.Model);
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            var material = model.material = new feng3d.SegmentMaterial({ renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
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
            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(0, 0, 0), end: new feng3d.Vector3(this._width, 0, 0), startColor: color, endColor: color }];

            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, 0), end: new feng3d.Vector3(this._width, 0, this._width), startColor: color, endColor: color });

            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, this._width), end: new feng3d.Vector3(0, 0, this._width), startColor: color, endColor: color });

            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(0, 0, this._width), end: new feng3d.Vector3(0, 0, 0), startColor: color, endColor: color });
        }
    }
}