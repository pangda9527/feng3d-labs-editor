export declare class AssetView extends eui.Component implements eui.UIComponent {
    assetTreeScroller: eui.Scroller;
    assetTreeList: eui.List;
    floderpathTxt: eui.Label;
    includeTxt: eui.TextInput;
    excludeTxt: eui.TextInput;
    filelistgroup: eui.Group;
    floderScroller: eui.Scroller;
    filelist: eui.List;
    filepathLabel: eui.Label;
    private _assettreeInvalid;
    private listData;
    private filelistData;
    private fileDrag;
    constructor();
    private onComplete;
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private initlist;
    private update;
    invalidateAssettree(): void;
    private updateAssetTree;
    private updateShowFloder;
    private onfilter;
    private selectedfilechanged;
    private onfilelistclick;
    private onfilelistrightclick;
    private onfloderpathTxtLink;
    private areaSelectStartPosition;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
}
//# sourceMappingURL=AssetView.d.ts.map