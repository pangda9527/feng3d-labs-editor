namespace editor
{
    export class JSFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.js;

        jsContent: string;

        protected saveFile(readWriteAssets: feng3d.ReadWriteAssets, callback?: (err: Error) => void)
        {
            readWriteAssets.writeString(this.filePath, this.jsContent, callback);
        }
    }
}