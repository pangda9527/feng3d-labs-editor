"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
/**
 * Native文件系统
 */
var NativeFSBase = /** @class */ (function () {
    function NativeFSBase() {
    }
    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    NativeFSBase.prototype.exists = function (path, callback) {
        if (!path) {
            callback(false);
            return;
        }
        fs.stat(path, function (err, stats) {
            callback(!!stats);
        });
    };
    /**
     * 读取文件夹中文件列表
     * @param path 路径
     * @param callback 回调函数
     */
    NativeFSBase.prototype.readdir = function (path, callback) {
        fs.readdir(path, callback);
    };
    /**
     * 新建文件夹
     *
     * 如果父文件夹不存在则新建
     *
     * @param p 文件夹路径
     * @param callback 回调函数
     */
    NativeFSBase.prototype.mkdir = function (p, callback) {
        var _this = this;
        var dirPath = path.dirname(p);
        this.exists(dirPath, function (exists) {
            if (!exists) {
                _this.mkdir(dirPath, function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    _this.mkdir(p, callback);
                });
                return;
            }
            fs.exists(p, function (exists) {
                if (exists) {
                    callback(null);
                    return;
                }
                fs.mkdir(p, callback);
            });
        });
    };
    /**
     * 读取文件
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    NativeFSBase.prototype.readFile = function (path, callback) {
        fs.readFile(path, callback);
    };
    /**
     * 删除文件
     *
     * @param path 文件路径
     * @param callback 完成回调
     */
    NativeFSBase.prototype.deleteFile = function (path, callback) {
        fs.unlink(path, callback);
    };
    /**
     * 删除文件夹
     *
     * @param path 文件夹路径
     * @param callback 完成回调
     */
    NativeFSBase.prototype.rmdir = function (path, callback) {
        fs.rmdir(path, callback);
    };
    /**
     * 是否为文件夹
     *
     * @param path 文件路径
     * @param callback 完成回调
     */
    NativeFSBase.prototype.isDirectory = function (path, callback) {
        fs.stat(path, function (err, stats) {
            callback(stats && stats.isDirectory());
        });
    };
    /**
     * 写ArrayBuffer(新建)文件
     *
     * 如果所在文件夹不存时新建文件夹
     *
     * @param filePath 文件路径
     * @param data 文件数据
     * @param callback 回调函数
     */
    NativeFSBase.prototype.writeFile = function (filePath, data, callback) {
        var _this = this;
        var dirPath = path.dirname(filePath);
        this.exists(dirPath, function (exists) {
            if (!exists) {
                _this.mkdir(dirPath, function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    _this.writeFile(filePath, data, callback);
                });
                return;
            }
            var buffer = new Buffer(data);
            fs.writeFile(filePath, buffer, "binary", callback);
        });
    };
    return NativeFSBase;
}());
exports.NativeFSBase = NativeFSBase;
exports.nativeFS = new NativeFSBase();
