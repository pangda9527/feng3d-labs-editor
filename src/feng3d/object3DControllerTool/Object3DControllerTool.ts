module feng3d.editor
{
    export class Object3DControllerTool extends GameObject
    {
        private object3DMoveTool: Object3DMoveTool;
        private object3DRotationTool: Object3DRotationTool;
        private object3DScaleTool: Object3DScaleTool;

        private _currentTool: Object3DControllerToolBase;

        private object3DControllerTarget: Object3DControllerTarget;

        constructor()
        {
            super();

            this.object3DControllerTarget = new Object3DControllerTarget();

            this.object3DMoveTool = new Object3DMoveTool();
            this.object3DRotationTool = new Object3DRotationTool();
            this.object3DScaleTool = new Object3DScaleTool();

            this.object3DMoveTool.bindingObject3D = this.object3DControllerTarget;
            this.object3DRotationTool.bindingObject3D = this.object3DControllerTarget;
            this.object3DScaleTool.bindingObject3D = this.object3DControllerTarget;
            //

            this.currentTool = this.object3DMoveTool;

            Watcher.watch(editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this);

            shortcut.addEventListener("object3DMoveTool", this.onObject3DMoveTool, this);
            shortcut.addEventListener("object3DRotationTool", this.onObject3DRotationTool, this);
            shortcut.addEventListener("object3DScaleTool", this.onObject3DScaleTool, this);

            Watcher.watch(editor3DData, ["selectedObject3D"], this.onSelectedObject3DChange, this);
        }

        private onSelectedObject3DChange()
        {
            if (editor3DData.selectedObject3D)
            {
                this.object3DControllerTarget.controllerTargets = [editor3DData.selectedObject3D];
                editor3DData.scene3D.addChild(this.transform);
            }
            else
            {
                this.object3DControllerTarget.controllerTargets = null;
                editor3DData.scene3D.removeChild(this.transform);
            }
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
                this.transform.removeChild(this._currentTool.transform)
            }
            this._currentTool = value;
            if (this._currentTool)
            {
                this.transform.addChild(this._currentTool.transform);
            }
        }
    }
}