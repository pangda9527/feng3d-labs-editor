declare namespace feng3d.editor {
    class Object3DMoveTool extends Object3DControllerToolBase {
        protected toolModel: Object3DMoveModel;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        private startPos;
        constructor(gameObject: GameObject);
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: EventVO<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
