/// <reference path="native.d.ts" />


module feng3d.native
{
    export var file = {
        stat: stat,
        readdir: readdir,
        writeFile: writeFile,
        writeJsonFile: writeJsonFile,
        readFile: readFile,
        mkdir: mkdir,
        rename: rename,
        move: move,
        remove: remove,
        detailStat: detailStat,
    };

    export type FileInfo = feng3d.editor.FileInfo;

    var fs: typeof gfs = require("fs");

    function stat(path: string, callback: (err: { message: string }, stats: FileInfo) => void): void
    {
        var stats = fs.stat(path, (err, stats) =>
        {
            if (err)
            {
                return callback({ message: err.message }, null);
            }
            if (stats)
            {
                var fileInfo = {
                    path: path,
                    size: stats.size,
                    isDirectory: stats.isDirectory(),
                    birthtime: stats.birthtime.getTime(),
                    mtime: stats.mtime.getTime(),
                    children: []
                }
            }
            callback(null, fileInfo);
        });
    }

    function detailStat(path: string, callback: (err: { message: string }, stats: FileInfo) => void): FileInfo
    {
        var stats = fs.statSync(path);
        var fileInfo: FileInfo = {
            path: path,
            size: stats.size,
            isDirectory: stats.isDirectory(),
            birthtime: stats.birthtime.getTime(),
            mtime: stats.mtime.getTime(),
            children: []
        }
        if (fileInfo.isDirectory)
        {
            fileInfo.children = [];
            var files = fs.readdirSync(path);
            if (files.length > 0)
            {
                files.forEach(element =>
                {
                    var childInfo = detailStat(path + "/" + element, null);
                    fileInfo.children.push(childInfo);
                });
            }
        }
        if (callback)
            callback(null, fileInfo);
        return fileInfo;
    }

    function readdir(path: string, callback: (err: { message: string }, files: string[]) => void): void
    {
        fs.readdir(path, (err, files) =>
        {
            callback(rerr(err), files);
        });
    }

    function writeFile(path: string, data: string, callback?: (err: { message: string }) => void)
    {
        fs.open(path, "w", (err, fd) =>
        {
            if (err)
            {
                callback && callback(rerr(err));
                return;
            }
            fs.writeFile(path, data, (err1) =>
            {
                callback && callback(rerr(err1));
                fs.close(fd, (err) =>
                {
                })
            })
        });
    }

    function readFile(path: string, callback: (err: { message: string }, data: string) => void)
    {
        fs.open(path, "r", (err, fd) =>
        {
            if (err)
            {
                callback(rerr(err), undefined);
                return;
            }
            fs.readFile(path, 'utf8', (err1, data) =>
            {
                callback(rerr(err1), data);
                fs.close(fd, (err) =>
                {
                })
            })
        });
    }

    function remove(path: string, callback?: (err: { message: string }) => void)
    {
        var stat = fs.statSync(path);
        if (!stat)
        {
            console.warn("给定的路径不存在，请给出正确的路径");
            return;
        }
        if (stat.isDirectory())
        {
            //返回文件和子目录的数组
            var files = fs.readdirSync(path);
            files.forEach(function (file, index)
            {
                remove(path + "/" + file, null);
            });
            //清除文件夹
            fs.rmdirSync(path);
        }
        else
        {
            fs.unlinkSync(path);
        }
        callback && callback(null);
    }

    function mkdir(path: string, callback: (err: { message: string }) => void)
    {
        fs.mkdir(path, (err) =>
        {
            callback(rerr(err));
        });
    }

    function rename(oldPath: string, newPath: string, callback: (err: { message: string }) => void)
    {
        fs.rename(oldPath, newPath, (err) =>
        {
            callback(rerr(err));
        });
    }

    function move(src: string, dest: string, callback?: (err: { message: string }, destfileinfo: FileInfo) => void)
    {
        var srcstats = fs.statSync(src);
        var destexists = fs.existsSync(dest);
        if (destexists && fs.statSync(dest).isDirectory() == false)
        {
            fs.unlinkSync(dest);
            destexists = false;
        }
        if (srcstats.isDirectory())
        {
            if (!destexists)
                fs.mkdirSync(dest);
            var files = fs.readdirSync(src);
            files.forEach(function (file, index)
            {
                move(src + "/" + file, dest + "/" + file);
            });
            fs.rmdirSync(src);
        }
        else
        {
            //使用重命名移动文件
            fs.renameSync(src, dest);
        }
        if (callback)
        {
            var destfileinfo = detailStat(dest, null);
            callback(null, destfileinfo);
        }
    }

    function rerr(err: Error)
    {
        if (err)
        {
            var rerrobj = { message: err.message };
        }
        return rerrobj;
    }

    function writeJsonFile(path: string, data: Object, callback?: (err: { message: string }) => void)
    {
        var content = JSON.stringify(data, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        writeFile(path, content, callback);
    }
}