import { OVComponent, IObjectView, FolderAsset, ObjectViewInfo } from 'feng3d';
import { editorAsset } from '../../ui/assets/EditorAsset';

@OVComponent()
export class OVFolderAsset extends eui.Component implements IObjectView
{
    space: FolderAsset;
    private _objectViewInfo: ObjectViewInfo;

    public nameLabel: eui.Label;
    public openBtn: eui.Button;

    constructor(objectViewInfo: ObjectViewInfo)
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
