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

        /**
         * 保存资源
         * @param readWriteAssets 
         * @param callback  完成回调 
         */
        save(readWriteAssets: feng3d.ReadWriteAssets, callback?: (err: Error) => void): any
        {
            super.save(readWriteAssets, (err) =>
            {
                if (err)
                {
                    callback(err);
                    return;
                }
                this.saveFile(readWriteAssets, callback);
            });
        }

        protected saveFile(readWriteAssets: feng3d.ReadWriteAssets, callback?: (err: Error) => void)
        {
            readWriteAssets.writeArrayBuffer(this.filePath, this.arraybuffer, callback);
        }

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