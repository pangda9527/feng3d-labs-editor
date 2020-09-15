namespace feng3d { export interface ComponentMap { EditorComponent: editor.EditorComponent } }

namespace editor
{
    @feng3d.RegisterComponent()
    export class EditorComponent extends feng3d.Component
    {
        get scene()
        {
            return this._scene;
        }
        set scene(v)
        {
            if (this._scene == v) return;

            if (this._scene)
            {
                this.scene.off("addComponent", this.onAddComponent, this);
                this.scene.off("removeComponent", this.onRemoveComponent, this);

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

                this.scene.on("addComponent", this.onAddComponent, this);
                this.scene.on("removeComponent", this.onRemoveComponent, this);
                this.scene.on("addChild", this.onAddChild, this);
                this.scene.on("removeChild", this.onRemoveChild, this);
            }
        }

        private _scene: feng3d.Scene

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { if (this._editorCamera == v) return; this._editorCamera = v; this.update(); }
        private _editorCamera: feng3d.Camera;

        /**
         * 销毁
         */
        dispose()
        {
            this.scene = null;
            super.dispose();
        }

        private onAddChild(event: feng3d.Event<{ parent: feng3d.GameObject; child: feng3d.GameObject; }>)
        {
            var components = event.data.child.getComponentsInChildren();
            components.forEach(v =>
            {
                this.addComponent(v);
            });
        }

        private onRemoveChild(event: feng3d.Event<{ parent: feng3d.GameObject; child: feng3d.GameObject; }>)
        {
            var components = event.data.child.getComponentsInChildren();
            components.forEach(v =>
            {
                this.removeComponent(v);
            });
        }

        private onAddComponent(event: feng3d.Event<{ gameobject: feng3d.GameObject; component: feng3d.Component; }>)
        {
            this.addComponent(event.data.component);
        }

        private onRemoveComponent(event: feng3d.Event<{ gameobject: feng3d.GameObject; component: feng3d.Component; }>)
        {
            this.removeComponent(event.data.component);
        }

        private update()
        {
            this.directionLightIconMap.forEach(v =>
            {
                v.editorCamera = this.editorCamera;
            });
            this.pointLightIconMap.forEach(v =>
            {
                v.editorCamera = this.editorCamera;
            });
            this.spotLightIconMap.forEach(v =>
            {
                v.editorCamera = this.editorCamera;
            });
            this.cameraIconMap.forEach(v =>
            {
                v.editorCamera = this.editorCamera;
            });
        }

        private addComponent(component: feng3d.Component)
        {
            if (component instanceof feng3d.DirectionalLight)
            {
                var directionLightIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "DirectionLightIcon", }).addComponent(DirectionLightIcon), { light: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(component, directionLightIcon);
            } else if (component instanceof feng3d.PointLight)
            {
                var pointLightIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "PointLightIcon" }).addComponent(PointLightIcon), { light: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(component, pointLightIcon);
            } else if (component instanceof feng3d.SpotLight)
            {
                var spotLightIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "SpotLightIcon" }).addComponent(SpotLightIcon), { light: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(component, spotLightIcon);
            } else if (component instanceof feng3d.Camera)
            {
                var cameraIcon = feng3d.serialization.setValue(feng3d.serialization.setValue(new feng3d.GameObject(), { name: "CameraIcon" }).addComponent(CameraIcon), { camera: component, editorCamera: this.editorCamera });
                this.gameObject.addChild(cameraIcon.gameObject);
                this.cameraIconMap.set(component, cameraIcon);
            }
        }

        private removeComponent(component: feng3d.Component)
        {
            if (component instanceof feng3d.DirectionalLight)
            {
                feng3d.serialization.setValue(this.directionLightIconMap.get(component), { light: null }).gameObject.remove();
                this.directionLightIconMap.delete(component);
            } else if (component instanceof feng3d.PointLight)
            {
                feng3d.serialization.setValue(this.pointLightIconMap.get(component), { light: null }).gameObject.remove();
                this.pointLightIconMap.delete(component);
            } else if (component instanceof feng3d.SpotLight)
            {
                feng3d.serialization.setValue(this.spotLightIconMap.get(component), { light: null }).gameObject.remove();
                this.spotLightIconMap.delete(component);
            } else if (component instanceof feng3d.Camera)
            {
                feng3d.serialization.setValue(this.cameraIconMap.get(component), { camera: null }).gameObject.remove();
                this.cameraIconMap.delete(component);
            }
        }

        private directionLightIconMap = new Map<feng3d.DirectionalLight, DirectionLightIcon>();
        private pointLightIconMap = new Map<feng3d.PointLight, PointLightIcon>();
        private spotLightIconMap = new Map<feng3d.SpotLight, SpotLightIcon>();
        private cameraIconMap = new Map<feng3d.Camera, CameraIcon>();

    }
}