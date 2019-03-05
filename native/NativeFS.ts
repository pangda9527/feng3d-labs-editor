/// <reference path="../../feng3d/out/feng3d.d.ts" />

import * as fs from 'fs';

/**
 * Native文件系统
 */
export var nativeFS: NativeFS;

/**
 * Native文件系统
 */
export class NativeFS implements feng3d.ReadWriteFS
{
    get type()
    {
        return feng3d.FSType.native;
    }

    /**
     * 工作空间路径，工作空间内存放所有编辑器项目
     */
    workspace = "c:/editorworkspace/";

    /**
     * 项目名称
     */
    projectname = "testproject";

    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    exists(path: string, callback: (exists: boolean) => void): void
    {
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            fs.exists(absolutePath, callback);
        });
    }

    /**
     * 读取文件夹中文件列表
     * @param path 路径
     * @param callback 回调函数
     */
    readdir(path: string, callback: (err: Error, files: string[]) => void): void
    {
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            fs.readdir(absolutePath, (err, files) =>
            {
                files = files.map(file =>
                {
                    // 文件夹添加结尾标记 "/"
                    if (fs.statSync(absolutePath + file).isDirectory())
                    {
                        file += "/";
                    }
                    return file;
                });
                callback(err, files);
            });
        });
    }

    /**
     * 新建文件夹
     * @param path 文件夹路径
     * @param callback 回调函数
     */
    mkdir(path: string, callback: (err: Error) => void): void
    {
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            if (fs.existsSync(absolutePath))
                callback(null);
            else
                fs.mkdir(absolutePath, callback);
        });
    }

    /**
     * 读取文件
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readFile(path: string, callback: (err: Error, data: ArrayBuffer) => void)
    {
        if (path.charAt(path.length - 1) == "/")
        {
            callback(null, null);
            return;
        }
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            fs.open(absolutePath, "r", (err, fd) =>
            {
                if (err)
                {
                    callback(err, null);
                    return;
                }
                fs.readFile(absolutePath, (err, data) =>
                {
                    fs.close(fd, (err) =>
                    {
                        callback(err, data.buffer);
                    });
                });
            });
        });
    }

    /**
     * 删除文件
     * @param path 文件路径
     * @param callback 回调函数
     */
    deleteFile(path: string, callback: (err: Error) => void): void
    {
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            fs.stat(absolutePath, (err, stats) =>
            {
                if (err) { callback(err); return; };
                if (stats.isDirectory)
                {
                    fs.rmdir(absolutePath, callback);
                } else
                {
                    fs.unlink(absolutePath, callback);
                }
            });
        });
    }

    /**
     * 写ArrayBuffer(新建)文件
     * 
     * @param path 文件路径
     * @param data 文件数据
     * @param callback 回调函数
     */
    writeArrayBuffer(path: string, data: ArrayBuffer, callback?: (err: Error) => void): void
    {
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            var buffer = new Buffer(data);
            fs.open(absolutePath, "w", (err, fd) =>
            {
                if (err)
                {
                    callback && callback(err);
                    return;
                }
                fs.writeFile(absolutePath, buffer, "binary", (err) =>
                {
                    fs.close(fd, (err) =>
                    {
                        callback && callback(err);
                    });
                });
            });
        });
    }

    /**
     * 写字符串到(新建)文件
     * @param path 文件路径
     * @param str 文件数据
     * @param callback 回调函数
     */
    writeString(path: string, str: string, callback?: (err: Error) => void)
    {
        this.getAbsolutePath(path, (err, absolutePath) =>
        {
            fs.open(absolutePath, "w", (err, fd) =>
            {
                if (err)
                {
                    callback && callback(err);
                    return;
                }
                fs.writeFile(absolutePath, str, "utf8", (err) =>
                {
                    fs.close(fd, (err) =>
                    {
                        callback && callback(err);
                    });
                });
            });
        });
    }

    /**
     * 写Object到(新建)文件
     * 
     * @param path 文件路径
     * @param object 文件数据
     * @param callback 回调函数
     */
    writeObject: (path: string, object: Object, callback?: (err: Error) => void) => void;

    /**
     * 写图片
     * @param path 图片路径
     * @param image 图片
     * @param callback 回调函数
     */
    writeImage: (path: string, image: HTMLImageElement, callback?: (err: Error) => void) => void;

    /**
     * 复制文件
     * @param src    源路径
     * @param dest    目标路径
     * @param callback 回调函数
     */
    copyFile: (src: string, dest: string, callback?: (err: Error) => void) => void;

    /**
     * 获取项目列表
     * @param callback 回调函数
     */
    getProjectList(callback: (err: Error, projects: string[]) => void)
    {
        fs.readdir(this.workspace, (err, files) =>
        {
            callback(err, files);
        });
    }

    /**
     * 获取文件绝对路径
     * @param path （相对）路径
     * @param callback 回调函数
     */
    getAbsolutePath(path: string, callback: (err: Error, absolutePath: string) => void): void
    {
        callback(null, this.workspace + this.projectname + "/" + path);
    }
}
nativeFS = new NativeFS();