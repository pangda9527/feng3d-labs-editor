namespace editor
{
    export class SpotLightIcon extends EditorScript
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

        private _light: feng3d.SpotLight;

        private lightIcon: feng3d.GameObject;
        private lightLines: feng3d.GameObject;
        private lightLines1: feng3d.GameObject;
        private lightpoints: feng3d.GameObject;
        private textureMaterial: feng3d.TextureMaterial;
        private segmentGeometry: feng3d.SegmentGeometry;
        private pointGeometry: feng3d.PointGeometry;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);
            this.initicon()
            this.on("mousedown", this.onMousedown, this);
        }

        initicon()
        {
            var size = 1;

            var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = editorCamera;
            var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.PlaneGeometry({ width: size, height: size, segmentsW: 1, segmentsH: 1, yUp: false });
            var textureMaterial = this.textureMaterial = meshRenderer.material = feng3d.materialFactory.create("texture",
                {
                    uniforms: {
                        s_texture: {
                            url: editorData.getEditorAssetsPath("assets/3d/icons/spot.png"),
                            format: feng3d.TextureFormat.RGBA,
                            premulAlpha: true,
                        }
                    }
                });
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);
            // this.lightIcon.on("click", () =>
            // {
            //     editor3DData.selectObject(this.gameObject);
            // });

            //
            var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var lightLines1 = this.lightLines1 = feng3d.GameObject.create("Lines1");
            lightLines1.addComponent(feng3d.BillboardComponent).camera = editorCamera;
            lightLines1.mouseEnabled = false;
            lightLines1.serializable = false;
            lightLines1.showinHierarchy = false;
            var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            var meshRenderer1 = lightLines1.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            // material.color = new Color(163 / 255, 162 / 255, 107 / 255);
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            var material = meshRenderer1.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            // material.color = new Color(163 / 255, 162 / 255, 107 / 255);
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            var segmentGeometry = this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            var segmentGeometry1 = meshRenderer1.geometry = new feng3d.SegmentGeometry();
            var num = 36;
            for (var i = 0; i < num; i++)
            {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle);
                var y = Math.cos(angle);
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1);
                var y1 = Math.cos(angle1);
                segmentGeometry.segments.push(
                    { start: new feng3d.Vector3(0, x, y), end: new feng3d.Vector3(0, x1, y1) },
                    { start: new feng3d.Vector3(x, 0, y), end: new feng3d.Vector3(x1, 0, y1) },
                    { start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) },
                    { start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            this.gameObject.addChild(lightLines);
            this.gameObject.addChild(lightLines1);
            //
            var lightpoints = this.lightpoints = feng3d.GameObject.create("points");
            lightpoints.mouseEnabled = false;
            lightpoints.serializable = false;
            lightpoints.showinHierarchy = false;
            var meshRenderer = lightpoints.addComponent(feng3d.MeshRenderer);
            var pointGeometry = this.pointGeometry = meshRenderer.geometry = new feng3d.PointGeometry();
            pointGeometry.points = [
                { position: new feng3d.Vector3(1, 0, 0), color: new feng3d.Color4(1, 0, 0) },
                { position: new feng3d.Vector3(-1, 0, 0), color: new feng3d.Color4(1, 0, 0) },
                { position: new feng3d.Vector3(0, -1, 0), color: new feng3d.Color4(0, 1, 0) },
                { position: new feng3d.Vector3(0, 0, 1), color: new feng3d.Color4(0, 0, 1) },
                { position: new feng3d.Vector3(0, 0, -1), color: new feng3d.Color4(0, 0, 1) }];
            var pointMaterial = meshRenderer.material = feng3d.materialFactory.create("point", { renderParams: { renderMode: feng3d.RenderMode.POINTS } });
            pointMaterial.renderParams.enableBlend = true;
            pointMaterial.uniforms.u_PointSize = 5;
            // pointMaterial.color = new Color(163 / 255 * 1.2, 162 / 255 * 1.2, 107 / 255 * 1.2);
            this.gameObject.addChild(lightpoints);

            this.enabled = true;
        }

        update()
        {
            this.textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this.lightLines.transform.scale =
                this.lightLines1.transform.scale =
                this.lightpoints.transform.scale =
                new feng3d.Vector3(this.light.range, this.light.range, this.light.range);

            if (editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1)
            {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(editorCamera.gameObject.transform.scenePosition);
                //
                this.segmentGeometry.segments.length = 0;
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
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 0, 0, alpha), endColor: new feng3d.Color4(1, 0, 0, alpha) });
                    point0 = new feng3d.Vector3(x, 0, y);
                    point1 = new feng3d.Vector3(x1, 0, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 1, 0, alpha), endColor: new feng3d.Color4(0, 1, 0, alpha) });
                    point0 = new feng3d.Vector3(x, y, 0);
                    point1 = new feng3d.Vector3(x1, y1, 0);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 0, 1, alpha), endColor: new feng3d.Color4(0, 0, 1, alpha) });
                }
                this.segmentGeometry.invalidateGeometry();

                this.pointGeometry.points = [];
                var point = new feng3d.Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                point = new feng3d.Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                //
                this.lightLines.visible = true;
                this.lightLines1.visible = true;
                this.lightpoints.visible = true;
            } else
            {
                this.lightLines.visible = false;
                this.lightLines1.visible = false;
                this.lightpoints.visible = false;
            }
        }

        dispose()
        {
            this.enabled = false;
            this.textureMaterial = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightLines1.dispose();
            this.lightpoints.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            this.lightLines1 = null;
            this.lightpoints = null;
            this.segmentGeometry = null;
            super.dispose();
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