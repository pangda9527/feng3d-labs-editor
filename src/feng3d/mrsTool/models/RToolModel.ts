namespace feng3d { export interface ComponentMap { RToolModel: editor.RToolModel } }
namespace feng3d { export interface ComponentMap { SectorGameObject: editor.SectorGameObject } }
namespace feng3d { export interface ComponentMap { CoordinateRotationFreeAxis: editor.CoordinateRotationFreeAxis } }
namespace feng3d { export interface ComponentMap { CoordinateRotationAxis: editor.CoordinateRotationAxis } }

namespace editor
{
    /**
     * 旋转工具模型组件
     */
    @feng3d.RegisterComponent()
    export class RToolModel extends feng3d.Component
    {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;

        init()
        {
            super.init();
            this.gameObject.name = "GameObjectRotationModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);

            this.yAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);

            this.zAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);

            this.cameraAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "cameraAxis" }).addComponent(CoordinateRotationAxis);
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);

            this.freeAxis = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "freeAxis" }).addComponent(CoordinateRotationFreeAxis);
            this.freeAxis.color.setTo(1, 1, 1);
            this.freeAxis.update();
            this.gameObject.addChild(this.freeAxis.gameObject);
        }
    }

    @feng3d.RegisterComponent()
    export class CoordinateRotationAxis extends feng3d.Component
    {
        private isinit: boolean;
        private segmentGeometry: feng3d.SegmentGeometry;
        private torusGeometry: feng3d.TorusGeometry;
        private sector: SectorGameObject;

        radius = 80;
        readonly color = new feng3d.Color4(1, 0, 0, 0.99)
        private backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
        private selectedColor = new feng3d.Color4(1, 1, 0, 0.99);

        //
        selected = false;

        /**
         * 过滤法线显示某一面线条
         */
        filterNormal: feng3d.Vector3;

        init()
        {
            super.init();

            feng3d.watcher.watch(<CoordinateRotationAxis>this, "selected", this.update, this);
            feng3d.watcher.watch(<CoordinateRotationAxis>this, "filterNormal", this.update, this);

            this.initModels();
        }

        private initModels()
        {
            var border = new feng3d.GameObject();
            var model = border.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);


            var mouseHit = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Renderable);
            this.torusGeometry = model.geometry = feng3d.serialization.setValue(new feng3d.TorusGeometry(), { radius: this.radius, tubeRadius: 2 });
            model.material = new feng3d.Material();
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);

            this.isinit = true;
            this.update();
        }

        update()
        {
            if (!this.isinit) return;

            this.sector.radius = this.radius;
            this.torusGeometry.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;

            var inverseGlobalMatrix = this.transform.worldToLocalMatrix;
            if (this.filterNormal)
            {
                var localNormal = inverseGlobalMatrix.transformVector3(this.filterNormal);
            }

            this.segmentGeometry.segments = [];
            var points: feng3d.Vector3[] = [];
            for (var i = 0; i <= 360; i++)
            {
                points[i] = new feng3d.Vector3(Math.sin(i * Math.DEG2RAD), Math.cos(i * Math.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0)
                {
                    var show = true;
                    if (localNormal)
                    {
                        show = points[i - 1].dot(localNormal) > 0 && points[i].dot(localNormal) > 0;
                    }
                    if (show)
                    {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                    } else if (this.selected)
                    {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: this.backColor, endColor: this.backColor });
                    }
                }
            }
        }

        showSector(startPos: feng3d.Vector3, endPos: feng3d.Vector3)
        {
            var inverseGlobalMatrix = this.transform.worldToLocalMatrix;
            var localStartPos = inverseGlobalMatrix.transformPoint3(startPos);
            var localEndPos = inverseGlobalMatrix.transformPoint3(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * Math.RAD2DEG;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * Math.RAD2DEG;

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
    @feng3d.RegisterComponent()
    export class SectorGameObject extends feng3d.Component
    {
        private isinit: boolean;
        private segmentGeometry: feng3d.SegmentGeometry;
        private geometry: feng3d.Geometry;
        private borderColor = new feng3d.Color4(0, 1, 1, 0.6);

        radius = 80;

        private _start = 0;
        private _end = 0;

        /**
         * 构建3D对象
         */
        init()
        {
            super.init();
            this.gameObject.name = "sector";

            var model = this.gameObject.addComponent(feng3d.Renderable);
            this.geometry = model.geometry = new feng3d.CustomGeometry();
            model.material = feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "color", uniforms: { u_diffuseInput: new feng3d.Color4(0.5, 0.5, 0.5, 0.2) } });
            model.material.renderParams.enableBlend = true;
            model.material.renderParams.cullFace = feng3d.CullFace.NONE;

            var border = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "border" });
            model = border.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);

            this.isinit = true;
            this.update(0, 0);
        }

        update(start = 0, end = 0)
        {
            if (!this.isinit) return;

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
                vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * Math.DEG2RAD);
                vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * Math.DEG2RAD);
                vertexPositionData[i * 3 + 5] = 0;
                if (i > 0)
                {
                    indices[(i - 1) * 3] = 0;
                    indices[(i - 1) * 3 + 1] = i;
                    indices[(i - 1) * 3 + 2] = i + 1;
                }
            }
            if (indices.length == 0) indices = [0, 0, 0];
            this.geometry.positions = vertexPositionData;
            this.geometry.indices = indices;
            //绘制边界
            var startPoint = new feng3d.Vector3(this.radius * Math.cos((this._start - 0.1) * Math.DEG2RAD), this.radius * Math.sin((this._start - 0.1) * Math.DEG2RAD), 0);
            var endPoint = new feng3d.Vector3(this.radius * Math.cos((this._end + 0.1) * Math.DEG2RAD), this.radius * Math.sin((this._end + 0.1) * Math.DEG2RAD), 0);
            //
            this.segmentGeometry.segments = [
                { start: new feng3d.Vector3(), end: startPoint, startColor: this.borderColor, endColor: this.borderColor },
                { start: new feng3d.Vector3(), end: endPoint, startColor: this.borderColor, endColor: this.borderColor },
            ];
        }
    }

    @feng3d.RegisterComponent()
    export class CoordinateRotationFreeAxis extends feng3d.Component
    {
        private isinit: boolean;
        private segmentGeometry: feng3d.SegmentGeometry;
        private sector: SectorGameObject;

        private radius = 80;
        color = new feng3d.Color4(1, 0, 0, 0.99)
        private backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
        private selectedColor = new feng3d.Color4(1, 1, 0, 0.99);

        //
        selected = false;

        init()
        {
            super.init();
            feng3d.watcher.watch(<CoordinateRotationFreeAxis>this, "selected", this.update, this);
            this.initModels();
        }

        private initModels()
        {
            var border = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "border" });
            var model = border.addComponent(feng3d.Renderable);
            var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) }
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);

            this.sector = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.gameObject.addChild(this.sector.gameObject);

            this.isinit = true;
            this.update();
        }

        update()
        {
            if (!this.isinit) return;

            this.sector.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;

            var inverseGlobalMatrix = this.transform.worldToLocalMatrix;

            var segments: feng3d.Segment[] = [];
            var points: feng3d.Vector3[] = [];
            for (var i = 0; i <= 360; i++)
            {
                points[i] = new feng3d.Vector3(Math.sin(i * Math.DEG2RAD), Math.cos(i * Math.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0)
                {
                    segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                }
            }
            this.segmentGeometry.segments = segments;
        }
    }
}