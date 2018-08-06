namespace editor
{
    export class DirectionLightIcon extends EditorScript
    {
        get light()
        {
            return this._light;
        }
        set light(v)
        {
            if (this._light)
            {
                this._light.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            this._light = v;
            if (this._light)
            {
                this.onScenetransformChanged();
                this._light.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        }

        private _light: feng3d.DirectionalLight;

        private lightIcon: feng3d.GameObject;
        private lightLines: feng3d.GameObject;
        private textureMaterial: feng3d.TextureMaterial;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            var linesize = 10;

            var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = editorCamera;
            var model = lightIcon.addComponent(feng3d.Model);
            model.geometry = new feng3d.PlaneGeometry({ width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false });
            var textureMaterial = this.textureMaterial = model.material = feng3d.materialFactory.create("texture");
            var texture = new feng3d.UrlImageTexture2D();
            texture.url = editorData.getEditorAssetsPath("assets/3d/icons/sun.png");
            texture.format = feng3d.TextureFormat.RGBA;
            texture.premulAlpha = true;
            textureMaterial.uniforms.s_texture = texture;
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var holdSizeComponent = lightLines.addComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.camera = editorCamera;
            holdSizeComponent.holdSize = 1;
            var model = lightLines.addComponent(feng3d.Model);
            var material = model.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
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