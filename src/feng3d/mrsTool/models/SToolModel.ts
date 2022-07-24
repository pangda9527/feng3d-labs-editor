declare global
{
    export interface MixinsComponentMap { SToolModel: editor.SToolModel }
    export interface MixinsComponentMap { CoordinateCube: editor.CoordinateCube }
    export interface MixinsComponentMap { CoordinateScaleCube: editor.CoordinateScaleCube }
}
/**
 * 缩放工具模型组件
 */
@feng3d.RegisterComponent()
export class SToolModel extends feng3d.Component
{
    xCube: CoordinateScaleCube;
    yCube: CoordinateScaleCube;
    zCube: CoordinateScaleCube;
    oCube: CoordinateCube;

    init()
    {
        super.init();
        this.gameObject.name = "GameObjectScaleModel";
        this.initModels();
    }

    private initModels()
    {
        this.xCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xCube" }).addComponent(CoordinateScaleCube);
        this.xCube.color.setTo(1, 0, 0, 1);
        this.xCube.update();
        this.xCube.transform.rz = -90;
        this.gameObject.addChild(this.xCube.gameObject);

        this.yCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "yCube" }).addComponent(CoordinateScaleCube);
        this.yCube.color.setTo(0, 1, 0, 1);
        this.yCube.update();
        this.gameObject.addChild(this.yCube.gameObject);

        this.zCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "zCube" }).addComponent(CoordinateScaleCube);
        this.zCube.color.setTo(0, 0, 1, 1);
        this.zCube.update();
        this.zCube.transform.rx = 90;
        this.gameObject.addChild(this.zCube.gameObject);

        this.oCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(CoordinateCube);
        this.oCube.gameObject.transform.scale = new feng3d.Vector3(1.2, 1.2, 1.2);
        this.gameObject.addChild(this.oCube.gameObject);
    }
}

@feng3d.RegisterComponent()
export class CoordinateScaleCube extends feng3d.Component
{
    private isinit: boolean;
    private coordinateCube: CoordinateCube
    private segmentGeometry: feng3d.SegmentGeometry;

    readonly color = new feng3d.Color4(1, 0, 0, 0.99)
    private selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
    private length = 100;
    //
    selected = false;
    //
    scaleValue = 1;

    init()
    {
        super.init();
        feng3d.watcher.watch(<CoordinateScaleCube>this, "selected", this.update, this);
        feng3d.watcher.watch(<CoordinateScaleCube>this, "scaleValue", this.update, this);

        var xLine = new feng3d.GameObject();
        var model = xLine.addComponent(feng3d.Renderable);
        var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
            shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
            uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
        });
        material.renderParams.enableBlend = true;
        this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
        this.gameObject.addChild(xLine);
        this.coordinateCube = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "coordinateCube" }).addComponent(CoordinateCube);
        this.gameObject.addChild(this.coordinateCube.gameObject);

        var mouseHit = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "hit" });
        model = mouseHit.addComponent(feng3d.Renderable);
        model.geometry = feng3d.serialization.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length - 4 });
        model.material = new feng3d.Material();
        mouseHit.transform.y = 4 + (this.length - 4) / 2;
        mouseHit.activeSelf = false;
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
