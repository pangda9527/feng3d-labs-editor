/**
 * 默认基础对象界面
 */
export declare class OVBaseDefault extends eui.Component implements feng3d.IObjectView {
    label: eui.Label;
    image: eui.Image;
    private _space;
    constructor(objectViewInfo: feng3d.ObjectViewInfo);
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    space: Object;
    getAttributeView(attributeName: String): any;
    getblockView(blockName: String): any;
    /**
     * 更新界面
     */
    updateView(): void;
}
//# sourceMappingURL=OVBaseDefault.d.ts.map