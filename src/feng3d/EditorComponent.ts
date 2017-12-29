namespace feng3d.editor
{
    export class EditorComponent extends Component
    {
        serializable = false;
        showInInspector = false;
        scene: Scene3D

        init(gameobject: GameObject)
        {
            super.init(gameobject);

            this.gameObject.on("addedToScene", this.onAddedToScene, this);
            this.gameObject.on("removedFromScene", this.onRemovedFromScene, this);
        }

        /**
         * 销毁
         */
        dispose()
        {
            this.gameObject.off("addedToScene", this.onAddedToScene, this);
            this.gameObject.off("removedFromScene", this.onRemovedFromScene, this);

            this.onRemovedFromScene();

            super.dispose();
        }

        private onAddedToScene()
        {
            this.scene = this.gameObject.scene;
            var lights = this.scene.getComponentsInChildren(Light);
            lights.forEach(element =>
            {
                this.addLightIcon(element);
            });

            this.scene.on("addComponentToScene", this.onAddComponentToScene, this);
            this.scene.on("removeComponentFromScene", this.onRemoveComponentFromScene, this);
        }

        private onRemovedFromScene()
        {
            if (!this.scene)
                return;

            this.scene.off("addComponentToScene", this.onAddComponentToScene, this);
            this.scene.off("removeComponentFromScene", this.onRemoveComponentFromScene, this);

            var lights = this.scene.getComponentsInChildren(Light);
            lights.forEach(element =>
            {
                this.removeLightIcon(element);
            });
            this.scene = null;
        }

        private onAddComponentToScene(event: Event<Component>)
        {
            this.addLightIcon(event.data);
        }

        private onRemoveComponentFromScene(event: Event<Component>)
        {
            this.removeLightIcon(event.data);
        }

        private addLightIcon(light: Component)
        {
            if (light instanceof DirectionalLight)
            {
                light.gameObject.addComponent(DirectionLightIcon);
            } else if (light instanceof PointLight)
            {
                light.gameObject.addComponent(PointLightIcon);
            }
        }

        private removeLightIcon(light: Component)
        {
            if (light instanceof DirectionalLight)
            {
                light.gameObject.removeComponentsByType(DirectionLightIcon);
            } else if (light instanceof PointLight)
            {
                light.gameObject.removeComponentsByType(PointLightIcon);
            }
        }
    }
}