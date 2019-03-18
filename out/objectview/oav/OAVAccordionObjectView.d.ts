import { OAVBase } from "./OAVBase";
export declare class OAVAccordionObjectView extends OAVBase {
    componentView: feng3d.IObjectView;
    accordion: editor.Accordion;
    enabledCB: eui.CheckBox;
    /**
     * 对象界面数据
     */
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    /**
     * 更新界面
     */
    updateView(): void;
    initView(): void;
    dispose(): void;
    private updateEnableCB;
    private onEnableCBChange;
}
//# sourceMappingURL=OAVAccordionObjectView.d.ts.map