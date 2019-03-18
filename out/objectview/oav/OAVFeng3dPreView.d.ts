import { OAVBase } from "./OAVBase";
export declare class OAVFeng3dPreView extends OAVBase {
    image: eui.Image;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    private preMousePos;
    private onMouseDown;
    private onMouseMove;
    private cameraRotation;
    private onDrawObject;
    private onMouseUp;
    updateView(): void;
    onResize(): void;
}
//# sourceMappingURL=OAVFeng3dPreView.d.ts.map