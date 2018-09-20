namespace editor
{
    export class TextFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.txt;

        textContent: string;
    }
}