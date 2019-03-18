export declare class MinMaxCurveEditor extends eui.Component {
    minMaxCurve: feng3d.MinMaxCurve;
    viewGroup: eui.Group;
    curveImage: eui.Image;
    curveGroup: eui.Group;
    multiplierInput: eui.TextInput;
    y_0: eui.Label;
    y_1: eui.Label;
    y_2: eui.Label;
    y_3: eui.Label;
    x_0: eui.Label;
    x_1: eui.Label;
    x_2: eui.Label;
    x_3: eui.Label;
    x_4: eui.Label;
    x_5: eui.Label;
    x_6: eui.Label;
    x_7: eui.Label;
    x_8: eui.Label;
    x_9: eui.Label;
    x_10: eui.Label;
    samplesOperationBtn: eui.Button;
    samplesGroup: eui.Group;
    sample_0: eui.Image;
    sample_1: eui.Image;
    sample_2: eui.Image;
    sample_3: eui.Image;
    sample_4: eui.Image;
    sample_5: eui.Image;
    sample_6: eui.Image;
    sample_7: eui.Image;
    private timeline;
    private timeline1;
    private curveRect;
    private canvasRect;
    private editKey;
    private editorControlkey;
    private editTimeline;
    private editing;
    private mousedownxy;
    private selectedKey;
    private selectTimeline;
    private curveColor;
    private backColor;
    private fillTwoCurvesColor;
    private range;
    private imageUtil;
    /**
     * 点绘制尺寸
     */
    private pointSize;
    /**
     * 控制柄长度
     */
    private controllerLength;
    private yLabels;
    private xLabels;
    private sampleImages;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    updateView(): void;
    private updateXYLabels;
    private updateSampleImages;
    private onSampleClick;
    /**
     * 绘制曲线关键点
     * @param animationCurve
     */
    private drawCurveKeys;
    /**
     * 曲线上的坐标转换为UI上的坐标
     * @param time
     * @param value
     */
    private curveToUIPos;
    /**
     * UI上坐标转换为曲线上坐标
     * @param x
     * @param y
     */
    private uiToCurvePos;
    private getKeyUIPos;
    private getKeyLeftControlUIPos;
    private getKeyRightControlUIPos;
    /**
     * 绘制选中的关键点
     */
    private drawSelectedKey;
    private drawGrid;
    private _onMinMaxCurveChanged;
    private _onReSize;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private findControlKey;
    private ondblclick;
}
export declare var minMaxCurveEditor: MinMaxCurveEditor;
//# sourceMappingURL=MinMaxCurveEditor.d.ts.map