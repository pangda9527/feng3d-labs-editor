module feng3d.editor
{
    export class Object3DControllerTool extends Object3D
    {
        private object3DMoveTool: Object3DMoveTool;
        private object3DRotationTool: Object3DRotationTool;
        private object3DScaleTool: Object3DScaleTool;

        private _currentTool: Object3D;

        constructor()
        {
            super();

            this.object3DMoveTool = new Object3DMoveTool();
            this.object3DRotationTool = new Object3DRotationTool();
            this.object3DScaleTool = new Object3DScaleTool();

            this.currentTool = this.object3DMoveTool;

            shortcut.ShortCut.commandDispatcher.addEventListener("object3DMoveTool", this.onObject3DMoveTool, this);
            shortcut.ShortCut.commandDispatcher.addEventListener("object3DRotationTool", this.onObject3DRotationTool, this);
            shortcut.ShortCut.commandDispatcher.addEventListener("object3DScaleTool", this.onObject3DScaleTool, this);
            //
            shortcut.ShortCut.commandDispatcher.addEventListener("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
        }

        private onObject3DMoveTool()
        {
            this.currentTool = this.object3DMoveTool;
        }

        private onObject3DRotationTool()
        {
            this.currentTool = this.object3DRotationTool;
        }

        private onObject3DScaleTool()
        {
            this.currentTool = this.object3DScaleTool;
        }

        private set currentTool(value)
        {
            if (this._currentTool == value)
                return;
            if (this._currentTool)
                this.removeChild(this._currentTool)
            this._currentTool = value;
            if (this._currentTool)
                this.addChild(this._currentTool)
        }

        private onMouseRotateSceneStart()
        {
            var camera3D = Editor3DData.instance.camera3D;
            var position = camera3D.globalMatrix3D.forward;
            
        }
    }
}