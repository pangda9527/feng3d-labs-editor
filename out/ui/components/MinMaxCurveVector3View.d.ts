declare namespace editor {
    class MinMaxCurveVector3View extends eui.Component {
        minMaxCurveVector3: feng3d.MinMaxCurveVector3;
        xMinMaxCurveView: editor.MinMaxCurveView;
        yMinMaxCurveView: editor.MinMaxCurveView;
        zMinMaxCurveView: editor.MinMaxCurveView;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private _onMinMaxCurveVector3Changed;
        private _onchanged;
    }
}
//# sourceMappingURL=MinMaxCurveVector3View.d.ts.map