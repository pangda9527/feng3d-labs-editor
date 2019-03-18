import { TreeItemRenderer } from "../components/TreeItemRenderer";
import { HierarchyNode } from "../../feng3d/hierarchy/HierarchyNode";
export declare class HierarchyTreeItemRenderer extends TreeItemRenderer {
    data: HierarchyNode;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private setdargSource;
    private onclick;
    private onDoubleClick;
    private onrightclick;
}
//# sourceMappingURL=HierarchyTreeItemRenderer.d.ts.map