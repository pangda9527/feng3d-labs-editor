declare namespace feng3d.editor {
    class Object3DRotationTool extends Object3DControllerToolBase {
        protected toolModel: Object3DRotationModel;
        private startPlanePos;
        private startMousePos;
        constructor(gameObject: GameObject);
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
