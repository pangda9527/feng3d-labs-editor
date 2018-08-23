namespace editor
{
    export class DirectionLightIcon extends EditorScript
    {
        @feng3d.watch("onLightChanged")
        light: feng3d.DirectionalLight;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            var linesize = 10;

            var lightIcon = this.lightIcon = new feng3d.GameObject().value({
                name: "Icon", components: [{ __class__: "feng3d.BillboardComponent", camera: editorCamera },
                {
                    __class__: "feng3d.Model", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false },
                    material: { __class__: "feng3d.TextureMaterial", uniforms: { s_texture: { __class__: "feng3d.UrlImageTexture2D", url: editorData.getEditorAssetsPath("assets/3d/icons/sun.png"), format: feng3d.TextureFormat.RGBA, premulAlpha: true, } }, renderParams: { enableBlend: true } },
                },],
            });
            this.textureMaterial = <any>lightIcon.addComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this.lightLines = new feng3d.GameObject().value({
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{ __class__: "feng3d.HoldSizeComponent", camera: editorCamera, holdSize: 1 }],
            });
            var model = lightLines.addComponent(feng3d.Model).value({});
            var material = model.material = new feng3d.SegmentMaterial().value({ renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(163 / 255, 162 / 255, 107 / 255);
            var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            var num = 10;
            for (var i = 0; i < num; i++)
            {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segmentGeometry.segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x, y, linesize * 5) });
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
                segmentGeometry.segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            this.gameObject.addChild(lightLines);

            this.enabled = true;
        }

        update()
        {
            if (!this.light) return;

            this.textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this.lightLines.visible = editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
        }

        dispose()
        {
            this.enabled = false;
            this.textureMaterial = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            super.dispose();
        }

        private lightIcon: feng3d.GameObject;
        private lightLines: feng3d.GameObject;
        private textureMaterial: feng3d.TextureMaterial;

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