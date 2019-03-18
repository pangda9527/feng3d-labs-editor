/**
 * 最大最小曲线界面
 */
export declare class MinMaxCurveView extends eui.Component {
    minMaxCurve: feng3d.MinMaxCurve;
    constantGroup: eui.Group;
    constantTextInput: eui.TextInput;
    curveGroup: eui.Group;
    curveImage: eui.Image;
    randomBetweenTwoConstantsGroup: eui.Group;
    minValueTextInput: eui.TextInput;
    maxValueTextInput: eui.TextInput;
    modeBtn: eui.Button;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    updateView(): void;
    private onReSize;
    private _onMinMaxCurveChanged;
    private onClick;
    private onPickerViewChanged;
    private _onRightClick;
}
//# sourceMappingURL=MinMaxCurveView.d.ts.map