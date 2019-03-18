import { OAVBase } from "./OAVBase";
import { ComboBox } from "../../ui/components/ComboBox";
export declare class OAVEnum extends OAVBase {
    labelLab: eui.Label;
    combobox: ComboBox;
    private list;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    enumClass: any;
    initView(): void;
    dispose(): void;
    updateView(): void;
    private onComboxChange;
}
//# sourceMappingURL=OAVEnum.d.ts.map