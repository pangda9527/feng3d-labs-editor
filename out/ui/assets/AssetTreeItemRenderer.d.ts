import { TreeItemRenderer } from "../components/TreeItemRenderer";
import { AssetNode } from "./AssetNode";
export declare class AssetTreeItemRenderer extends TreeItemRenderer {
    contentGroup: eui.Group;
    disclosureButton: eui.ToggleButton;
    data: AssetNode;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    dataChanged(): void;
    private showFloderChanged;
    private onclick;
    private onrightclick;
}
//# sourceMappingURL=AssetTreeItemRenderer.d.ts.map