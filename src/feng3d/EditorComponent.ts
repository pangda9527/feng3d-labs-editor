namespace feng3d.editor
{
    export class EditorComponent extends Component
    {
        serializable = false;
        showInInspector = false;

        private scene3D: Scene3D;
        private editorObject: GameObject;

        init(gameobject: GameObject)
        {
            super.init(gameobject);

            var editorObject = this.editorObject = GameObject.create("editorObject");
            editorObject.serializable = false;
            editorObject.showinHierarchy = false;
            gameobject.addChild(editorObject);

            editorObject.addComponent(SceneRotateTool);

            //
            editorObject.addComponent(Trident);

            //初始化模块
            editorObject.addComponent(GroundGrid);

            editorObject.addComponent(MRSTool);

            //
            var sceneControl = new SceneControl();

            //
            this.scene3D = this.getComponent(Scene3D);
            this.scene3D.on("addComponentToScene", this.onAddComponentToScene, this);
            this.scene3D.on("removeComponentFromScene", this.onRemoveComponentFromScene, this);
        }

        private onAddComponentToScene(event: Event<Component>)
        {
            if (event.data instanceof DirectionalLight)
            {
                event.data.gameObject.addComponent(DirectionLightIcon);
            } else if (event.data instanceof PointLight)
            {
                event.data.gameObject.addComponent(PointLightIcon);
            }
        }

        private onRemoveComponentFromScene(event: Event<Component>)
        {
            if (event.data instanceof DirectionalLight)
            {
                event.data.gameObject.removeComponentsByType(DirectionLightIcon);
            } else if (event.data instanceof PointLight)
            {
                event.data.gameObject.removeComponentsByType(PointLightIcon);
            }
        }

    }
}