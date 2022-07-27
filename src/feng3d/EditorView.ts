import { View, Color4, Scene, RunEnvironment, forwardRenderer, Renderable, wireframeRenderer } from 'feng3d';
import { EditorData } from '../global/EditorData';
import { EditorComponent } from './EditorComponent';
import { hierarchy } from './hierarchy/Hierarchy';

export class EditorView extends View
{
    wireframeColor = new Color4(125 / 255, 176 / 255, 250 / 255);

    /**
     * 编辑器场景，用于显示只在编辑器中存在的游戏对象，例如灯光Icon，对象操作工具等显示。
     */
    editorScene: Scene;

    editorComponent: EditorComponent;

    /**
     * 绘制场景
     */
    render()
    {
        if (EditorData.editorData.gameScene !== this.scene)
        {
            if (this.scene)
            {
                this.scene.runEnvironment = RunEnvironment.feng3d;
            }
            this.scene = EditorData.editorData.gameScene;
            if (this.scene)
            {
                this.scene.runEnvironment = RunEnvironment.editor;
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
            forwardRenderer.draw(this.gl, this.editorScene, this.camera);
            const selectedObject = this.mouse3DManager.pick(this, this.editorScene, this.camera);
            if (selectedObject) this.selectedObject = selectedObject;
        }
        if (this.scene)
        {
            EditorData.editorData.selectedGameObjects.forEach((element) =>
            {
                if (element.getComponent(Renderable))
                {
                    wireframeRenderer.drawGameObject(this.gl, element.getComponent(Renderable), this.scene, this.camera, this.wireframeColor);
                }
            });
        }
    }
}

