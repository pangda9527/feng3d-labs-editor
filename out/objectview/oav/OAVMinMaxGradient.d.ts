import { OAVBase } from "./OAVBase";
import { MinMaxGradientView } from "../../ui/components/MinMaxGradientView";
export declare class OAVMinMaxGradient extends OAVBase {
    labelLab: eui.Label;
    minMaxGradientView: MinMaxGradientView;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    updateView(): void;
    private onChange;
}
//# sourceMappingURL=OAVMinMaxGradient.d.ts.map