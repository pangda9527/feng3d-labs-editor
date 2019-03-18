import { Accordion } from "./Accordion";
export declare class ComponentView extends eui.Component {
    component: feng3d.Components;
    componentView: feng3d.IObjectView;
    accordion: Accordion;
    enabledCB: eui.CheckBox;
    componentIcon: eui.Image;
    helpBtn: eui.Button;
    operationBtn: eui.Button;
    scriptView: feng3d.IObjectView;
    /**
     * 对象界面数据
     */
    constructor(component: feng3d.Components);
    /**
     * 更新界面
     */
    updateView(): void;
    private onComplete;
    private onDeleteButton;
    private onAddToStage;
    private onRemovedFromStage;
    private onRefreshView;
    private updateEnableCB;
    private onEnableCBChange;
    private initScriptView;
    private removeScriptView;
    private onOperationBtnClick;
    private onHelpBtnClick;
    private onScriptChanged;
}
//# sourceMappingURL=ComponentView.d.ts.map