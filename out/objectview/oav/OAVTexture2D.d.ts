import { OAVBase } from "./OAVBase";
/**
 * 挑选（拾取）OAV界面
 */
export declare class OAVTexture2D extends OAVBase {
    image: eui.Image;
    pickBtn: eui.Button;
    labelLab: eui.Label;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    private ontxtClick;
    /**
     * 更新界面
     */
    updateView(): void;
    private onDoubleClick;
}
//# sourceMappingURL=OAVTexture2D.d.ts.map