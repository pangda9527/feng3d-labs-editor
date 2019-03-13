var fs = require("fs");
var path = require("path");

/**
 * Native文件系统
 */
var nativeFS = {
    /**
     * 文件是否存在
     * @param path 文件路径
     * @param callback 回调函数
     */
    exists: function (path, callback)
    {
        if (!path)
        {
            callback(false);
            return;
        }
        fs.stat(path, function (err, stats)
        {
            callback(!!stats);
        });
    },
    /**
     * 读取文件夹中文件列表
     * @param path 路径
     * @param callback 回调函数
     */
    readdir: function (path, callback)
    {
        fs.readdir(path, callback);
    },
    /**
     * 新建文件夹
     *
     * 如果父文件夹不存在则新建
     *
     * @param p 文件夹路径
     * @param callback 回调函数
     */
    mkdir: function (p, callback)
    {
        var dirPath = path.dirname(p);
        nativeFS.exists(dirPath, function (exists)
        {
            if (!exists)
            {
                nativeFS.mkdir(dirPath, function (err)
                {
                    if (err)
                    {
                        callback(err);
                        return;
                    }
                    nativeFS.mkdir(p, callback);
                });
                return;
            }
            fs.exists(p, function (exists)
            {
                if (exists)
                {
                    callback(null);
                    return;
                }
                fs.mkdir(p, callback);
            });
        });
    },
    /**
     * 读取文件
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    readFile: function (path, callback)
    {
        fs.readFile(path, callback);
    },
    /**
     * 删除文件
     *
     * @param path 文件路径
     * @param callback 完成回调
     */
    deleteFile: function (path, callback)
    {
        fs.unlink(path, callback);
    },
    /**
     * 删除文件夹
     *
     * @param path 文件夹路径
     * @param callback 完成回调
     */
    rmdir: function (path, callback)
    {
        fs.rmdir(path, callback);
    },
    /**
     * 是否为文件夹
     *
     * @param path 文件路径
     * @param callback 完成回调
     */
    isDirectory: function (path, callback)
    {
        fs.stat(path, function (err, stats)
        {
            callback(stats && stats.isDirectory());
        });
    },
    /**
     * 写ArrayBuffer(新建)文件
     *
     * 如果所在文件夹不存时新建文件夹
     *
     * @param filePath 文件路径
     * @param data 文件数据
     * @param callback 回调函数
     */
    writeFile: function (filePath, data, callback)
    {
        var dirPath = path.dirname(filePath);
        nativeFS.exists(dirPath, function (exists)
        {
            if (!exists)
            {
                nativeFS.mkdir(dirPath, function (err)
                {
                    if (err)
                    {
                        callback(err);
                        return;
                    }
                    nativeFS.writeFile(filePath, data, callback);
                });
                return;
            }
            var buffer = new Buffer(data);
            fs.writeFile(filePath, buffer, "binary", callback);
        });
    }
};

exports.nativeFS = nativeFS;