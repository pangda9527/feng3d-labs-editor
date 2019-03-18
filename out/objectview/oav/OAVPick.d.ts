import { OAVBase } from "./OAVBase";
/**
 * 挑选（拾取）OAV界面
 */
export declare class OAVPick extends OAVBase {
    labelLab: eui.Label;
    text: eui.Label;
    pickBtn: eui.Button;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    private onPickBtnClick;
    /**
     * 更新界面
     */
    updateView(): void;
    private onDoubleClick;
}
//# sourceMappingURL=OAVPick.d.ts.map