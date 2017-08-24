namespace feng3d.editor
{
    /**
     * Created by 黑暗之神KDS on 2017/2/17.
     */
    /**
     * 文件对象
     * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
     * -- 其他端支持绝对路径
     * Created by kds on 2017/1/21 0021.
     */
    export class FileObject
    {
        // /**
        //  * 判断文件名是否合法
        //  * @param fileName 文件名
        //  */
        // static isLegalName(fileName: string): boolean;
        // /**
        //  * 构造函数
        //  *  -- 当存在path且isGetFileInfo==true的时候会自动探索基本信息
        //  *       -- 是否存在
        //  *       -- 文件大小
        //  *       -- 创建日期
        //  *       -- 最近一次的修改日期
        //  * @param path 路径 文件夹 kds\\test  文件 kds\\test\\file.js
        //  * @param onComplete 探查该文件完毕后的回调 onComplete([object FileObject])
        //  * @param thisPtr 执行域
        //  * @param onError 当错误时返回 onError([object FileObject])
        //  * @param isGetFileInfo 初始就获取下该文件的基本信息
        //  */
        constructor(path: string = "", onComplete: Function = null, thisPtr: any = null, onError: Function = null, isGetFileInfo: boolean = true)
        {
            var sp = this;
            file.stat(path, (err, info) =>
            {
                console.log(sp, this, path, err, info);
            });
        }

        // /**
        //  * 文件/文件夹是否存在 基本探索过后才可知道是否存在
        //  */
        // get exists(): boolean;

        // /**
        //  * 是否是文件夹
        //  */
        // get isDirectory(): boolean;

        // /**
        //  * 创建日期
        //  */
        // get createDate(): Date;

        // /**
        //  * 上次修改日期
        //  */
        // get lastModifyDate(): Date;

        // /**
        //  * 路径
        //  * -- WEB端是相对路径
        //  * -- 其他端支持绝对路径 file:///xxx/yyy
        //  */
        // get path(): string;
        // set path(v: string);

        // /**
        //  * 文件或文件夹名 xxx.ks
        //  */
        // get fileName(): string;

        // /**
        //  * 不包含格式的文件名称 如 xxx.ks就是xxx
        //  */
        // get fileNameWithoutExt(): string;

        // /**
        //  * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
        //  */
        // get location(): string;

        // /**
        //  * 绝对路径
        //  * -- WEB端的是 http://xxxx
        //  * -- 其他端的是 file:///xxxx
        //  */
        // get fullPath(): string;

        // /**
        //  * 格式
        //  */
        // get extension(): string;

        // /**
        //  * 获取该文件下的目录
        //  * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
        //  * @param onError 失败时回调 onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // getDirectoryListing(onComplete: Function, onError: Function, thisPtr: any): void;

        // /**
        //  * 创建文件夹
        //  * @param onComplete 完成时回调 onComplete([object FileObject])
        //  * @param onError 错误时回调 onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // createDirectory(onComplete: Function, onError: Function, thisPtr: any): void;
        // /**
        //  * 创建文件
        //  * @param content 初次创建时的内容 一般可为""
        //  * @param onComplete 完成时回调 onComplete([object FileObject])
        //  * @param onError 错误时回调 onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // createFile(content: string, onComplete: Function, onError: Function, thisPtr: any): void;

        // /**
        //  * 储存文件（文本格式）
        //  * @param content 文件内容文本
        //  * @param onComplete 完成时回调 onComplete([object FileObject])
        //  * @param onError 错误时回调 onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // saveFile(content: string, onComplete: Function, onError: Function, thisPtr: any): void;

        // /**
        //  * 重命名
        //  * @param newName 重命名
        //  * @param onComplete 完成时回调 onComplete([object FileObject])
        //  * @param onError 错误时回调 onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // rename(newName: string, onComplete: Function, onError: Function, thisPtr: any): void;

        // /**
        //  * 移动文件夹
        //  * @param newPath 新的路径
        //  * @param onComplete 完成时回调 onComplete([object FileObject])
        //  * @param onError 失败时回调  onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // move(newPath: string, onComplete: Function, onError: Function, thisPtr: any): void;

        // /**
        //  * 删除文件（夹）
        //  * @param onComplete onComplete([object FileObject])
        //  * @param onError onError([object FileObject])
        //  * @param thisPtr 执行域
        //  */
        // delete(onComplete: Function, onError: Function, thisPtr: any): void;

        // /**
        //  * 打开文件
        //  * @param onFin 完成时回调 onFin(txt:string)
        //  * @param onError 错误时回调 onError([fileObject])
        //  */
        // open(onFin: Function, onError: Function);
    }
}