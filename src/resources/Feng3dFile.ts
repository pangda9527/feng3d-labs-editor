namespace editor
{
    export class Feng3dFile extends feng3d.Feng3dAssets
    {
        /**
         * 文件名称
         */
        @feng3d.serialize
        filename: string;

        /**
         * 文件数据
         */
        arraybuffer: ArrayBuffer;

        get filePath()
        {
            return `Library/${this.assetsId}/file/` + this.filename;
        }
    }
}