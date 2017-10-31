module feng3d.editor
{
    export class Object3DControllerTool extends Component
    {
        private object3DMoveTool: Object3DMoveTool;
        private object3DRotationTool: Object3DRotationTool;
        private object3DScaleTool: Object3DScaleTool;

        private _currentTool: Object3DControllerToolBase;

        private object3DControllerTarget: Object3DControllerTarget;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            gameObject.serializable = false;
            gameObject.showinHierarchy = false;

            this.object3DControllerTarget = Object3DControllerTarget.instance;

            this.object3DMoveTool = GameObject.create("object3DMoveTool").addComponent(Object3DMoveTool);
            this.object3DRotationTool = GameObject.create("object3DRotationTool").addComponent(Object3DRotationTool);
            this.object3DScaleTool = GameObject.create("object3DScaleTool").addComponent(Object3DScaleTool);

            this.object3DMoveTool.object3DControllerTarget = this.object3DControllerTarget;
            this.object3DRotationTool.object3DControllerTarget = this.object3DControllerTarget;
            this.object3DScaleTool.object3DControllerTarget = this.object3DControllerTarget;
            //

            this.currentTool = this.object3DMoveTool;

            eui.Watcher.watch(editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this);

            shortcut.on("object3DMoveTool", this.onObject3DMoveTool, this);
            shortcut.on("object3DRotationTool", this.onObject3DRotationTool, this);
            shortcut.on("object3DScaleTool", this.onObject3DScaleTool, this);

            eui.Watcher.watch(editor3DData, ["selectedObject"], this.onSelectedObject3DChange, this);
        }

        private onSelectedObject3DChange()
        {
            if (editor3DData.selectedObject
                //选中的是GameObject
                && editor3DData.selectedObject instanceof GameObject
                //选中的不是场景
                && !editor3DData.selectedObject.getComponent(Scene3D)
                && !editor3DData.selectedObject.getComponent(Trident)
                && !editor3DData.selectedObject.getComponent(GroundGrid)
                && !editor3DData.selectedObject.getComponent(SkinnedMeshRenderer)
            )
            {
                this.object3DControllerTarget.controllerTargets = [editor3DData.selectedObject.transform];
                engine.root.addChild(this.gameObject);
            }
            else
            {
                this.object3DControllerTarget.controllerTargets = null;
                this.gameObject.remove();
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
                this.gameObject.removeChild(this._currentTool.gameObject)
            }
            this._currentTool = value;
            if (this._currentTool)
            {
                this.gameObject.addChild(this._currentTool.gameObject);
            }
        }
    }
}