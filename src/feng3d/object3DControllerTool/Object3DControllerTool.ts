module feng3d.editor
{
    export class Object3DControllerTool extends Object3D
    {
        constructor()
        {
            super();

            this.addChild(new Object3DMoveTool());
        }
    }
}