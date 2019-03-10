/**
 * Native文件系统
 */
export declare var nativeFS: NativeFSBase;
/**
 * Native文件系统
 */
export declare class NativeFSBase {
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
