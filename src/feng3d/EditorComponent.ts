namespace editor
{
    export class EditorComponent extends feng3d.Component
    {
        get scene()
        {
            return this._scene;
        }
        set scene(v)
        {
            if (this._scene)
            {
                this.scene.off("addComponentToScene", this.onAddComponentToScene, this);
                this.scene.off("removeComponentFromScene", this.onRemoveComponentFromScene, this);

                var lights = this.scene.getComponentsInChildren(feng3d.Light);
                lights.forEach(element =>
                {
                    this.removeLightIcon(element);
                });
            }
            this._scene = v;
            if (this._scene)
            {
                var lights = this.scene.getComponentsInChildren(feng3d.Light);
                lights.forEach(element =>
                {
                    this.addLightIcon(element);
                });

                this.scene.on("addComponentToScene", this.onAddComponentToScene, this);
                this.scene.on("removeComponentFromScene", this.onRemoveComponentFromScene, this);
            }
        }

        private _scene: feng3d.Scene3D

        init(gameobject: feng3d.GameObject)
        {
            super.init(gameobject);
        }

        /**
         * 销毁
         */
        dispose()
        {
            this.scene = null;
            super.dispose();
        }

        private onAddComponentToScene(event: feng3d.Event<feng3d.Component>)
        {
            this.addLightIcon(event.data);
        }

        private onRemoveComponentFromScene(event: feng3d.Event<feng3d.Component>)
        {
            this.removeLightIcon(event.data);
        }

        private addLightIcon(light: feng3d.Component)
        {
            if (light instanceof feng3d.DirectionalLight)
            {
                var directionLightIcon = feng3d.GameObject.create("DirectionLightIcon").addComponent(DirectionLightIcon);
                directionLightIcon.light = light;
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(light, directionLightIcon);
            } else if (light instanceof feng3d.PointLight)
            {
                var pointLightIcon = feng3d.GameObject.create("PointLightIcon").addComponent(PointLightIcon);
                pointLightIcon.light = light;
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(light, pointLightIcon);
            }
        }

        private removeLightIcon(light: feng3d.Component)
        {
            if (light instanceof feng3d.DirectionalLight)
            {
                var directionLightIcon = this.directionLightIconMap.get(light);
                directionLightIcon.light = null;
                directionLightIcon.gameObject.remove();
                this.directionLightIconMap.delete(light);
            } else if (light instanceof feng3d.PointLight)
            {
                var pointLightIcon = this.pointLightIconMap.get(light);
                pointLightIcon.light = null;
                pointLightIcon.gameObject.remove();
                this.pointLightIconMap.delete(light);
            }
        }

        private directionLightIconMap = new Map<feng3d.DirectionalLight, DirectionLightIcon>();
        private pointLightIconMap = new Map<feng3d.PointLight, PointLightIcon>();

    }
}