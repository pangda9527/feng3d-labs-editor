namespace feng3d
{
    export interface ComponentMap { DirectionLightIcon: editor.DirectionLightIcon; }
}

namespace editor
{
    export class DirectionLightIcon extends EditorScript
    {
        __class__: "editor.DirectionLightIcon";

        @feng3d.watch("onLightChanged")
        light: feng3d.DirectionalLight;

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.initicon(); }
        private _editorCamera: feng3d.Camera;

        init()
        {
            super.init();
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            if (!this._editorCamera) return;

            var linesize = 20;

            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "DirectionLightIcon", components: [{ __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                {
                    __class__: "feng3d.MeshModel", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false },
                    material: {
                        __class__: "feng3d.Material",
                        shaderName: "texture",
                        uniforms: { s_texture: { __class__: "feng3d.Texture2D", source: { url: editorData.getEditorAssetPath("assets/3d/icons/sun.png") }, format: feng3d.TextureFormat.RGBA, premulAlpha: true, }, }, renderParams: { enableBlend: true }
                    },
                },],
            });
            this._textureMaterial = <any>lightIcon.addComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);

            //
            var num = 10;
            var segments: Partial<feng3d.Segment>[] = [];
            for (var i = 0; i < num; i++)
            {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x, y, linesize * 5) });
            }
            num = 36;
            for (var i = 0; i < num; i++)
            {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1) * linesize;
                var y1 = Math.cos(angle1) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{ __class__: "feng3d.HoldSizeComponent", camera: this.editorCamera, holdSize: 0.005 },
                {
                    __class__: "feng3d.MeshModel",
                    material: { __class__: "feng3d.Material", shaderName: "segment", uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 163 / 255, g: 162 / 255, b: 107 / 255 } }, renderParams: { renderMode: feng3d.RenderMode.LINES } },
                    geometry: { __class__: "feng3d.SegmentGeometry", segments: segments },
                },],
            });
            this.gameObject.addChild(lightLines);

            this.enabled = true;
        }

        update()
        {
            if (!this.light) return;

            (<feng3d.TextureUniforms>this._textureMaterial.uniforms).u_color = this.light.color.toColor4();
            this._lightLines.visible = editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
        }

        dispose()
        {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            super.dispose();
        }

        private _lightIcon: feng3d.GameObject;
        private _lightLines: feng3d.GameObject;
        private _textureMaterial: feng3d.Material;

        private onLightChanged(property: string, oldValue: feng3d.DirectionalLight, value: feng3d.DirectionalLight)
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
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, () =>
            {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        }
    }
}