import { OAVBase } from "./OAVBase";
export declare class OAVObjectView extends OAVBase {
    group: eui.Group;
    views: feng3d.IObjectView[];
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    updateView(): void;
    /**
     * 销毁
     */
    dispose(): void;
    private onRefreshView;
}
//# sourceMappingURL=OAVObjectView.d.ts.map