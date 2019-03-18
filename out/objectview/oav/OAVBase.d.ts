export declare class OAVBase extends eui.Component implements feng3d.IObjectAttributeView {
    protected _space: any;
    protected _attributeName: string;
    protected _attributeType: string;
    protected _attributeViewInfo: feng3d.AttributeViewInfo;
    labelLab: eui.Label;
    /**
     * 对象属性界面
     */
    objectView: feng3d.IObjectView;
    /**
     * 对象属性块界面
     */
    objectBlockView: feng3d.IObjectBlockView;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    space: any;
    private label;
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    /**
     * 初始化
     */
    initView(): void;
    /**
     * 销毁
     */
    dispose(): void;
    /**
     * 更新
     */
    updateView(): void;
    readonly attributeName: string;
    attributeValue: any;
}
//# sourceMappingURL=OAVBase.d.ts.map