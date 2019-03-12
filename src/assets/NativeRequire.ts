interface NodeRequire { }
declare var require: NodeRequire;
declare var __dirname: string;

namespace editor
{
    /**
     * 本地文件系统
     */
    export var nativeFS: NativeFSBase;

    /**
     * 本地API
     */
    export var nativeAPI: NativeAPI;

    /**
     * 是否支持本地API
     */
    export var supportNative = !(typeof __dirname == "undefined");

    if (supportNative)
    {
        nativeFS = require(__dirname + "/native/NativeFSBase.js").nativeFS;
        nativeAPI = require(__dirname + "/native/electron_renderer.js");
    }

    /**
     * 本地API
     */
    export interface NativeAPI
    {
        /**
         * 选择文件夹对话框
         * 
         * @param callback 完成回调
         */
        selectDirectoryDialog(callback: (event: Event, path: string) => void): void;

        /**
         * 在资源管理器中显示
         * 
         * @param fullPath 完整路径
         */
        showFileInExplorer(fullPath: string): void;

        /**
         * 使用 VSCode 打开项目
         * 
         * @param  projectPath 项目路径
         */
        vscodeOpenProject(projectPath: string): void;
    }

    /**
     * Native文件系统
     */
    export interface NativeFSBase
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