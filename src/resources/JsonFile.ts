namespace editor
{
    export class JsonFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.json;

        jsonContent: string;

        protected saveFile(readWriteAssets: feng3d.ReadWriteAssets, callback?: (err: Error) => void)
        {
            readWriteAssets.writeString(this.filePath, this.jsonContent, callback);
        }
    }
}