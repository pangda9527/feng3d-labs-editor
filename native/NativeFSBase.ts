import * as fs from 'fs';
import * as path from 'path';

/**
 * Native文件系统
 */
export var nativeFS: NativeFSBase;

/**
 * Native文件系统
 */
export class NativeFSBase
{
    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    exists(path: string, callback: (exists: boolean) => void): void
    {
        if (!path) { callback(false); return; }

        fs.stat(path, (err, stats) =>
        {
            callback(!!stats);
        });
    }

    /**
     * 读取文件夹中文件列表
     * @param path 路径
     * @param callback 回调函数
     */
    readdir(path: string, callback: (err: Error, files: string[]) => void): void
    {
        fs.readdir(path, callback);
    }

    /**
     * 新建文件夹
     * 
     * 如果父文件夹不存在则新建
     * 
     * @param p 文件夹路径
     * @param callback 回调函数
     */
    mkdir(p: string, callback: (err: Error) => void): void
    {
        var dirPath = path.dirname(p);
        this.exists(dirPath, exists =>
        {
            if (!exists)
            {
                this.mkdir(dirPath, err =>
                {
                    if (err) { callback(err); return; }
                    this.mkdir(p, callback);
                });
                return;
            }
            fs.exists(p, exists =>
            {
                if (exists) { callback(null); return; }
                fs.mkdir(p, callback);
            });
        });
    }

    /**
     * 读取文件
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readFile(path: string, callback: (err: Error, data: ArrayBuffer) => void)
    {
        fs.readFile(path, callback);
    }

    /**
     * 删除文件
     * 
     * @param path 文件路径
     * @param callback 完成回调
     */
    deleteFile(path: string, callback: (err: Error) => void): void
    {
        fs.unlink(path, callback);
    }

    /**
     * 删除文件夹
     * 
     * @param path 文件夹路径
     * @param callback 完成回调
     */
    rmdir(path: string, callback: (err: Error) => void)
    {
        fs.rmdir(path, callback);
    }

    /**
     * 是否为文件夹
     * 
     * @param path 文件路径
     * @param callback 完成回调
     */
    isDirectory(path: string, callback: (result: boolean) => void)
    {
        fs.stat(path, (err, stats) =>
        {
            callback(stats && stats.isDirectory());
        });
    }

    /**
     * 写ArrayBuffer(新建)文件
     * 
     * 如果所在文件夹不存时新建文件夹
     * 
     * @param filePath 文件路径
     * @param data 文件数据
     * @param callback 回调函数
     */
    writeFile(filePath: string, data: ArrayBuffer, callback: (err: Error) => void): void
    {
        var dirPath = path.dirname(filePath);
        this.exists(dirPath, exists =>
        {
            if (!exists)
            {
                this.mkdir(dirPath, err =>
                {
                    if (err) { callback(err); return; }
                    this.writeFile(filePath, data, callback);
                });
                return;
            }
            var buffer = new Buffer(data);
            fs.writeFile(filePath, buffer, "binary", callback);
        });
    }
}
nativeFS = new NativeFSBase();