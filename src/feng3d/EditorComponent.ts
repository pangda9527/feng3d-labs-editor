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

                this.scene.getComponentsInChildren(feng3d.Component).forEach(element =>
                {
                    this.removeComponent(element);
                });
            }
            this._scene = v;
            if (this._scene)
            {
                this.scene.getComponentsInChildren(feng3d.Component).forEach(element =>
                {
                    this.addComponent(element);
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
            this.addComponent(event.data);
        }

        private onRemoveComponentFromScene(event: feng3d.Event<feng3d.Component>)
        {
            this.removeComponent(event.data);
        }

        private addComponent(component: feng3d.Component)
        {
            if (component instanceof feng3d.DirectionalLight)
            {
                var directionLightIcon = new feng3d.GameObject().value({ name: "DirectionLightIcon", }).addComponent(DirectionLightIcon).value({ light: component, });
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(component, directionLightIcon);
            } else if (component instanceof feng3d.PointLight)
            {
                var pointLightIcon = new feng3d.GameObject().value({ name: "PointLightIcon" }).addComponent(PointLightIcon).value({ light: component });
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(component, pointLightIcon);
            } else if (component instanceof feng3d.SpotLight)
            {
                var spotLightIcon = new feng3d.GameObject().value({ name: "SpotLightIcon" }).addComponent(SpotLightIcon).value({ light: component });
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(component, spotLightIcon);
            } else if (component instanceof feng3d.Camera)
            {
                var cameraIcon = new feng3d.GameObject().value({ name: "CameraIcon" }).addComponent(CameraIcon).value({ camera: component });
                this.gameObject.addChild(cameraIcon.gameObject);
                this.cameraIconMap.set(component, cameraIcon);
            }
        }

        private removeComponent(component: feng3d.Component)
        {
            if (component instanceof feng3d.DirectionalLight)
            {
                this.directionLightIconMap.get(component).value({ light: null }).gameObject.remove();
                this.directionLightIconMap.delete(component);
            } else if (component instanceof feng3d.PointLight)
            {
                this.pointLightIconMap.get(component).value({ light: null }).gameObject.remove();
                this.pointLightIconMap.delete(component);
            } else if (component instanceof feng3d.SpotLight)
            {
                this.spotLightIconMap.get(component).value({ light: null }).gameObject.remove();
                this.spotLightIconMap.delete(component);
            } else if (component instanceof feng3d.Camera)
            {
                this.cameraIconMap.get(component).value({ camera: null }).gameObject.remove();
                this.cameraIconMap.delete(component);
            }
        }

        private directionLightIconMap = new Map<feng3d.DirectionalLight, DirectionLightIcon>();
        private pointLightIconMap = new Map<feng3d.PointLight, PointLightIcon>();
        private spotLightIconMap = new Map<feng3d.SpotLight, SpotLightIcon>();
        private cameraIconMap = new Map<feng3d.Camera, CameraIcon>();

    }
}