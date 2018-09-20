namespace editor
{
    export class ShaderFile extends Feng3dFile
    {
        assetType = feng3d.AssetExtension.shader;

        shaderContent: string;
    }
}