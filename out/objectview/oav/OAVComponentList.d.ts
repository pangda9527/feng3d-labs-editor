import { OAVBase } from "./OAVBase";
export declare class OAVComponentList extends OAVBase {
    protected _space: feng3d.GameObject;
    group: eui.Group;
    addComponentButton: eui.Button;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    private onAddComponentButtonClick;
    space: feng3d.GameObject;
    readonly attributeName: string;
    attributeValue: Object;
    initView(): void;
    dispose(): void;
    private addComponentView;
    /**
     * 更新界面
     */
    updateView(): void;
    private removedComponentView;
    private onAddCompont;
    private onRemoveComponent;
}
//# sourceMappingURL=OAVComponentList.d.ts.map