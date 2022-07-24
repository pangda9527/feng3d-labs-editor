
@feng3d.OVComponent()
export class OVFolderAsset extends eui.Component implements feng3d.IObjectView
{
    space: feng3d.FolderAsset;
    private _objectViewInfo: feng3d.ObjectViewInfo;

    public nameLabel: eui.Label;
    public openBtn: eui.Button;

    constructor(objectViewInfo: feng3d.ObjectViewInfo)
    {
        super();
        this.skinName = "OVFolderAsset";
        this._objectViewInfo = objectViewInfo;
        this.space = <any>objectViewInfo.owner;
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel);


        this.openBtn.addEventListener(egret.MouseEvent.CLICK, this.onOpenBtnClick, this);

        this.updateView();
    }

    $onRemoveFromStage()
    {
        this.openBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOpenBtnClick, this);

        super.$onRemoveFromStage()
    }

    updateView()
    {
        if (!this.stage) return;

        this.nameLabel.name = this.space.fileName;
    }

    getAttributeView(attributeName: String)
    {
        return null;
    }

    getblockView(blockName: String)
    {
        return null;
    }

    private onOpenBtnClick()
    {
        editorAsset.showFloder = editorAsset.getAssetByID(this.space.assetId);
    }
}
