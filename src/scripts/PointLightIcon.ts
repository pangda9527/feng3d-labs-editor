namespace editor
{
    export class PointLightIcon extends EditorScript
    {
        light: feng3d.PointLight;

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        private _editorCamera: feng3d.Camera;

        init()
        {
            super.init();
            feng3d.watcher.watch(<PointLightIcon>this, "light", this.onLightChanged, this);
            this.initicon()
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            if (!this._editorCamera) return;

            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "PointLightIcon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                    {
                        __class__: "feng3d.MeshRenderer", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                        material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.Texture2D",
                                    source: { url: editorData.getEditorAssetPath("assets/3d/icons/light.png") },
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                },
                            },
                            renderParams: { enableBlend: true },
                        },
                    },
                ],
            });
            this._textureMaterial = <any>lightIcon.getComponent(feng3d.Renderer).material;
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                    __class__: "feng3d.MeshRenderer", material: {
                        __class__: "feng3d.Material",
                        shaderName: "segment",
                        uniforms: {
                            u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 },
                        }, renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true, }
                    },
                    geometry: { __class__: "feng3d.SegmentGeometry" },
                }]
            });
            this._segmentGeometry = <any>lightLines.getComponent(feng3d.Renderer).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                    __class__: "feng3d.MeshRenderer",
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
                        __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { renderMode: feng3d.RenderMode.POINTS, enableBlend: true, },
                    },
                }],
            });
            this._pointGeometry = <any>lightpoints.getComponent(feng3d.Renderer).geometry;
            this.gameObject.addChild(lightpoints);

            this.enabled = true;
        }

        update()
        {
            if (!this.light) return;
            if (!this.editorCamera) return;

            (<feng3d.TextureUniforms>this._textureMaterial.uniforms).u_color = this.light.color.toColor4();
            this._lightLines.transform.scale =
                this._lightpoints.transform.scale =
                new feng3d.Vector3(this.light.range, this.light.range, this.light.range);

            if (editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1)
            {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(this.editorCamera.gameObject.transform.worldPosition);
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
                this._segmentGeometry.segments = segments;

                this._pointGeometry.points = [];
                var point = new feng3d.Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                point = new feng3d.Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            } else
            {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        }

        dispose()
        {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            super.dispose();
        }

        //
        private _lightIcon: feng3d.GameObject;
        private _lightLines: feng3d.GameObject;
        private _lightpoints: feng3d.GameObject;
        private _textureMaterial: feng3d.Material;
        private _segmentGeometry: feng3d.SegmentGeometry;
        private _pointGeometry: feng3d.PointGeometry;

        private onLightChanged(object: PointLightIcon, property: string, oldValue: feng3d.PointLight)
        {
            var value: feng3d.PointLight = object[property];
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