declare global
{
    export interface MixinsComponentMap { DirectionLightIcon: editor.DirectionLightIcon; }
}

@feng3d.RegisterComponent()
export class DirectionLightIcon extends EditorScript
{
    __class__: "editor.DirectionLightIcon";

    light: feng3d.DirectionalLight;

    get editorCamera() { return this._editorCamera; }
    set editorCamera(v) { this._editorCamera = v; this.initicon(); }
    private _editorCamera: feng3d.Camera;

    init()
    {
        super.init();
        feng3d.watcher.watch(<DirectionLightIcon>this, "light", this.onLightChanged, this);
        this.initicon();
        this.on("mousedown", this.onMousedown, this);
    }

    initicon()
    {
        if (!this._editorCamera) return;

        var linesize = 20;

        {
            const lightIcon = this._lightIcon = new feng3d.GameObject();
            lightIcon.name = "DirectionLightIcon";
            const billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = this.editorCamera;
            const meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
            const geometry = meshRenderer.geometry = new feng3d.PlaneGeometry();
            geometry.width = 1;
            geometry.height = 1;
            geometry.segmentsH = 1;
            geometry.segmentsW = 1;
            geometry.yUp = false;
            const material = meshRenderer.material = new feng3d.Material();
            material.shaderName = "texture";
            const uniforms = material.uniforms as feng3d.TextureUniforms;
            const texture = uniforms.s_texture = new feng3d.Texture2D();
            texture.source = { url: editorData.getEditorAssetPath("assets/3d/icons/sun.png") };
            texture.format = feng3d.TextureFormat.RGBA;
            texture.premulAlpha = true;
            material.renderParams.enableBlend = true;
            this._textureMaterial = material;
            this.gameObject.addChild(lightIcon);
        }

        //
        var num = 10;
        var segments: feng3d.Segment[] = [];
        for (var i = 0; i < num; i++)
        {
            var angle = i * Math.PI * 2 / num;
            var x = Math.sin(angle) * linesize;
            var y = Math.cos(angle) * linesize;
            const segment = new feng3d.Segment();
            segment.start = new feng3d.Vector3(x, y, 0);
            segment.end = new feng3d.Vector3(x, y, linesize * 5);
            segments.push(segment);
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
            const segment = new feng3d.Segment();
            segment.start = new feng3d.Vector3(x, y, 0);
            segment.end = new feng3d.Vector3(x1, y1, 0);
            segments.push(segment);
        }
        {
            const lightLines = this._lightLines = new feng3d.GameObject();
            lightLines.name = "Lines";
            lightLines.mouseEnabled = false;
            lightLines.hideFlags = feng3d.HideFlags.Hide;
            const holdSizeComponent = lightLines.addComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.camera = this.editorCamera;
            holdSizeComponent.holdSize = 0.005;
            const meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            const material = meshRenderer.material = new feng3d.Material();
            material.shaderName = "segment";
            const uniforms = material.uniforms as feng3d.SegmentUniforms;
            uniforms.u_segmentColor = new feng3d.Color4(163 / 255, 162 / 255, 107 / 255);
            material.renderParams.renderMode = feng3d.RenderMode.LINES;
            const geometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            geometry.segments = segments;
            this.gameObject.addChild(lightLines);
        }

        this.enabled = true;
    }

    update()
    {
        if (!this.light) return;

        (<feng3d.TextureUniforms>this._textureMaterial.uniforms).u_color = this.light.color.toColor4();
        this._lightLines.activeSelf = editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
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

    private onLightChanged(newValue: feng3d.DirectionalLight, oldValue: feng3d.DirectionalLight)
    {
        if (oldValue)
        {
            oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
        }
        if (newValue)
        {
            this.onScenetransformChanged();
            newValue.on("scenetransformChanged", this.onScenetransformChanged, this);
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
