module feng3d.editor
{
    export class Object3DControllerTool extends Object3D
    {
        private object3DMoveTool: Object3DMoveTool;
        private object3DRotationTool: Object3DRotationTool;
        private object3DScaleTool: Object3DScaleTool;

        private _currentTool: Object3DControllerToolBase;

        constructor()
        {
            super();

            this.object3DMoveTool = new Object3DMoveTool();
            this.object3DRotationTool = new Object3DRotationTool();
            this.object3DScaleTool = new Object3DScaleTool();

            this.currentTool = this.object3DMoveTool;

            Binding.bindHandler(editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this)

            shortcut.addEventListener("object3DMoveTool", this.onObject3DMoveTool, this);
            shortcut.addEventListener("object3DRotationTool", this.onObject3DRotationTool, this);
            shortcut.addEventListener("object3DScaleTool", this.onObject3DScaleTool, this);

            Binding.bindHandler(editor3DData, ["selectedObject3D"], this.onSelectedObject3DChange, this)
        }

        private onSelectedObject3DChange()
        {
            if (editor3DData.selectedObject3D)
            {
                editor3DData.scene3D.addChild(this);
            }
            else
            {
                editor3DData.scene3D.removeChild(this);
            }
            this._currentTool.selectedObject3D = editor3DData.selectedObject3D;
        }

        private onObject3DOperationIDChange()
        {
            switch (editor3DData.object3DOperationID)
            {
                case 0:
                    this.currentTool = this.object3DMoveTool;
                    break;
                case 1:
                    this.currentTool = this.object3DRotationTool;
                    break;
                case 2:
                    this.currentTool = this.object3DScaleTool;
                    break;
            }

        }

        private onObject3DMoveTool()
        {
            editor3DData.object3DOperationID = 0;

        }

        private onObject3DRotationTool()
        {
            editor3DData.object3DOperationID = 1;
        }

        private onObject3DScaleTool()
        {
            editor3DData.object3DOperationID = 2;
        }

        private set currentTool(value)
        {
            if (this._currentTool == value)
                return;
            if (this._currentTool)
            {
                this._currentTool.selectedObject3D = null;
                this.removeChild(this._currentTool)
            }
            this._currentTool = value;
            if (this._currentTool)
            {
                this.addChild(this._currentTool)
                this._currentTool.selectedObject3D = editor3DData.selectedObject3D;
            }
        }
    }
}