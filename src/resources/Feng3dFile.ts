namespace editor
{
    export class Feng3dFile extends feng3d.Feng3dAssets
    {
        /**
         * 文件名称
         */
        @feng3d.serialize
        @feng3d.watch("fileNameChanged")
        filename: string;

        /**
         * 文件数据
         */
        arraybuffer: ArrayBuffer;

        /**
         * 文件路径
         */
        filePath: string;

        protected fileNameChanged()
        {
            this.filePath = `Library/${this.assetsId}/file/` + this.filename;
        }

        protected assetsIdChanged()
        {
            super.assetsIdChanged();
            this.filePath = `Library/${this.assetsId}/file/` + this.filename;
        }
    }
}