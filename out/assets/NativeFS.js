"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Editorcache_1 = require("../caches/Editorcache");
var NativeRequire_1 = require("./NativeRequire");
/**
 * 本地文件系统
 */
var NativeFS = /** @class */ (function (_super) {
    __extends(NativeFS, _super);
    function NativeFS(fs) {
        var _this = _super.call(this) || this;
        /**
         * 文件系统类型
         */
        _this.type = feng3d.FSType.native;
        _this.fs = fs;
        return _this;
    }
    /**
     * 读取文件为ArrayBuffer
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    NativeFS.prototype.readArrayBuffer = function (path, callback) {
        var realPath = this.getAbsolutePath(path);
        this.fs.readFile(realPath, callback);
    };
    /**
     * 读取文件为字符串
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    NativeFS.prototype.readString = function (path, callback) {
        this.readArrayBuffer(path, function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            feng3d.dataTransform.arrayBufferToString(data, function (content) {
                callback(null, content);
            });
        });
    };
    /**
     * 读取文件为Object
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    NativeFS.prototype.readObject = function (path, callback) {
        this.readArrayBuffer(path, function (err, buffer) {
            if (err) {
                callback(err, null);
                return;
            }
            feng3d.dataTransform.arrayBufferToObject(buffer, function (content) {
                var object = feng3d.serialization.deserialize(content);
                callback(null, object);
            });
        });
    };
    /**
     * 加载图片
     * @param path 图片路径
     * @param callback 加载完成回调
     */
    NativeFS.prototype.readImage = function (path, callback) {
        var _this = this;
        this.exists(path, function (exists) {
            if (exists) {
                var img = new Image();
                img.onload = function () {
                    callback(null, img);
                };
                img.onerror = function (evt) {
                    callback(new Error("\u52A0\u8F7D\u56FE\u7247" + path + "\u5931\u8D25"), null);
                };
                img.src = _this.getAbsolutePath(path);
            }
            else {
                callback(new Error("\u56FE\u7247\u8D44\u6E90 " + path + " \u4E0D\u5B58\u5728"), null);
            }
        });
    };
    /**
     * 获取文件绝对路径
     * @param path （相对）路径
     */
    NativeFS.prototype.getAbsolutePath = function (path) {
        if (!this.projectname) {
            throw "\u8BF7\u5148\u4F7F\u7528 initproject \u521D\u59CB\u5316\u9879\u76EE";
        }
        return this.projectname + "/" + path;
    };
    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    NativeFS.prototype.exists = function (path, callback) {
        var realPath = this.getAbsolutePath(path);
        this.fs.exists(realPath, callback);
    };
    /**
     * 是否为文件夹
     *
     * @param path 文件路径
     * @param callback 完成回调
     */
    NativeFS.prototype.isDirectory = function (path, callback) {
        var realPath = this.getAbsolutePath(path);
        this.fs.isDirectory(realPath, callback);
    };
    /**
     * 读取文件夹中文件列表
     *
     * @param path 路径
     * @param callback 回调函数
     */
    NativeFS.prototype.readdir = function (path, callback) {
        var realPath = this.getAbsolutePath(path);
        this.fs.readdir(realPath, callback);
    };
    /**
     * 新建文件夹
     * @param path 文件夹路径
     * @param callback 回调函数
     */
    NativeFS.prototype.mkdir = function (path, callback) {
        var realPath = this.getAbsolutePath(path);
        this.fs.mkdir(realPath, callback);
    };
    /**
     * 删除文件
     * @param path 文件路径
     * @param callback 回调函数
     */
    NativeFS.prototype.deleteFile = function (path, callback) {
        var _this = this;
        callback = callback || (function () { });
        var realPath = this.getAbsolutePath(path);
        this.isDirectory(path, function (result) {
            if (result) {
                _this.fs.rmdir(realPath, callback);
            }
            else {
                _this.fs.deleteFile(realPath, callback);
            }
        });
    };
    /**
     * 写ArrayBuffer(新建)文件
     * @param path 文件路径
     * @param arraybuffer 文件数据
     * @param callback 回调函数
     */
    NativeFS.prototype.writeArrayBuffer = function (path, arraybuffer, callback) {
        var realPath = this.getAbsolutePath(path);
        this.fs.writeFile(realPath, arraybuffer, function (err) { callback && callback(err); });
    };
    /**
     * 写字符串到(新建)文件
     * @param path 文件路径
     * @param str 文件数据
     * @param callback 回调函数
     */
    NativeFS.prototype.writeString = function (path, str, callback) {
        var buffer = feng3d.dataTransform.stringToArrayBuffer(str);
        this.writeArrayBuffer(path, buffer, callback);
    };
    /**
     * 写Object到(新建)文件
     * @param path 文件路径
     * @param object 文件数据
     * @param callback 回调函数
     */
    NativeFS.prototype.writeObject = function (path, object, callback) {
        var obj = feng3d.serialization.serialize(object);
        var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        this.writeString(path, str, callback);
    };
    /**
     * 写图片
     * @param path 图片路径
     * @param image 图片
     * @param callback 回调函数
     */
    NativeFS.prototype.writeImage = function (path, image, callback) {
        var _this = this;
        feng3d.dataTransform.imageToArrayBuffer(image, function (buffer) {
            _this.writeArrayBuffer(path, buffer, callback);
        });
    };
    /**
     * 复制文件
     * @param src    源路径
     * @param dest    目标路径
     * @param callback 回调函数
     */
    NativeFS.prototype.copyFile = function (src, dest, callback) {
        var _this = this;
        this.readArrayBuffer(src, function (err, buffer) {
            if (err) {
                callback && callback(err);
                return;
            }
            _this.writeArrayBuffer(dest, buffer, callback);
        });
    };
    /**
     * 是否存在指定项目
     * @param projectname 项目名称
     * @param callback 回调函数
     */
    NativeFS.prototype.hasProject = function (projectname, callback) {
        this.fs.exists(projectname, callback);
    };
    /**
     * 初始化项目
     * @param projectname 项目名称
     * @param callback 回调函数
     */
    NativeFS.prototype.initproject = function (projectname, callback) {
        var _this = this;
        this.fs.exists(Editorcache_1.editorcache.projectname, function (exists) {
            if (exists) {
                _this.projectname = Editorcache_1.editorcache.projectname;
                callback();
                return;
            }
            NativeRequire_1.nativeAPI.selectDirectoryDialog(function (event, path) {
                Editorcache_1.editorcache.projectname = _this.projectname = path;
                callback();
            });
        });
    };
    return NativeFS;
}(feng3d.ReadWriteFS));
exports.NativeFS = NativeFS;
//# sourceMappingURL=NativeFS.js.map