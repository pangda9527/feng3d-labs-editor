namespace feng3d.editor
{
    export class PointLightIcon extends EditorScript
    {
        showInInspector = false;
        serializable = false;

        private lightIcon: GameObject;
        private lightLines: GameObject;
        private lightLines1: GameObject;
        private lightpoints: GameObject;
        private textureMaterial: TextureMaterial;
        private pointLight: PointLight;
        private segmentGeometry: SegmentGeometry;
        private pointGeometry: PointGeometry;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.initicon()
        }

        initicon()
        {
            var size = 1;
            this.pointLight = this.getComponent(PointLight);

            var lightIcon = this.lightIcon = GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(BillboardComponent);
            billboardComponent.camera = editorCamera;
            var meshRenderer = lightIcon.addComponent(MeshRenderer);
            meshRenderer.geometry = new PlaneGeometry(size, size, 1, 1, false);
            var textureMaterial = this.textureMaterial = meshRenderer.material = new TextureMaterial();
            var texture = new Texture2D(editorData.getEditorAssetsPath("/assets/3d/icons/light.png"));
            texture.format = TextureFormat.RGBA;
            texture.premulAlpha = true;
            textureMaterial.uniforms.s_texture = texture;
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);
            // this.lightIcon.on("click", () =>
            // {
            //     editor3DData.selectObject(this.gameObject);
            // });

            //
            var lightLines = this.lightLines = GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var lightLines1 = this.lightLines1 = GameObject.create("Lines1");
            lightLines1.addComponent(BillboardComponent).camera = editorCamera;
            lightLines1.mouseEnabled = false;
            lightLines1.serializable = false;
            lightLines1.showinHierarchy = false;
            var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            var meshRenderer1 = lightLines1.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = new feng3d.SegmentMaterial();
            // material.color = new Color(163 / 255, 162 / 255, 107 / 255);
            material.uniforms.u_segmentColor = new Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            var material = meshRenderer1.material = new feng3d.SegmentMaterial();
            // material.color = new Color(163 / 255, 162 / 255, 107 / 255);
            material.uniforms.u_segmentColor = new Color4(1, 1, 1, 0.5);
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
                segmentGeometry.addSegment(new Segment(new Vector3(0, x, y), new Vector3(0, x1, y1)));
                segmentGeometry.addSegment(new Segment(new Vector3(x, 0, y), new Vector3(x1, 0, y1)));
                segmentGeometry.addSegment(new Segment(new Vector3(x, y, 0), new Vector3(x1, y1, 0)));
                segmentGeometry1.addSegment(new Segment(new Vector3(x, y, 0), new Vector3(x1, y1, 0)));
            }
            this.gameObject.addChild(lightLines);
            this.gameObject.addChild(lightLines1);
            //
            var lightpoints = this.lightpoints = GameObject.create("points");
            lightpoints.mouseEnabled = false;
            lightpoints.serializable = false;
            lightpoints.showinHierarchy = false;
            var meshRenderer = lightpoints.addComponent(MeshRenderer);
            var pointGeometry = this.pointGeometry = meshRenderer.geometry = new PointGeometry();
            pointGeometry.addPoint(new PointInfo(new Vector3(1, 0, 0), new Color4(1, 0, 0)));
            pointGeometry.addPoint(new PointInfo(new Vector3(-1, 0, 0), new Color4(1, 0, 0)));
            pointGeometry.addPoint(new PointInfo(new Vector3(0, 1, 0), new Color4(0, 1, 0)));
            pointGeometry.addPoint(new PointInfo(new Vector3(0, -1, 0), new Color4(0, 1, 0)));
            pointGeometry.addPoint(new PointInfo(new Vector3(0, 0, 1), new Color4(0, 0, 1)));
            pointGeometry.addPoint(new PointInfo(new Vector3(0, 0, -1), new Color4(0, 0, 1)));
            var pointMaterial = meshRenderer.material = new PointMaterial();
            pointMaterial.renderParams.enableBlend = true;
            pointMaterial.pointSize = 5;
            // pointMaterial.color = new Color(163 / 255 * 1.2, 162 / 255 * 1.2, 107 / 255 * 1.2);
            this.gameObject.addChild(lightpoints);

            this.enabled = true;
        }

        update()
        {
            this.textureMaterial.uniforms.u_color = this.pointLight.color.toColor4();
            this.lightLines.transform.scale =
                this.lightLines1.transform.scale =
                this.lightpoints.transform.scale =
                new Vector3(this.pointLight.range, this.pointLight.range, this.pointLight.range);

            if (editorData.selectedGameObjects.indexOf(this.gameObject) != -1)
            {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(editorCamera.gameObject.transform.scenePosition);
                //
                this.segmentGeometry.removeAllSegments();
                var alpha = 1;
                var backalpha = 0.5;
                var num = 36;
                var point0: Vector3;
                var point1: Vector3;
                for (var i = 0; i < num; i++)
                {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new Vector3(0, x, y);
                    point1 = new Vector3(0, x1, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.addSegment(new Segment(point0, point1, new Color4(1, 0, 0, alpha), new Color4(1, 0, 0, alpha)));
                    point0 = new Vector3(x, 0, y);
                    point1 = new Vector3(x1, 0, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.addSegment(new Segment(point0, point1, new Color4(0, 1, 0, alpha), new Color4(0, 1, 0, alpha)));
                    point0 = new Vector3(x, y, 0);
                    point1 = new Vector3(x1, y1, 0);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.addSegment(new Segment(point0, point1, new Color4(0, 0, 1, alpha), new Color4(0, 0, 1, alpha)));
                }

                this.pointGeometry.removeAllPoints();
                var point = new Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.addPoint(new PointInfo(point, new Color4(1, 0, 0, alpha)));
                point = new Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.addPoint(new PointInfo(point, new Color4(1, 0, 0, alpha)));
                point = new Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.addPoint(new PointInfo(point, new Color4(0, 1, 0, alpha)));
                point = new Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.addPoint(new PointInfo(point, new Color4(0, 1, 0, alpha)));
                point = new Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.addPoint(new PointInfo(point, new Color4(0, 0, 1, alpha)));
                point = new Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.addPoint(new PointInfo(point, new Color4(0, 0, 1, alpha)));
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
            this.pointLight = null;
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

    }
}