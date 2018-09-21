namespace editor
{
    export class ShaderFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.shader;

        shaderContent: string;

        protected saveFile(readWriteAssets: feng3d.ReadWriteAssets, callback?: (err: Error) => void)
        {
            readWriteAssets.writeString(this.filePath, this.shaderContent, callback);
        }
    }
}