import { AssetNode } from "./AssetNode";
export declare class AssetFileItemRenderer extends eui.ItemRenderer {
    icon: eui.Image;
    data: AssetNode;
    itemSelected: boolean;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    dataChanged(): void;
    private ondoubleclick;
    private onclick;
    private onrightclick;
    private selectedfilechanged;
}
//# sourceMappingURL=AssetFileItemRenderer.d.ts.map