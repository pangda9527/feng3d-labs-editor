declare namespace feng3d.editor {
    var mouseEventEnvironment: MouseEventEnvironment;
    class MouseEventEnvironment {
        private webTouchHandler;
        private canvas;
        private touch;
        overDisplayObject: egret.DisplayObject;
        constructor();
        private onMouseMove(event);
        private getWebTouchHandler();
    }
}
