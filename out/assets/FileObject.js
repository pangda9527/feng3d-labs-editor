define(["require", "exports", "./EditorRS"], function (require, exports, EditorRS_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by 黑暗之神KDS on 2017/2/17.
     */
    /**
     * 文件对象
     * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
     * -- 其他端支持绝对路径
     * Created by kds on 2017/1/21 0021.
     */
    var FileObject = /** @class */ (function () {
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
        function FileObject(path, onComplete, thisPtr, onError, isGetFileInfo) {
            this.updateStats(path, null, onComplete, onError);
        }
        /**
         * 判断文件名是否合法
         * @param fileName 文件名
         */
        FileObject.isLegalName = function (fileName) {
            return true;
        };
        Object.defineProperty(FileObject.prototype, "exists", {
            /**
             * 文件/文件夹是否存在 基本探索过后才可知道是否存在
             */
            get: function () {
                return this._exists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "size", {
            /**
             * 文件尺寸
             */
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "isDirectory", {
            /**
             * 是否是文件夹
             */
            get: function () {
                return this._isDirectory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "createDate", {
            /**
             * 创建日期
             */
            get: function () {
                return this._createDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "lastModifyDate", {
            /**
             * 上次修改日期
             */
            get: function () {
                return this._lastModifyDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "path", {
            /**
             * 路径
             * -- WEB端是相对路径
             * -- 其他端支持绝对路径 file:///xxx/yyy
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "fileName", {
            /**
             * 文件或文件夹名 xxx.ks
             */
            get: function () {
                var fileName = this.path.split("/").pop();
                return fileName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "fileNameWithoutExt", {
            /**
             * 不包含格式的文件名称 如 xxx.ks就是xxx
             */
            get: function () {
                var fileName = this.fileName;
                var fileNameWithoutExt = (fileName.indexOf(".") == -1) ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
                return fileNameWithoutExt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "location", {
            /**
             * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
             */
            get: function () {
                var paths = this.path.split("/");
                paths.pop();
                var location = paths.join("/");
                return location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "fullPath", {
            /**
             * 绝对路径
             * -- WEB端的是 http://xxxx
             * -- 其他端的是 file:///xxxx
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "extension", {
            /**
             * 格式
             */
            get: function () {
                var fileName = this.fileName;
                if (fileName.indexOf(".") == -1)
                    return "";
                var extension = fileName.split(".").pop();
                return extension;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取该文件下的目录
         * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
         * @param onError 失败时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.getDirectoryListing = function (onComplete, onError, thisPtr) {
            var _this = this;
            EditorRS_1.editorRS.fs.readdir(this._path, function (err, files) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                }
                else {
                    onComplete(_this, files);
                }
            });
        };
        /**
         * 创建文件夹
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.createDirectory = function (onComplete, onError, thisPtr) {
            var _this = this;
            EditorRS_1.editorRS.fs.mkdir(this._path, function (err) {
                if (err) {
                    feng3d.warn(_this);
                    onError(_this);
                    return;
                }
                _this.updateStats(_this._path, function () {
                    onComplete(_this);
                });
            });
        };
        /**
         * 创建文件
         * @param content 初次创建时的内容 一般可为""
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.createFile = function (content, onComplete, onError, thisPtr) {
            this.saveFile(content, onComplete, onError, thisPtr);
        };
        /**
         * 储存文件（文本格式）
         * @param content 文件内容文本
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.saveFile = function (content, onComplete, onError, thisPtr) {
            var _this = this;
            if (typeof content == "string") {
                var uint8Array = feng3d.dataTransform.stringToArrayBuffer(content);
                this.saveFile(uint8Array, onComplete, onError, thisPtr);
                return;
            }
            EditorRS_1.editorRS.fs.writeArrayBuffer(this._path, content, function (err) {
                if (err) {
                    onError(_this);
                }
                else {
                    _this.updateStats(_this._path, function () {
                        onComplete(_this);
                    });
                }
            });
        };
        /**
         * 重命名
         * @param newName 重命名
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.rename = function (newName, onComplete, onError, thisPtr) {
            var _this = this;
            var oldPath = this._path;
            var newPath = this.location ? (this.location + "/" + newName) : newName;
            EditorRS_1.editorRS.fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                    return;
                }
                _this.updateStats(newPath, function () {
                    onComplete(_this);
                });
            });
        };
        /**
         * 移动文件夹
         * @param newPath 新的路径
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 失败时回调  onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.move = function (newPath, onComplete, onError, thisPtr) {
            var _this = this;
            EditorRS_1.editorRS.fs.move(this._path, newPath, function (err) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                    return;
                }
                _this.updateStats(newPath, function () {
                    onComplete(_this);
                });
            });
        };
        /**
         * 删除文件（夹）
         * @param onComplete onComplete([object FileObject])
         * @param onError onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.delete = function (onComplete, onError, thisPtr) {
            var _this = this;
            EditorRS_1.editorRS.fs.delete(this._path, function (err) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                    return;
                }
                _this._exists = false;
                onComplete(_this);
            });
        };
        /**
         * 打开文件
         * @param onFin 完成时回调 onFin(txt:string)
         * @param onError 错误时回调 onError([fileObject])
         */
        FileObject.prototype.open = function (onFin, onError) {
            throw "未实现";
        };
        /**
         * 更新状态
         * @param callback 回调函数
         */
        FileObject.prototype.updateStats = function (path, callback, onComplete, onError) {
            var _this = this;
            EditorRS_1.editorRS.fs.exists(path, function (exists) {
                if (!exists) {
                    _this._exists = false;
                    onError && onError(_this);
                }
                else {
                    _this._exists = true;
                    _this._size = 0;
                    _this._path = path;
                    _this._isDirectory = path.charAt(path.length - 1) == "/";
                    _this._createDate = new Date();
                    _this._lastModifyDate = new Date();
                    onError && onComplete(_this);
                }
                callback && callback();
            });
        };
        return FileObject;
    }());
    exports.FileObject = FileObject;
});
//# sourceMappingURL=FileObject.js.map