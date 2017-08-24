declare namespace feng3d.editor {
    class LoadingUI extends egret.Sprite {
        constructor();
        private textField;
        private createView();
        setProgress(current: number, total: number): void;
    }
}
