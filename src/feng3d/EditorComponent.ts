namespace feng3d { export interface ComponentMap { EditorComponent: editor.EditorComponent } }

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
                var directionLightIcon = new feng3d.GameObject().value({ name: "DirectionLightIcon", }).addComponent(DirectionLightIcon).value({ light: light, });
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(light, directionLightIcon);
            } else if (light instanceof feng3d.PointLight)
            {
                var pointLightIcon = new feng3d.GameObject().value({ name: "PointLightIcon" }).addComponent(PointLightIcon).value({ light: light });
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(light, pointLightIcon);
            } else if (light instanceof feng3d.SpotLight)
            {
                var spotLightIcon = new feng3d.GameObject().value({ name: "SpotLightIcon" }).addComponent(SpotLightIcon).value({ light: light });
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(light, spotLightIcon);
            }
        }

        private removeLightIcon(light: feng3d.Component)
        {
            if (light instanceof feng3d.DirectionalLight)
            {
                this.directionLightIconMap.get(light).value({ light: null }).gameObject.remove();
                this.directionLightIconMap.delete(light);
            } else if (light instanceof feng3d.PointLight)
            {
                this.pointLightIconMap.get(light).value({ light: null }).gameObject.remove();
                this.pointLightIconMap.delete(light);
            } else if (light instanceof feng3d.SpotLight)
            {
                this.spotLightIconMap.get(light).value({ light: null }).gameObject.remove();
                this.spotLightIconMap.delete(light);
            }
        }

        private directionLightIconMap = new Map<feng3d.DirectionalLight, DirectionLightIcon>();
        private pointLightIconMap = new Map<feng3d.PointLight, PointLightIcon>();
        private spotLightIconMap = new Map<feng3d.SpotLight, SpotLightIcon>();

    }
}