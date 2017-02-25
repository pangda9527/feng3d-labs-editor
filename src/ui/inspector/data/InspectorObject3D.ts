module feng3d.editor
{
    export class InspectorObject3D
    {
        public components: IComponent[] = [];

        public setObject3D(object3D: Object3D)
        {
            this.components = object3D.getComponents();
        }
    }
}