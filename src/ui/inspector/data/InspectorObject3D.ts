module feng3d.editor
{
    export class InspectorObject3D
    {
        public name: string;
        public visible: boolean;
        public mouseEnabled: boolean;
        public object3D: Object3D;
        public inspectorObject3DComponent: InspectorObject3DComponent = new InspectorObject3DComponent();

        constructor()
        {
            Binding.bothBindProperty(this, ["name"], this, ["object3D", "name"]);
            Binding.bothBindProperty(this, ["visible"], this, ["object3D", "visible"]);
            Binding.bothBindProperty(this, ["mouseEnabled"], this, ["object3D", "mouseEnabled"]);

            Watcher.watch(this, ["object3D"], this.onObject3dChange, this)
        }

        private onObject3dChange()
        {
            //
            this.inspectorObject3DComponent.components.length = 0;
            var components = this.object3D.components;
            for (var i = 0; i < components.length; i++)
            {
                var component = components[i];
                var componentName = ClassUtils.getQualifiedClassName(component).split(".").pop();
                this.inspectorObject3DComponent.components.push({ name: componentName, data: component });
            }
        }
    }

    export class InspectorObject3DComponent
    {
        public components: { name: string, data: Object }[] = [];
    }

    export class Object3DViewData
    {
        public name: string;
        public visible: boolean;
    }
}