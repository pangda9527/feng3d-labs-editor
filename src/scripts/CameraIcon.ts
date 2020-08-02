namespace editor
{
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

            var lightIcon = this._lightIcon = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "CameraIcon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: this.editorCamera },
                    {
                        __class__: "feng3d.MeshRenderer", material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.Texture2D",
                                    source: { url: editorData.getEditorAssetPath("assets/3d/icons/camera.png") },
                                    format: feng3d.TextureFormat.RGBA,
                                    // premulAlpha: true,
                                }
                            },
                            renderParams: { enableBlend: true, depthMask: false },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this._lightLines = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                    __class__: "feng3d.MeshRenderer", material: {
                        __class__: "feng3d.Material",
                        shaderName: "segment",
                        uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                        renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                    },
                    geometry: { __class__: "feng3d.SegmentGeometry" },
                },
                ],
            });
            this._segmentGeometry = <any>lightLines.getComponent(feng3d.Renderer).geometry;
            this.gameObject.addChild(lightLines);
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
            this._pointGeometry = <any>lightpoints.getComponent(feng3d.Renderer).geometry;
            this.gameObject.addChild(lightpoints);

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

        private onCameraChanged(property: string, oldValue: feng3d.Camera, value: feng3d.Camera)
        {
            if (oldValue)
            {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
                oldValue.off("lensChanged", this.onLensChanged, this);
            }
            if (value)
            {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
                value.on("lensChanged", this.onLensChanged, this);
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
}