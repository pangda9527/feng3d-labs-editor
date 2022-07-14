namespace editor
{
    export class EditorView extends feng3d.View
    {
        wireframeColor = new feng3d.Color4(125 / 255, 176 / 255, 250 / 255);

        /**
         * 编辑器场景，用于显示只在编辑器中存在的游戏对象，例如灯光Icon，对象操作工具等显示。
         */
        editorScene: feng3d.Scene;

        editorComponent: EditorComponent;

        /**
         * 绘制场景
         */
        render()
        {
            if (editorData.gameScene != this.scene)
            {
                if (this.scene)
                {
                    this.scene.runEnvironment = feng3d.RunEnvironment.feng3d;
                }
                this.scene = editorData.gameScene;
                if (this.scene)
                {
                    this.scene.runEnvironment = feng3d.RunEnvironment.editor;
                    hierarchy.rootGameObject = this.scene.gameObject;
                }
            }
            if (this.editorComponent) 
            {
                this.editorComponent.scene = this.scene;
                this.editorComponent.editorCamera = this.camera;
            }

            super.render();

            if (this.contextLost) return;

            if (this.editorScene)
            {
                // 设置鼠标射线
                this.editorScene.mouseRay3D = this.mouseRay3D;
                this.editorScene.camera = this.camera;

                this.editorScene.update();
                feng3d.forwardRenderer.draw(this.gl, this.editorScene, this.camera);
                var selectedObject = this.mouse3DManager.pick(this, this.editorScene, this.camera);
                if (selectedObject) this.selectedObject = selectedObject;
            }
            if (this.scene)
            {
                editorData.selectedGameObjects.forEach(element =>
                {
                    if (element.getComponent(feng3d.Renderable))
                        feng3d.wireframeRenderer.drawGameObject(this.gl, element.getComponent(feng3d.Renderable), this.scene, this.camera, this.wireframeColor);
                });
            }
        }
    }

}