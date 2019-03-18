import { OAVBase } from "./OAVBase";
import { DragData } from "../../ui/drag/Drag";
/**
 * 默认对象属性界面
 */
export declare class OAVDefault extends OAVBase {
    labelLab: eui.Label;
    text: eui.TextInput;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    dragparam: {
        accepttype: keyof DragData;
        datatype: string;
    };
    initView(): void;
    dispose(): void;
    private _textfocusintxt;
    protected ontxtfocusin(): void;
    protected ontxtfocusout(): void;
    /**
     * 更新界面
     */
    updateView(): void;
    private onDoubleClick;
    private onTextChange;
}
//# sourceMappingURL=OAVDefault.d.ts.map