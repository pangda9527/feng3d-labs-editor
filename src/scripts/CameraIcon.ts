import { RegisterComponent, Camera, watcher, GameObject, BillboardComponent, MeshRenderer, Material, TextureUniforms, Texture2D, TextureFormat, PlaneGeometry, HideFlags, SegmentUniforms, Color4, RenderMode, SegmentGeometry, PointUniforms, PointGeometry, PointInfo, Segment, PerspectiveLens, OrthographicLens, Vector3, shortcut, ticker } from 'feng3d';
import { editorData } from '../Editor';
import { EditorScript } from './EditorScript';

declare global
{
    export interface MixinsComponentMap { CameraIcon: CameraIcon; }
}

@RegisterComponent()
export class CameraIcon extends EditorScript
{
    camera: Camera;

    get editorCamera() { return this._editorCamera; }
    set editorCamera(v) { this._editorCamera = v; this.initicon(); }
    private _editorCamera: Camera;

    init()
    {
        super.init();
        watcher.watch(<CameraIcon>this, "camera", this.onCameraChanged, this);
        this.initicon()
        this.on("mousedown", this.onMousedown, this);
    }

    initicon()
    {
        if (!this.editorCamera) return;
        if (this._lightIcon) return;

        {
            const lightIcon = this._lightIcon = new GameObject();
            lightIcon.name = "CameraIcon";
            const billboardComponent = lightIcon.addComponent(BillboardComponent);
            billboardComponent.camera = this.editorCamera;
            const meshRenderer = lightIcon.addComponent(MeshRenderer);
            const material = meshRenderer.material = new Material();
            material.shaderName = "texture";
            const uniforms = material.uniforms as TextureUniforms;
            uniforms.s_texture = new Texture2D();
            uniforms.s_texture.source = { url: editorData.getEditorAssetPath("assets/3d/icons/camera.png") };
            uniforms.s_texture.format = TextureFormat.RGBA;
            material.renderParams.enableBlend = true;
            material.renderParams.depthMask = false;
            const geometry = meshRenderer.geometry = new PlaneGeometry();
            geometry.width = 1;
            geometry.height = 1;
            geometry.segmentsW = 1;
            geometry.segmentsH = 1;
            geometry.yUp = false;
            this.gameObject.addChild(lightIcon);
        }

        //
        {
            const lightLines = this._lightLines = new GameObject();
            lightLines.name = "Lines";
            lightLines.mouseEnabled = false;
            lightLines.hideFlags = HideFlags.Hide;
            const meshRenderer = lightLines.addComponent(MeshRenderer);
            const material = meshRenderer.material = new Material();
            material.shaderName = "segment";
            const uniforms = material.uniforms as SegmentUniforms;
            uniforms.u_segmentColor = new Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            material.renderParams.renderMode = RenderMode.LINES;
            meshRenderer.geometry = new SegmentGeometry();
            this._segmentGeometry = meshRenderer.geometry;
            this.gameObject.addChild(lightLines);
        }

        //
        {
            const lightpoints = this._lightpoints = new GameObject();
            lightpoints.name = "points";
            lightpoints.mouseEnabled = false;
            lightpoints.hideFlags = HideFlags.Hide;
            const meshRenderer = lightpoints.addComponent(MeshRenderer);
            const material = meshRenderer.material = new Material();
            material.shaderName = "point";
            const uniforms = material.uniforms as PointUniforms;
            uniforms.u_PointSize = 5;
            material.renderParams.enableBlend = true;
            material.renderParams.renderMode = RenderMode.POINTS;
            meshRenderer.geometry = new PointGeometry();
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
                var points: PointInfo[] = [];
                var segments: Partial<Segment>[] = [];
                var lens = this.camera.lens;
                var near = lens.near;
                var far = lens.far;
                var aspect = lens.aspect;
                if (lens instanceof PerspectiveLens)
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
                } else if (lens instanceof OrthographicLens)
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
                points.push({ position: new Vector3(0, farBottom, far) }, { position: new Vector3(0, farTop, far) }, { position: new Vector3(farLeft, 0, far) }, { position: new Vector3(farRight, 0, far) });
                segments.push(
                    { start: new Vector3(nearLeft, nearBottom, near), end: new Vector3(nearRight, nearBottom, near) },
                    { start: new Vector3(nearLeft, nearBottom, near), end: new Vector3(nearLeft, nearTop, near) },
                    { start: new Vector3(nearLeft, nearTop, near), end: new Vector3(nearRight, nearTop, near) },
                    { start: new Vector3(nearRight, nearBottom, near), end: new Vector3(nearRight, nearTop, near) },
                    //
                    { start: new Vector3(nearLeft, nearBottom, near), end: new Vector3(farLeft, farBottom, far) },
                    { start: new Vector3(nearLeft, nearTop, near), end: new Vector3(farLeft, farTop, far) },
                    { start: new Vector3(nearRight, nearBottom, near), end: new Vector3(farRight, farBottom, far) },
                    { start: new Vector3(nearRight, nearTop, near), end: new Vector3(farRight, farTop, far) },
                    //
                    { start: new Vector3(farLeft, farBottom, far), end: new Vector3(farRight, farBottom, far) },
                    { start: new Vector3(farLeft, farBottom, far), end: new Vector3(farLeft, farTop, far) },
                    { start: new Vector3(farLeft, farTop, far), end: new Vector3(farRight, farTop, far) },
                    { start: new Vector3(farRight, farBottom, far), end: new Vector3(farRight, farTop, far) },
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
    private _lightIcon: GameObject;
    private _lightLines: GameObject;
    private _lightpoints: GameObject;
    private _segmentGeometry: SegmentGeometry;
    private _pointGeometry: PointGeometry;
    private _lensChanged = true;

    private onCameraChanged(newValue: Camera, oldValue: Camera)
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
        shortcut.activityState("selectInvalid");
        ticker.once(100, () =>
        {
            shortcut.deactivityState("selectInvalid");
        });
    }
}
