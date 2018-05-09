namespace feng3d.editor
{
    export class DirectionLightIcon extends EditorScript
    {
        private lightIcon: GameObject;
        private lightLines: GameObject;
        private textureMaterial: TextureMaterial;
        private directionalLight: DirectionalLight;

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.initicon()
        }

        initicon()
        {
            var size = 1;
            var linesize = 10;
            this.directionalLight = this.getComponent(DirectionalLight);

            var lightIcon = this.lightIcon = GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(BillboardComponent);
            billboardComponent.camera = editorCamera;
            var meshRenderer = lightIcon.addComponent(MeshRenderer);
            meshRenderer.geometry = new PlaneGeometry({ width: size, height: size, segmentsH: 1, segmentsW: 1, yUp: false });
            var textureMaterial = this.textureMaterial = meshRenderer.material = materialFactory.create("texture");
            var texture = new Texture2D();
            texture.url = editorData.getEditorAssetsPath("/assets/3d/icons/sun.png");
            texture.format = TextureFormat.RGBA;
            texture.premulAlpha = true;
            textureMaterial.uniforms.s_texture = texture;
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);

            //
            var lightLines = this.lightLines = GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var holdSizeComponent = lightLines.addComponent(HoldSizeComponent);
            holdSizeComponent.camera = editorCamera;
            holdSizeComponent.holdSize = 1;
            var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = materialFactory.create("segment", { renderParams: { renderMode: RenderMode.LINES } });
            material.uniforms.u_segmentColor = new Color4(163 / 255, 162 / 255, 107 / 255);
            var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            var num = 10;
            for (var i = 0; i < num; i++)
            {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segmentGeometry.addSegment(new Segment(new Vector3(x, y, 0), new Vector3(x, y, linesize * 5)));
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
                segmentGeometry.addSegment(new Segment(new Vector3(x, y, 0), new Vector3(x1, y1, 0)));
            }
            this.gameObject.addChild(lightLines);

            this.enabled = true;
        }

        update()
        {
            this.textureMaterial.uniforms.u_color = this.directionalLight.color.toColor4();
            this.lightLines.visible = editorData.selectedGameObjects.indexOf(this.gameObject) != -1;
        }

        dispose()
        {
            this.enabled = false;
            this.textureMaterial = null;
            this.directionalLight = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            super.dispose();
        }

    }
}