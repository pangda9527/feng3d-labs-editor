namespace feng3d { export interface ComponentMap { RToolModel: editor.RToolModel } }
namespace feng3d { export interface ComponentMap { SectorGameObject: editor.SectorGameObject } }
namespace feng3d { export interface ComponentMap { CoordinateRotationFreeAxis: editor.CoordinateRotationFreeAxis } }
namespace feng3d { export interface ComponentMap { CoordinateRotationAxis: editor.CoordinateRotationAxis } }

namespace editor
{
    /**
     * 旋转工具模型组件
     */
    export class RToolModel extends feng3d.Component
    {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "GameObjectRotationModel";
            this.initModels();
        }

        private initModels()
        {
            this.xAxis = new feng3d.GameObject().value({ name: "xAxis" }).addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);

            this.yAxis = new feng3d.GameObject().value({ name: "yAxis" }).addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);

            this.zAxis = new feng3d.GameObject().value({ name: "zAxis" }).addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);

            this.cameraAxis = new feng3d.GameObject().value({ name: "cameraAxis" }).addComponent(CoordinateRotationAxis);
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);

            this.freeAxis = new feng3d.GameObject().value({ name: "freeAxis" }).addComponent(CoordinateRotationFreeAxis);
            this.freeAxis.color.setTo(1, 1, 1);
            this.freeAxis.update();
            this.gameObject.addChild(this.freeAxis.gameObject);
        }
    }

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
        @feng3d.watch("update")
        selected = false;

        /**
         * 过滤法线显示某一面线条
         */
        @feng3d.watch("update")
        filterNormal: feng3d.Vector3;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.initModels();
        }

        private initModels()
        {
            var border = new feng3d.GameObject();
            var model = border.addComponent(feng3d.Model);
            var material = model.material = new feng3d.SegmentMaterial().value({ renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = new feng3d.GameObject().value({ name: "sector" }).addComponent(SectorGameObject);


            var mouseHit = new feng3d.GameObject().value({ name: "hit" });
            model = mouseHit.addComponent(feng3d.Model);
            this.torusGeometry = model.geometry = new feng3d.TorusGeometry({ radius: this.radius, tubeRadius: 2 });
            model.material = new feng3d.StandardMaterial();
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

            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            if (this.filterNormal)
            {
                var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this.filterNormal);
            }

            this.segmentGeometry.segments = [];
            var points: feng3d.Vector3[] = [];
            for (var i = 0; i <= 360; i++)
            {
                points[i] = new feng3d.Vector3(Math.sin(i * feng3d.FMath.DEG2RAD), Math.cos(i * feng3d.FMath.DEG2RAD), 0);
                points[i].scale(this.radius);
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
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
            var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * feng3d.FMath.RAD2DEG;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * feng3d.FMath.RAD2DEG;

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
        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.gameObject.name = "sector";

            var model = this.gameObject.addComponent(feng3d.Model);
            this.geometry = model.geometry = new feng3d.CustomGeometry();
            model.material = new feng3d.ColorMaterial().value({ uniforms: { u_diffuseInput: new feng3d.Color4(0.5, 0.5, 0.5, 0.2) } });
            model.material.renderParams.enableBlend = true;
            model.material.renderParams.cullFace = feng3d.CullFace.NONE;

            var border = new feng3d.GameObject().value({ name: "border" });
            model = border.addComponent(feng3d.Model);
            var material = model.material = new feng3d.SegmentMaterial().value({ renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
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
                vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * feng3d.FMath.DEG2RAD);
                vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * feng3d.FMath.DEG2RAD);
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
            var startPoint = new feng3d.Vector3(this.radius * Math.cos((this._start - 0.1) * feng3d.FMath.DEG2RAD), this.radius * Math.sin((this._start - 0.1) * feng3d.FMath.DEG2RAD), 0);
            var endPoint = new feng3d.Vector3(this.radius * Math.cos((this._end + 0.1) * feng3d.FMath.DEG2RAD), this.radius * Math.sin((this._end + 0.1) * feng3d.FMath.DEG2RAD), 0);
            //
            this.segmentGeometry.segments = [
                { start: new feng3d.Vector3(), end: startPoint, startColor: this.borderColor, endColor: this.borderColor },
                { start: new feng3d.Vector3(), end: endPoint, startColor: this.borderColor, endColor: this.borderColor },
            ];
        }
    }

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
        @feng3d.watch("update")
        selected = false;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.initModels();
        }

        private initModels()
        {
            var border = new feng3d.GameObject().value({ name: "border" });
            var model = border.addComponent(feng3d.Model);
            var material = model.material = new feng3d.SegmentMaterial().value({ renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);

            this.sector = new feng3d.GameObject().value({ name: "sector" }).addComponent(SectorGameObject);
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

            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;

            var segments: feng3d.Segment[] = [];
            var points: feng3d.Vector3[] = [];
            for (var i = 0; i <= 360; i++)
            {
                points[i] = new feng3d.Vector3(Math.sin(i * feng3d.FMath.DEG2RAD), Math.cos(i * feng3d.FMath.DEG2RAD), 0);
                points[i].scale(this.radius);
                if (i > 0)
                {
                    segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                }
            }
            this.segmentGeometry.segments = segments;
        }
    }
}