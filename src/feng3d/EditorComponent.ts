module feng3d.editor
{
    export class EditorComponent extends Component
    {
        private scene3D: Scene3D;

        init(gameobject: GameObject)
        {
            super.init(gameobject);

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