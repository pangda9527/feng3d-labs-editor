namespace feng3d { export interface ComponentMap { SpotLightIcon: editor.SpotLightIcon; } }

namespace editor
{
    @feng3d.RegisterComponent()
    export class SpotLightIcon extends EditorScript
    {
        @feng3d.watch("onLightChanged")
        light: feng3d.SpotLight;

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        private _editorCamera: feng3d.Camera;

        init()
        {
            super.init();
            this.initicon()
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            if (!this._editorCamera) return;
            {
                const lightIcon = this._lightIcon = new feng3d.GameObject();
                lightIcon.name = "SpotLightIcon";
                const billboardComponent = lightIcon.addComponent("BillboardComponent");
                billboardComponent.camera = this.editorCamera;
                const meshRenderer = lightIcon.addComponent("MeshRenderer");
                const material = meshRenderer.material = new feng3d.Material();
                material.shaderName = "texture";
                const uniforms = material.uniforms as feng3d.TextureUniforms;
                const texture = uniforms.s_texture = new feng3d.Texture2D();
                texture.source = { url: editorData.getEditorAssetPath("assets/3d/icons/spot.png") };
                texture.format = feng3d.TextureFormat.RGBA;
                texture.premulAlpha = true;
                material.renderParams.enableBlend = true;
                const geometry = meshRenderer.geometry = new feng3d.PlaneGeometry();
                geometry.width = 1;
                geometry.height = 1;
                geometry.segmentsW = 1;
                geometry.segmentsH = 1;
                geometry.yUp = false;
                this._textureMaterial = material;
                this.gameObject.addChild(lightIcon);
            }

            //
            {
                const lightLines = this._lightLines = new feng3d.GameObject();
                lightLines.name = "Lines";
                lightLines.mouseEnabled = false;
                lightLines.hideFlags = feng3d.HideFlags.Hide;
                const meshRenderer = lightLines.addComponent("MeshRenderer");
                const material = meshRenderer.material = new feng3d.Material();
                material.shaderName = "segment";
                const uniforms = material.uniforms as feng3d.SegmentUniforms;
                uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.5);
                material.renderParams.enableBlend = true;
                material.renderParams.renderMode = feng3d.RenderMode.LINES;
                const geometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this._segmentGeometry = geometry;
                this.gameObject.addChild(lightLines);
            }
            //
            var lightpoints = this._lightpoints = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.MeshRenderer",
                        material: { __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this._pointGeometry = <any>lightpoints.getComponent("Renderable").geometry;
            this.gameObject.addChild(lightpoints);

            this.enabled = true;
        }

        update()
        {
            if (!this.light) return;

            (<feng3d.TextureUniforms>this._textureMaterial.uniforms).u_color = this.light.color.toColor4();

            if (editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1)
            {
                //
                var points: feng3d.PointInfo[] = [];
                var segments: feng3d.Segment[] = [];
                var num = 36;
                var point0: feng3d.Vector3;
                var point1: feng3d.Vector3;
                var radius = this.light.range * Math.tan(this.light.angle * Math.DEG2RAD * 0.5);
                var distance = this.light.range;
                for (var i = 0; i < num; i++)
                {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(x * radius, y * radius, distance);
                    point1 = new feng3d.Vector3(x1 * radius, y1 * radius, distance);
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                }

                //
                points.push({ position: new feng3d.Vector3(0, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, -radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, -radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(-radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(-radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });

                this._pointGeometry.points = points;
                this._segmentGeometry.segments = segments;
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

        private onLightChanged(property: string, oldValue: feng3d.SpotLight, value: feng3d.SpotLight)
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