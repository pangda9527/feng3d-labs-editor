namespace editor
{
    export class PointLightIcon extends EditorScript
    {
        @feng3d.watch("onLightChanged")
        light: feng3d.PointLight;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.initicon()
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            var lightIcon = this.lightIcon = new feng3d.GameObject().value({
                name: "Icon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: editorCamera },
                    {
                        __class__: "feng3d.Model", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                        material: {
                            __class__: "feng3d.TextureMaterial",
                            uniforms: {
                                s_texture: {
                                    url: editorData.getEditorAssetsPath("assets/3d/icons/light.png"),
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                },
                            },
                            renderParams: { enableBlend: true },
                        },
                    },
                ],
            });
            this.textureMaterial = <any>lightIcon.getComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this.lightLines = new feng3d.GameObject().value({
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                    __class__: "feng3d.Model", material: {
                        __class__: "feng3d.SegmentMaterial",
                        uniforms: {
                            u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 },
                        }, renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true, }
                    },
                    geometry: { __class__: "feng3d.SegmentGeometry" },
                }]
            });
            this.segmentGeometry = <any>lightLines.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this.lightpoints = new feng3d.GameObject().value({
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                    __class__: "feng3d.Model",
                    geometry: {
                        __class__: "feng3d.PointGeometry",
                        points: [
                            { position: { __class__: "feng3d.Vector3", x: 1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                            { position: { __class__: "feng3d.Vector3", x: -1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                            { position: { __class__: "feng3d.Vector3", y: 1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                            { position: { __class__: "feng3d.Vector3", y: -1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                            { position: { __class__: "feng3d.Vector3", z: 1 }, color: { __class__: "feng3d.Color4", b: 1 } },
                            { position: { __class__: "feng3d.Vector3", z: -1 }, color: { __class__: "feng3d.Color4", b: 1 } }],
                    },
                    material: {
                        __class__: "feng3d.PointMaterial", uniforms: { u_PointSize: 5 }, renderParams: { renderMode: feng3d.RenderMode.POINTS, enableBlend: true, },
                    },
                }],
            });
            this.pointGeometry = <any>lightpoints.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightpoints);

            this.enabled = true;
        }

        update()
        {
            if (!this.light) return;

            this.textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this.lightLines.transform.scale =
                this.lightpoints.transform.scale =
                new feng3d.Vector3(this.light.range, this.light.range, this.light.range);

            if (editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1)
            {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(editorCamera.gameObject.transform.scenePosition);
                //
                var segments: feng3d.Segment[] = [];
                var alpha = 1;
                var backalpha = 0.5;
                var num = 36;
                var point0: feng3d.Vector3;
                var point1: feng3d.Vector3;
                for (var i = 0; i < num; i++)
                {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(0, x, y);
                    point1 = new feng3d.Vector3(0, x1, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 0, 0, alpha), endColor: new feng3d.Color4(1, 0, 0, alpha) });
                    point0 = new feng3d.Vector3(x, 0, y);
                    point1 = new feng3d.Vector3(x1, 0, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 1, 0, alpha), endColor: new feng3d.Color4(0, 1, 0, alpha) });
                    point0 = new feng3d.Vector3(x, y, 0);
                    point1 = new feng3d.Vector3(x1, y1, 0);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 0, 1, alpha), endColor: new feng3d.Color4(0, 0, 1, alpha) });
                }
                this.segmentGeometry.segments = segments;

                this.pointGeometry.points = [];
                var point = new feng3d.Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                point = new feng3d.Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                //
                this.lightLines.visible = true;
                this.lightpoints.visible = true;
            } else
            {
                this.lightLines.visible = false;
                this.lightpoints.visible = false;
            }
        }

        dispose()
        {
            this.enabled = false;
            this.textureMaterial = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightpoints.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            this.lightpoints = null;
            this.segmentGeometry = null;
            super.dispose();
        }

        //
        private lightIcon: feng3d.GameObject;
        private lightLines: feng3d.GameObject;
        private lightpoints: feng3d.GameObject;
        private textureMaterial: feng3d.TextureMaterial;
        private segmentGeometry: feng3d.SegmentGeometry;
        private pointGeometry: feng3d.PointGeometry;

        private onLightChanged(property: string, oldValue: feng3d.PointLight, value: feng3d.PointLight)
        {
            if (oldValue)
            {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value)
            {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        }

        private onScenetransformChanged()
        {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        }

        private onMousedown()
        {
            editorData.selectObject(this.light.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, () =>
            {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        }
    }
}