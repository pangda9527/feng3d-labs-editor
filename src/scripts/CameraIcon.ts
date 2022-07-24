declare global
{
    export interface MixinsComponentMap { CameraIcon: editor.CameraIcon; }
}

@feng3d.RegisterComponent()
export class CameraIcon extends EditorScript
{
    camera: feng3d.Camera;

    get editorCamera() { return this._editorCamera; }
    set editorCamera(v) { this._editorCamera = v; this.initicon(); }
    private _editorCamera: feng3d.Camera;

    init()
    {
        super.init();
        feng3d.watcher.watch(<CameraIcon>this, "camera", this.onCameraChanged, this);
        this.initicon()
        this.on("mousedown", this.onMousedown, this);
    }

    initicon()
    {
        if (!this.editorCamera) return;
        if (this._lightIcon) return;

        {
            const lightIcon = this._lightIcon = new feng3d.GameObject();
            lightIcon.name = "CameraIcon";
            const billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = this.editorCamera;
            const meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
            const material = meshRenderer.material = new feng3d.Material();
            material.shaderName = "texture";
            const uniforms = material.uniforms as feng3d.TextureUniforms;
            uniforms.s_texture = new feng3d.Texture2D();
            uniforms.s_texture.source = { url: editorData.getEditorAssetPath("assets/3d/icons/camera.png") };
            uniforms.s_texture.format = feng3d.TextureFormat.RGBA;
            material.renderParams.enableBlend = true;
            material.renderParams.depthMask = false;
            const geometry = meshRenderer.geometry = new feng3d.PlaneGeometry();
            geometry.width = 1;
            geometry.height = 1;
            geometry.segmentsW = 1;
            geometry.segmentsH = 1;
            geometry.yUp = false;
            this.gameObject.addChild(lightIcon);
        }

        //
        {
            const lightLines = this._lightLines = new feng3d.GameObject();
            lightLines.name = "Lines";
            lightLines.mouseEnabled = false;
            lightLines.hideFlags = feng3d.HideFlags.Hide;
            const meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            const material = meshRenderer.material = new feng3d.Material();
            material.shaderName = "segment";
            const uniforms = material.uniforms as feng3d.SegmentUniforms;
            uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            material.renderParams.renderMode = feng3d.RenderMode.LINES;
            meshRenderer.geometry = new feng3d.SegmentGeometry();
            this._segmentGeometry = meshRenderer.geometry;
            this.gameObject.addChild(lightLines);
        }

        //
        {
            const lightpoints = this._lightpoints = new feng3d.GameObject();
            lightpoints.name = "points";
            lightpoints.mouseEnabled = false;
            lightpoints.hideFlags = feng3d.HideFlags.Hide;
            const meshRenderer = lightpoints.addComponent(feng3d.MeshRenderer);
            const material = meshRenderer.material = new feng3d.Material();
            material.shaderName = "point";
            const uniforms = material.uniforms as feng3d.PointUniforms;
            uniforms.u_PointSize = 5;
            material.renderParams.enableBlend = true;
            material.renderParams.renderMode = feng3d.RenderMode.POINTS;
            meshRenderer.geometry = new feng3d.PointGeometry();
            this._pointGeometry = meshRenderer.geometry;
            this.gameObject.addChild(lightpoints);
        }

        this.enabled = true;
    }

    update()
    {
        if (!this.camera) return;

        if (editorData.selectedGameObjects.indexOf(this.camera.gameObject) != -1)
        {
            if (this._lensChanged)
            {
                //
                var points: feng3d.PointInfo[] = [];
                var segments: Partial<feng3d.Segment>[] = [];
                var lens = this.camera.lens;
                var near = lens.near;
                var far = lens.far;
                var aspect = lens.aspect;
                if (lens instanceof feng3d.PerspectiveLens)
                {
                    var fov = lens.fov;
                    var tan = Math.tan(fov * Math.PI / 360);
                    //
                    var nearLeft = -tan * near * aspect;
                    var nearRight = tan * near * aspect;
                    var nearTop = tan * near;
                    var nearBottom = -tan * near;
                    var farLeft = -tan * far * aspect;
                    var farRight = tan * far * aspect;
                    var farTop = tan * far;
                    var farBottom = -tan * far;
                    //
                } else if (lens instanceof feng3d.OrthographicLens)
                {
                    var size = lens.size;
                    //
                    var nearLeft = -size * aspect;
                    var nearRight = size;
                    var nearTop = size;
                    var nearBottom = -size;
                    var farLeft = -size;
                    var farRight = size;
                    var farTop = size;
                    var farBottom = -size;
                }
                points.push({ position: new feng3d.Vector3(0, farBottom, far) }, { position: new feng3d.Vector3(0, farTop, far) }, { position: new feng3d.Vector3(farLeft, 0, far) }, { position: new feng3d.Vector3(farRight, 0, far) });
                segments.push(
                    { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearRight, nearBottom, near) },
                    { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearLeft, nearTop, near) },
                    { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(nearRight, nearTop, near) },
                    { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(nearRight, nearTop, near) },
                    //
                    { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(farLeft, farBottom, far) },
                    { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(farLeft, farTop, far) },
                    { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(farRight, farBottom, far) },
                    { start: new feng3d.Vector3(nearRight, nearTop, near), end: new feng3d.Vector3(farRight, farTop, far) },
                    //
                    { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farRight, farBottom, far) },
                    { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farLeft, farTop, far) },
                    { start: new feng3d.Vector3(farLeft, farTop, far), end: new feng3d.Vector3(farRight, farTop, far) },
                    { start: new feng3d.Vector3(farRight, farBottom, far), end: new feng3d.Vector3(farRight, farTop, far) },
                );
                this._pointGeometry.points = points;
                this._segmentGeometry.segments.length = 0;
                segments.forEach(v =>
                {
                    this._segmentGeometry.addSegment(v);
                })
                this._lensChanged = false;
            }
            //
            this._lightLines.activeSelf = true;
            this._lightpoints.activeSelf = true;
        } else
        {
            this._lightLines.activeSelf = false;
            this._lightpoints.activeSelf = false;
        }
    }

    dispose()
    {
        this.enabled = false;
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
    private _segmentGeometry: feng3d.SegmentGeometry;
    private _pointGeometry: feng3d.PointGeometry;
    private _lensChanged = true;

    private onCameraChanged(newValue: feng3d.Camera, oldValue: feng3d.Camera)
    {
        if (oldValue)
        {
            oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            oldValue.off("lensChanged", this.onLensChanged, this);
        }
        if (newValue)
        {
            this.onScenetransformChanged();
            newValue.on("scenetransformChanged", this.onScenetransformChanged, this);
            newValue.on("lensChanged", this.onLensChanged, this);
        }
    }

    private onLensChanged()
    {
        this._lensChanged = true;
    }

    private onScenetransformChanged()
    {
        this.transform.localToWorldMatrix = this.camera.transform.localToWorldMatrix;
    }

    private onMousedown()
    {
        editorData.selectObject(this.camera.gameObject);
        // 防止再次调用鼠标拾取
        feng3d.shortcut.activityState("selectInvalid");
        feng3d.ticker.once(100, () =>
        {
            feng3d.shortcut.deactivityState("selectInvalid");
        });
    }
}
