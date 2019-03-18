import { OAVBase } from "./OAVBase";
import { MinMaxCurveView } from "../../ui/components/MinMaxCurveView";
export declare class OAVMinMaxCurve extends OAVBase {
    labelLab: eui.Label;
    minMaxCurveView: MinMaxCurveView;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    updateView(): void;
    private onChange;
}
//# sourceMappingURL=OAVMinMaxCurve.d.ts.map