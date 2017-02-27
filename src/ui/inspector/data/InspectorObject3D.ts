module feng3d.editor
{
    export class InspectorObject3D
    {
        public name: string;
        public inspectorObject3DComponent: InspectorObject3DComponent = new InspectorObject3DComponent();

        public setObject3D(object3D: Object3D)
        {
            this.name = object3D.name;
            //
            this.inspectorObject3DComponent.components.length = 0;
            var components = object3D.getComponents();
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
        public components: { name: string, data: IComponent }[] = [];
    }
}