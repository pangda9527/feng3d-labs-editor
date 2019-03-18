export declare class Accordion extends eui.Component implements eui.UIComponent {
    titleGroup: eui.Group;
    titleLabel: eui.Label;
    contentGroup: eui.Group;
    /**
     * 标签名称
     */
    titleName: string;
    private components;
    constructor();
    addContent(component: eui.Component): void;
    removeContent(component: eui.Component): void;
    protected onComplete(): void;
    protected onAddedToStage(): void;
    protected onRemovedFromStage(): void;
    private onTitleButtonClick;
}
//# sourceMappingURL=Accordion.d.ts.map