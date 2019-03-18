import { TreeNode } from "./TreeNode";
export declare class TreeItemRenderer extends eui.ItemRenderer {
    contentGroup: eui.Group;
    disclosureButton: eui.ToggleButton;
    /**
     * 子结点相对父结点的缩进值，以像素为单位。默认17。
     */
    indentation: number;
    data: TreeNode;
    private watchers;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private onDisclosureButtonClick;
    private updateView;
}
//# sourceMappingURL=TreeItemRenderer.d.ts.map