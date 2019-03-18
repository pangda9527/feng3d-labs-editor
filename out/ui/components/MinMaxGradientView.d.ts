/**
 * 最大最小颜色渐变界面
 */
export declare class MinMaxGradientView extends eui.Component {
    minMaxGradient: feng3d.MinMaxGradient;
    colorGroup0: eui.Group;
    colorImage0: eui.Image;
    secondGroup: eui.Group;
    colorGroup1: eui.Group;
    colorImage1: eui.Image;
    modeBtn: eui.Button;
    private secondGroupParent;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    updateView(): void;
    private onReSize;
    private _onMinMaxGradientChanged;
    private activeColorGroup;
    private onClick;
    private onPickerViewChanged;
    private _onRightClick;
}
//# sourceMappingURL=MinMaxGradientView.d.ts.map