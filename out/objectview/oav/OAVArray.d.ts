import { OAVBase } from "./OAVBase";
import { OAVDefault } from "./OAVDefault";
export declare class OAVArray extends OAVBase {
    group: eui.Group;
    titleGroup: eui.Group;
    titleButton: eui.Rect;
    contentGroup: eui.Group;
    sizeTxt: eui.TextInput;
    private attributeViews;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    space: Object;
    readonly attributeName: string;
    attributeValue: any[];
    initView(): void;
    dispose(): void;
    private onTitleButtonClick;
    private onsizeTxtfocusout;
}
export declare class OAVArrayItem extends OAVDefault {
    constructor(arr: any[], index: number, componentParam: Object);
    initView(): void;
}
//# sourceMappingURL=OAVArray.d.ts.map