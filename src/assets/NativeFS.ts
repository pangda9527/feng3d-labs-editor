import { dataTransform, FSType, globalEmitter, IReadWriteFS } from 'feng3d';
import { editorcache } from '../caches/Editorcache';
import { nativeAPI, NativeFSBase } from './NativeRequire';

/**
 * 本地文件系统
 */
export class NativeFS implements IReadWriteFS
{
    /**
     * 项目路径
     */
    projectname: string;

    /**
     * 文件系统类型
     */
    readonly type = FSType.native;

    fs: NativeFSBase;

    constructor(fs: NativeFSBase)
    {
        this.fs = fs;
    }

    /**
     * 读取文件为ArrayBuffer
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readArrayBuffer(path: string, callback: (err: Error, arraybuffer: ArrayBuffer) => void)
    {
        const realPath = this.getAbsolutePath(path);
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
            if (err)
            {
                callback(err, null);

                return;
            }
            dataTransform.arrayBufferToString(data, (content) =>
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
            if (err)
            {
                callback(err, null);

                return;
            }
            dataTransform.arrayBufferToObject(buffer, (content) =>
            {
                callback(null, content);
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
        this.exists(path, (exists) =>
        {
            if (exists)
            {
                const img = new Image();
                img.onload = function ()
                {
                    callback(null, img);
                };
                img.onerror = (_evt) =>
                {
                    callback(new Error(`加载图片${path}失败`), null);
                };
                img.src = this.getAbsolutePath(path);
            }
            else
            {
                callback(new Error(`图片资源 ${path} 不存在`), null);
            }
        });
    }

    /**
     * 获取文件绝对路径
     * @param path （相对）路径
     */
    getAbsolutePath(path: string)
    {
        if (!this.projectname)
        {
            console.error(`请先使用 initproject 初始化项目`);
        }

        return `${this.projectname}/${path}`;
    }

    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    exists(path: string, callback: (exists: boolean) => void)
    {
        const realPath = this.getAbsolutePath(path);
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
        const realPath = this.getAbsolutePath(path);
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
        const realPath = this.getAbsolutePath(path);
        this.fs.readdir(realPath, callback);
    }

    /**
     * 新建文件夹
     * @param path 文件夹路径
     * @param callback 回调函数
     */
    mkdir(path: string, callback?: (err: Error) => void)
    {
        const realPath = this.getAbsolutePath(path);
        this.fs.mkdir(realPath, callback);
    }

    /**
     * 删除文件
     * @param path 文件路径
     * @param callback 回调函数
     */
    deleteFile(path: string, callback?: (err: Error) => void)
    {
        callback = callback || (() => { });
        const realPath = this.getAbsolutePath(path);
        this.isDirectory(path, (result) =>
        {
            if (result)
            {
                this.fs.rmdir(realPath, callback);
            }
            else
            {
                this.fs.deleteFile(realPath, callback);
            }
        });
        globalEmitter.emit('fs.delete', path);
    }

    /**
     * 写ArrayBuffer(新建)文件
     * @param path 文件路径
     * @param arraybuffer 文件数据
     * @param callback 回调函数
     */
    writeArrayBuffer(path: string, arraybuffer: ArrayBuffer, callback?: (err: Error) => void)
    {
        const realPath = this.getAbsolutePath(path);
        this.fs.writeFile(realPath, arraybuffer, (err) => { callback && callback(err); });
        globalEmitter.emit('fs.write', path);
    }

    /**
     * 写字符串到(新建)文件
     * @param path 文件路径
     * @param str 文件数据
     * @param callback 回调函数
     */
    writeString(path: string, str: string, callback?: (err: Error) => void)
    {
        const buffer = dataTransform.stringToArrayBuffer(str);
        this.writeArrayBuffer(path, buffer, callback);
        globalEmitter.emit('fs.write', path);
    }

    /**
     * 写Object到(新建)文件
     * @param path 文件路径
     * @param object 文件数据
     * @param callback 回调函数
     */
    writeObject(path: string, object: Object, callback?: (err: Error) => void)
    {
        const str = JSON.stringify(object, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        this.writeString(path, str, callback);
        globalEmitter.emit('fs.write', path);
    }

    /**
     * 写图片
     * @param path 图片路径
     * @param image 图片
     * @param callback 回调函数
     */
    writeImage(path: string, image: HTMLImageElement, callback?: (err: Error) => void)
    {
        dataTransform.imageToArrayBuffer(image, (buffer) =>
        {
            this.writeArrayBuffer(path, buffer, callback);
        });
        globalEmitter.emit('fs.write', path);
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
            if (err)
            {
                callback && callback(err);

                return;
            }
            this.writeArrayBuffer(dest, buffer, callback);
        });
    }
    /**
     * 是否存在指定项目
     * @param projectname 项目名称
     * @param callback 回调函数
     */
    hasProject(projectname: string, callback: (has: boolean) => void)
    {
        this.fs.exists(projectname, callback);
    }
    /**
     * 初始化项目
     * @param _projectname 项目名称
     * @param callback 回调函数
     */
    initproject(_projectname: string, callback: (err?: Error) => void)
    {
        this.fs.exists(editorcache.projectname, (exists) =>
        {
            if (exists)
            {
                this.projectname = editorcache.projectname;
                callback();

                return;
            }
            nativeAPI.selectDirectoryDialog((_event, path) =>
            {
                editorcache.projectname = this.projectname = path;
                callback();
            });
        });
    }
}
