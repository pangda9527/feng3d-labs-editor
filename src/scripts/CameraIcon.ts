namespace editor
{
    export class CameraIcon extends EditorScript
    {
        @feng3d.watch("onCameraChanged")
        camera: feng3d.Camera;

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
                        __class__: "feng3d.Model", material: {
                            __class__: "feng3d.TextureMaterial",
                            uniforms: {
                                s_texture: {
                                    url: editorData.getEditorAssetsPath("assets/3d/icons/camera.png"),
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                }
                            },
                            renderParams: { enableBlend: true },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this.lightLines = new feng3d.GameObject().value({
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                    __class__: "feng3d.Model", material: {
                        __class__: "feng3d.SegmentMaterial",
                        uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                        renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                    },
                    geometry: { __class__: "feng3d.SegmentGeometry" },
                },
                ],
            });
            this.segmentGeometry = <any>lightLines.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this.lightpoints = new feng3d.GameObject().value({
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.Model",
                        material: { __class__: "feng3d.PointMaterial", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this.pointGeometry = <any>lightpoints.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightpoints);

            this.enabled = true;
        }

        update()
        {
            if (!this.camera) return;

            if (editorData.selectedGameObjects.indexOf(this.camera.gameObject) != -1)
            {
                if (this.lensChanged)
                {
                    //
                    var points: feng3d.PointInfo[] = [];
                    var segments: feng3d.Segment[] = [];
                    var lens = this.camera.lens;
                    var near = lens.near;
                    var far = lens.far;
                    if (lens instanceof feng3d.PerspectiveLens)
                    {
                        var fov = lens.fov;
                        var aspect = lens.aspect;
                        var tan = Math.tan(fov * Math.PI / 360);

                        var nearLeft = -tan * near * aspect;
                        var nearRight = tan * near * aspect;
                        var nearTop = tan * near;
                        var nearBottom = -tan * near;
                        var farLeft = -tan * far * aspect;
                        var farRight = tan * far * aspect;
                        var farTop = tan * far;
                        var farBottom = -tan * far;
                        //
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
                    }
                    this.pointGeometry.points = points;
                    this.segmentGeometry.segments = segments;
                    this.lensChanged = false;
                }
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
        private segmentGeometry: feng3d.SegmentGeometry;
        private pointGeometry: feng3d.PointGeometry;
        private lensChanged = true;

        private onCameraChanged(property: string, oldValue: feng3d.Camera, value: feng3d.Camera)
        {
            if (oldValue)
            {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
                value.off("lensChanged", this.onLensChanged, this);
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
            this.lensChanged = true;
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