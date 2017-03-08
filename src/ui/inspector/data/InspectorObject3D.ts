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
                this.inspectorObject3DComponent.components.push({ name: componentName, data: this.getComponentViewData(component) });
            }
        }

        private getComponentViewData(component: IComponent)
        {
            if (component instanceof Transform)
            {
                this.bindTransform(component);
            }
            return component;
        }

        private bindTransform(transform: Transform)
        {
            var viewData = new TransformViewData();
            viewData.position.copyFrom(transform.position);
            viewData.rotation.copyFrom(transform.rotation);
            viewData.scale.copyFrom(transform.scale);

            Binding.bindProperty(transform, ["x"], viewData.position, "x");
            Binding.bindProperty(transform, ["y"], viewData.position, "y");
            Binding.bindProperty(transform, ["z"], viewData.position, "z");
            Binding.bindProperty(transform, ["rx"], viewData.rotation, "x");
            Binding.bindProperty(transform, ["ry"], viewData.rotation, "y");
            Binding.bindProperty(transform, ["rz"], viewData.rotation, "z");
            Binding.bindProperty(transform, ["sx"], viewData.scale, "x");
            Binding.bindProperty(transform, ["sy"], viewData.scale, "y");
            Binding.bindProperty(transform, ["sz"], viewData.scale, "z");

            return viewData;
        }
    }

    export class InspectorObject3DComponent
    {
        public components: { name: string, data: Object }[] = [];
    }

    export class TransformViewData
    {
        public position = new Vector3D();
        public rotation = new Vector3D();
        public scale = new Vector3D(1, 1, 1);
    }
}