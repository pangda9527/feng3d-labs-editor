import { OAVBase } from "./OAVBase";
import { MinMaxCurveVector3View } from "../../ui/components/MinMaxCurveVector3View";
export declare class OAVMinMaxCurveVector3 extends OAVBase {
    labelLab: eui.Label;
    minMaxCurveVector3View: MinMaxCurveVector3View;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    updateView(): void;
    private onChange;
}
//# sourceMappingURL=OAVMinMaxCurveVector3.d.ts.map