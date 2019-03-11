namespace editor
{
    /**
     * 本地文件系统
     */
    export class NativeFS extends feng3d.ReadWriteFS
    {

        /**
         * 工作空间路径，工作空间内存放所有编辑器项目
         */
        workspace = "c:/editorworkspace";

        /**
         * 项目名称
         */
        projectname = "testproject";

        /**
         * 文件系统类型
         */
        readonly type = feng3d.FSType.native;

        fs: NativeFSBase;

        constructor(fs: NativeFSBase)
        {
            super();
            this.fs = fs;
        }

        /**
         * 读取文件为ArrayBuffer
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readArrayBuffer(path: string, callback: (err: Error, arraybuffer: ArrayBuffer) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.fs.readFile(realPath, callback);
        }

        /**
         * 读取文件为字符串
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readString(path: string, callback: (err: Error, str: string) => void)
        {
            this.readArrayBuffer(path, (err, data) =>
            {
                if (err) { callback(err, null); return; }
                feng3d.dataTransform.arrayBufferToString(data, (content) =>
                {
                    callback(null, content);
                });
            });
        }

        /**
         * 读取文件为Object
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readObject(path: string, callback: (err: Error, object: Object) => void)
        {
            this.readArrayBuffer(path, (err, buffer) =>
            {
                if (err) { callback(err, null); return; }
                feng3d.dataTransform.arrayBufferToObject(buffer, (content) =>
                {
                    var object = feng3d.serialization.deserialize(content);
                    callback(null, object);
                });
            });
        }

        /**
         * 加载图片
         * @param path 图片路径
         * @param callback 加载完成回调
         */
        readImage(path: string, callback: (err: Error, img: HTMLImageElement) => void)
        {
            this.readArrayBuffer(path, (err, buffer) =>
            {
                if (err) { callback(err, null); return; }
                feng3d.dataTransform.arrayBufferToImage(buffer, (image) =>
                {
                    callback(null, image);
                });
            });
        }

        /**
         * 获取文件绝对路径
         * @param path （相对）路径
         */
        getAbsolutePath(path: string)
        {
            return this.workspace + "/" + this.projectname + "/" + path;
        }

        /**
         * 文件是否存在
         * @param path 文件路径
         * @param callback 回调函数
         */
        exists(path: string, callback: (exists: boolean) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.fs.exists(realPath, callback);
        }

        /**
         * 是否为文件夹
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        isDirectory(path: string, callback: (result: boolean) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.fs.isDirectory(realPath, callback);
        }

        /**
         * 读取文件夹中文件列表
         * 
         * @param path 路径
         * @param callback 回调函数
         */
        readdir(path: string, callback: (err: Error, files: string[]) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.fs.readdir(realPath, callback);
        }

        /**
         * 新建文件夹
         * @param path 文件夹路径
         * @param callback 回调函数
         */
        mkdir(path: string, callback?: (err: Error) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.fs.mkdir(realPath, callback);
        }

        /**
         * 删除文件
         * @param path 文件路径
         * @param callback 回调函数
         */
        deleteFile(path: string, callback?: (err: Error) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.isDirectory(path, result =>
            {
                if (result)
                {
                    this.fs.rmdir(realPath, callback);
                } else
                {
                    this.fs.deleteFile(realPath, callback);
                }
            });
        }

        /**
         * 写ArrayBuffer(新建)文件
         * @param path 文件路径
         * @param arraybuffer 文件数据
         * @param callback 回调函数
         */
        writeArrayBuffer(path: string, arraybuffer: ArrayBuffer, callback?: (err: Error) => void)
        {
            var realPath = this.getAbsolutePath(path);
            this.fs.writeFile(realPath, arraybuffer, callback);
        }

        /**
         * 写字符串到(新建)文件
         * @param path 文件路径
         * @param str 文件数据
         * @param callback 回调函数
         */
        writeString(path: string, str: string, callback?: (err: Error) => void)
        {
            var buffer = feng3d.dataTransform.stringToArrayBuffer(str);
            this.writeArrayBuffer(path, buffer, callback);
        }

        /**
         * 写Object到(新建)文件
         * @param path 文件路径
         * @param object 文件数据
         * @param callback 回调函数
         */
        writeObject(path: string, object: Object, callback?: (err: Error) => void)
        {
            var obj = feng3d.serialization.serialize(object);
            var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1')
            this.writeString(path, str, callback);
        }

        /**
         * 写图片
         * @param path 图片路径
         * @param image 图片
         * @param callback 回调函数
         */
        writeImage(path: string, image: HTMLImageElement, callback?: (err: Error) => void)
        {
            feng3d.dataTransform.imageToArrayBuffer(image, (buffer) =>
            {
                this.writeArrayBuffer(path, buffer, callback);
            });
        }

        /**
         * 复制文件
         * @param src    源路径
         * @param dest    目标路径
         * @param callback 回调函数
         */
        copyFile(src: string, dest: string, callback?: (err: Error) => void)
        {
            this.readArrayBuffer(src, (err, buffer) =>
            {
                if (err) { callback && callback(err); return; }
                this.writeArrayBuffer(dest, buffer, callback);
            });
        }

        /**
         * 获取项目列表
         * 
         * @param callback 完成回调
         */
        getProjectList(callback: (err: Error, projects: string[]) => void)
        {
            this.fs.readdir(this.workspace, callback);
        }

        /**
         * 初始化项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        initproject(projectname: string, callback: (err: Error) => void)
        {
            this.projectname = projectname;
            this.fs.mkdir(this.workspace + "/" + this.projectname, callback);
        }
    }

    /**
     * Native文件系统
     */
    interface NativeFSBase
    {
        /**
         * 文件是否存在
         * @param path 文件路径
         * @param callback 回调函数
         */
        exists(path: string, callback: (exists: boolean) => void): void;
        /**
         * 读取文件夹中文件列表
         * @param path 路径
         * @param callback 回调函数
         */
        readdir(path: string, callback: (err: Error, files: string[]) => void): void;
        /**
         * 新建文件夹
         *
         * @param path 文件夹路径
         * @param callback 回调函数
         */
        mkdir(path: string, callback: (err: Error) => void): void;
        /**
         * 读取文件
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readFile(path: string, callback: (err: Error, data: ArrayBuffer) => void): void;
        /**
         * 删除文件
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        deleteFile(path: string, callback: (err: Error) => void): void;
        /**
         * 删除文件夹
         *
         * @param path 文件夹路径
         * @param callback 完成回调
         */
        rmdir(path: string, callback: (err: Error) => void): void;
        /**
         * 是否为文件夹
         *
         * @param path 文件路径
         * @param callback 完成回调
         */
        isDirectory(path: string, callback: (result: boolean) => void): void;
        /**
         * 写ArrayBuffer(新建)文件
         *
         * @param path 文件路径
         * @param data 文件数据
         * @param callback 回调函数
         */
        writeFile(path: string, data: ArrayBuffer, callback: (err: Error) => void): void;
    }
}