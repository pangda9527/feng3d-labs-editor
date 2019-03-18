/**
 * 属性面板（检查器）
 */
export declare class InspectorView extends eui.Component implements eui.UIComponent {
    typeLab: eui.Label;
    backButton: eui.Button;
    group: eui.Group;
    constructor();
    private showData;
    private onShowData;
    private onSaveShowData;
    private updateView;
    /**
     * 保存显示数据
     */
    private saveShowData;
    private _view;
    private _viewData;
    private _viewDataList;
    private _dataChanged;
    private onComplete;
    private onAddedToStage;
    private onRemovedFromStage;
    private onSelectedObjectsChanged;
    private updateShowData;
    private onValueChanged;
    private onBackButton;
}
//# sourceMappingURL=InspectorView.d.ts.map