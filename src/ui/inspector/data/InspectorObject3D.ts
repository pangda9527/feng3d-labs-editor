module feng3d.editor
{
    export class InspectorObject3D
    {
        public components: { name: string, data: IComponent }[] = [];

        public setObject3D(object3D: Object3D)
        {
            this.components.length = 0;
            var components = object3D.getComponents();
            for (var i = 0; i < components.length; i++)
            {
                var component = components[i];
                var componentName = ClassUtils.getQualifiedClassName(component).split(".").pop();
                this.components.push({ name: componentName, data: component });
            }
        }
    }
}