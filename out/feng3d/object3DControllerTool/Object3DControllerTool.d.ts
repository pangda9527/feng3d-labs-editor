declare namespace feng3d.editor {
    class Object3DControllerTool extends Component {
        private object3DMoveTool;
        private object3DRotationTool;
        private object3DScaleTool;
        private _currentTool;
        private object3DControllerTarget;
        constructor(gameObject: GameObject);
        private onSelectedObject3DChange();
        private onObject3DOperationIDChange();
        private onObject3DMoveTool();
        private onObject3DRotationTool();
        private onObject3DScaleTool();
        private currentTool;
    }
}
