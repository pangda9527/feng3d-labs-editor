namespace editor
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
        /**
         * 判断文件名是否合法
         * @param fileName 文件名
         */
        static isLegalName(fileName: string): boolean
        {
            return true;
        }

        /**
         * 构造函数
         *  -- 当存在path且isGetFileInfo==true的时候会自动探索基本信息
         *       -- 是否存在
         *       -- 文件大小
         *       -- 创建日期
         *       -- 最近一次的修改日期
         * @param path 路径 文件夹 kds\\test  文件 kds\\test\\file.js
         * @param onComplete 探查该文件完毕后的回调 onComplete([object FileObject])
         * @param thisPtr 执行域
         * @param onError 当错误时返回 onError([object FileObject])
         * @param isGetFileInfo 初始就获取下该文件的基本信息
         */
        constructor(path: string, onComplete: Function, thisPtr: any, onError: Function, isGetFileInfo: boolean)
        {
            this.updateStats(path, null, onComplete, onError);
        }

        /**
         * 文件/文件夹是否存在 基本探索过后才可知道是否存在
         */
        get exists()
        {
            return this._exists;
        }
        private _exists: boolean;

        /**
         * 文件尺寸
         */
        get size()
        {
            return this._size;
        }
        private _size: number;

        /**
         * 是否是文件夹
         */
        get isDirectory()
        {
            return this._isDirectory;
        }
        private _isDirectory: boolean;

        /**
         * 创建日期
         */
        get createDate()
        {
            return this._createDate;
        }
        private _createDate: Date;

        /**
         * 上次修改日期
         */
        get lastModifyDate()
        {
            return this._lastModifyDate;
        }
        private _lastModifyDate: Date;

        /**
         * 路径
         * -- WEB端是相对路径
         * -- 其他端支持绝对路径 file:///xxx/yyy
         */
        get path()
        {
            return this._path;
        }
        private _path: string;

        /**
         * 文件或文件夹名 xxx.ks
         */
        get fileName()
        {
            var fileName = this.path.split("/").pop();
            return fileName;
        }

        /**
         * 不包含格式的文件名称 如 xxx.ks就是xxx
         */
        get fileNameWithoutExt()
        {
            var fileName = this.fileName;
            var fileNameWithoutExt = (fileName.indexOf(".") == -1) ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
            return fileNameWithoutExt;
        }

        /**
         * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
         */
        get location()
        {
            var paths = this.path.split("/");
            paths.pop();
            var location = paths.join("/");
            return location;
        }

        /**
         * 绝对路径
         * -- WEB端的是 http://xxxx
         * -- 其他端的是 file:///xxxx
         */
        get fullPath()
        {
            return this._path;
        }

        /**
         * 格式
         */
        get extension()
        {
            var fileName = this.fileName;

            if (fileName.indexOf(".") == -1)
                return "";
            var extension = fileName.split(".").pop();
            return extension;
        }

        /**
         * 获取该文件下的目录
         * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
         * @param onError 失败时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        getDirectoryListing(onComplete: Function, onError: Function, thisPtr: any): void
        {
            editorFS.fs.readdir(this._path, (err, files) =>
            {
                if (err)
                {
                    feng3d.warn(err);
                    onError(this);
                } else
                {
                    onComplete(this, files);
                }
            });
        }

        /**
         * 创建文件夹
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createDirectory(onComplete: Function, onError: Function, thisPtr: any): void
        {
            editorFS.fs.mkdir(this._path, (err) =>
            {
                if (err)
                {
                    feng3d.warn(this);
                    onError(this);
                    return;
                }

                this.updateStats(this._path, () =>
                {
                    onComplete(this);
                });
            });
        }

        /**
         * 创建文件
         * @param content 初次创建时的内容 一般可为""
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createFile(content: string | ArrayBuffer, onComplete: Function, onError: Function, thisPtr: any): void
        {
            this.saveFile(content, onComplete, onError, thisPtr);
        }

        /**
         * 储存文件（文本格式）
         * @param content 文件内容文本
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        saveFile(content: string | ArrayBuffer, onComplete: Function, onError: Function, thisPtr: any): void
        {
            if (typeof content == "string")
            {
                feng3d.dataTransform.stringToArrayBuffer(content, (uint8Array) =>
                {
                    this.saveFile(uint8Array, onComplete, onError, thisPtr);
                })
                return;
            }

            editorFS.fs.writeArrayBuffer(this._path, content, (err) =>
            {
                if (err)
                {
                    onError(this);
                } else
                {
                    this.updateStats(this._path, () =>
                    {
                        onComplete(this);
                    });
                }
            });
        }

        /**
         * 重命名
         * @param newName 重命名
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        rename(newName: string, onComplete: Function, onError: Function, thisPtr: any): void
        {
            var oldPath = this._path;
            var newPath = this.location ? (this.location + "/" + newName) : newName;
            editorFS.rename(oldPath, newPath, (err) =>
            {
                if (err)
                {
                    feng3d.warn(err);
                    onError(this);
                    return;
                }
                this.updateStats(newPath, () =>
                {
                    onComplete(this);
                })
            });
        }

        /**
         * 移动文件夹
         * @param newPath 新的路径
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 失败时回调  onError([object FileObject])
         * @param thisPtr 执行域
         */
        move(newPath: string, onComplete: Function, onError: Function, thisPtr: any): void
        {
            editorFS.move(this._path, newPath, (err) =>
            {
                if (err)
                {
                    feng3d.warn(err);
                    onError(this);
                    return;
                }
                this.updateStats(newPath, () =>
                {
                    onComplete(this);
                })
            });
        }

        /**
         * 删除文件（夹）
         * @param onComplete onComplete([object FileObject])
         * @param onError onError([object FileObject])
         * @param thisPtr 执行域
         */
        delete(onComplete: Function, onError: Function, thisPtr: any): void
        {
            editorFS.delete(this._path, (err) =>
            {
                if (err)
                {
                    feng3d.warn(err);
                    onError(this);
                    return;
                }
                this._exists = false;
                onComplete(this);
            });
        }

        /**
         * 打开文件
         * @param onFin 完成时回调 onFin(txt:string)
         * @param onError 错误时回调 onError([fileObject])
         */
        open(onFin: Function, onError: Function)
        {
            throw "未实现";
        }

        /**
         * 更新状态
         * @param callback 回调函数
         */
        private updateStats(path: string, callback: () => void, onComplete?: Function, onError?: Function)
        {
            editorFS.fs.exists(path, (exists) =>
            {
                if (!exists)
                {
                    this._exists = false;
                    onError && onError(this);
                } else
                {
                    this._exists = true;
                    this._size = 0;
                    this._path = path;
                    this._isDirectory = path.charAt(path.length - 1) == "/";
                    this._createDate = new Date();
                    this._lastModifyDate = new Date();
                    onError && onComplete(this);
                }
                callback && callback();
            });
        }
    }
}