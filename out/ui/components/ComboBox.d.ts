/**
 * 下拉列表
 */
export declare class ComboBox extends eui.Component implements eui.UIComponent {
    label: eui.Label;
    list: eui.List;
    /**
     * 数据
     */
    dataProvider: {
        label: string;
        value: any;
    }[];
    /**
     * 选中数据
     */
    data: {
        label: string;
        value: any;
    };
    _data: {
        label: string;
        value: any;
    };
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private init;
    private updateview;
    private onClick;
    private onlistChange;
}
//# sourceMappingURL=ComboBox.d.ts.map