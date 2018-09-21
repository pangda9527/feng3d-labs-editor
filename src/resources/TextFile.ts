namespace editor
{
    export class TextFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.txt;

        textContent: string;

        protected saveFile(readWriteAssets: feng3d.ReadWriteAssets, callback?: (err: Error) => void)
        {
            readWriteAssets.writeString(this.filePath, this.textContent, callback);
        }
    }
}