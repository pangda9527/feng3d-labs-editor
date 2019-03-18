import { NativeFSBase } from "./NativeRequire";
/**
 * 本地文件系统
 */
export declare class NativeFS extends feng3d.ReadWriteFS {
    /**
     * 项目路径
     */
    projectname: string;
    /**
     * 文件系统类型
     */
    readonly type: feng3d.FSType;
    fs: NativeFSBase;
    constructor(fs: NativeFSBase);
    /**
     * 读取文件为ArrayBuffer
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readArrayBuffer(path: string, callback: (err: Error, arraybuffer: ArrayBuffer) => void): void;
    /**
     * 读取文件为字符串
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readString(path: string, callback: (err: Error, str: string) => void): void;
    /**
     * 读取文件为Object
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readObject(path: string, callback: (err: Error, object: Object) => void): void;
    /**
     * 加载图片
     * @param path 图片路径
     * @param callback 加载完成回调
     */
    readImage(path: string, callback: (err: Error, img: HTMLImageElement) => void): void;
    /**
     * 获取文件绝对路径
     * @param path （相对）路径
     */
    getAbsolutePath(path: string): string;
    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    exists(path: string, callback: (exists: boolean) => void): void;
    /**
     * 是否为文件夹
     *
     * @param path 文件路径
     * @param callback 完成回调
     */
    isDirectory(path: string, callback: (result: boolean) => void): void;
    /**
     * 读取文件夹中文件列表
     *
     * @param path 路径
     * @param callback 回调函数
     */
    readdir(path: string, callback: (err: Error, files: string[]) => void): void;
    /**
     * 新建文件夹
     * @param path 文件夹路径
     * @param callback 回调函数
     */
    mkdir(path: string, callback?: (err: Error) => void): void;
    /**
     * 删除文件
     * @param path 文件路径
     * @param callback 回调函数
     */
    deleteFile(path: string, callback?: (err: Error) => void): void;
    /**
     * 写ArrayBuffer(新建)文件
     * @param path 文件路径
     * @param arraybuffer 文件数据
     * @param callback 回调函数
     */
    writeArrayBuffer(path: string, arraybuffer: ArrayBuffer, callback?: (err: Error) => void): void;
    /**
     * 写字符串到(新建)文件
     * @param path 文件路径
     * @param str 文件数据
     * @param callback 回调函数
     */
    writeString(path: string, str: string, callback?: (err: Error) => void): void;
    /**
     * 写Object到(新建)文件
     * @param path 文件路径
     * @param object 文件数据
     * @param callback 回调函数
     */
    writeObject(path: string, object: Object, callback?: (err: Error) => void): void;
    /**
     * 写图片
     * @param path 图片路径
     * @param image 图片
     * @param callback 回调函数
     */
    writeImage(path: string, image: HTMLImageElement, callback?: (err: Error) => void): void;
    /**
     * 复制文件
     * @param src    源路径
     * @param dest    目标路径
     * @param callback 回调函数
     */
    copyFile(src: string, dest: string, callback?: (err: Error) => void): void;
    /**
     * 是否存在指定项目
     * @param projectname 项目名称
     * @param callback 回调函数
     */
    hasProject(projectname: string, callback: (has: boolean) => void): void;
    /**
     * 初始化项目
     * @param projectname 项目名称
     * @param callback 回调函数
     */
    initproject(projectname: string, callback: (err?: Error) => void): void;
}
//# sourceMappingURL=NativeFS.d.ts.map