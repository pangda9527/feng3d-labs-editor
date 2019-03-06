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
        fs.exists(path, callback);
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
     * @param path 文件夹路径
     * @param callback 回调函数
     */
    NativeFSBase.prototype.mkdir = function (path, callback) {
        fs.mkdir(path, callback);
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
     * 写ArrayBuffer(新建)文件
     *
     * @param path 文件路径
     * @param data 文件数据
     * @param callback 回调函数
     */
    NativeFSBase.prototype.writeFile = function (path, data, callback) {
        var buffer = new Buffer(data);
        fs.writeFile(path, buffer, "binary", callback);
    };
    return NativeFSBase;
}());
exports.NativeFSBase = NativeFSBase;
exports.nativeFS = new NativeFSBase();
