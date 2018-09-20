namespace editor
{
    export class JsonFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.json;

        jsonContent: string;
    }
}