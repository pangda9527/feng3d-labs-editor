"use strict";

var fs = require("fs-extra");
var process = require('child_process');

exports.file = {
    createproject: createproject,
    initproject: initproject,
    stat: stat,
    detailStat: detailStat,
    readdir: readdir,
    writeFile: writeFile,
    readFile: readFile,
    remove: remove,
    mkdir: mkdir,
    rename: rename,
    move: move,
};

function createproject(path, callback)
{
    fs.copy(__dirname + "/template", path, { overwrite: true }, callback);
}

function initproject(path, callback)
{
    console.log(`exec tsc -w -p ${path}`)
    var childProcess = process.exec('tsc -w -p ' + path, function (error, stdout, stderr)
    {
        if (error !== null)
        {
            console.log('exec error: ' + error);
        }
        console.log(stdout)
        console.log(stderr)
    });
    childProcess.stdout.on('data', function (data)
    {
        data = data.trim();
        console.log(data);
    });
    childProcess.stderr.on('data', function (data)
    {
        data = data.trim();
        console.error(data);
    });
    callback();
}

function stat(path, callback)
{
    try
    {
        var stats = fs.statSync(path);
        var fileInfo = {
            path: path,
            size: stats.size,
            isDirectory: stats.isDirectory(),
            birthtime: stats.birthtime.getTime(),
            mtime: stats.mtime.getTime(),
            children: []
        }
        callback(null, fileInfo);
    } catch (error)
    {
        callback(error, null);
    }
}

function detailStat(path, callback)
{
    try
    {
        var stats = fs.statSync(path);
        var fileInfo = {
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
                    this.detailStat(path + "/" + element, (err, childInfo) =>
                    {
                        fileInfo.children.push(childInfo);
                    });
                });
            }
        }
        callback(null, fileInfo);
    } catch (error)
    {
        callback(error, null);
    }
}

function readdir(path, callback)
{
    try
    {
        var files = fs.readdirSync(path);
        callback(null, files);
    } catch (error)
    {
        callback(error, null);
    }
}

function writeFile(path, data, callback)
{
    try
    {
        var fd = fs.openSync(path, "w");
        fs.writeFileSync(path, data);
        fs.closeSync(fd);
        callback && callback(null);
    } catch (error)
    {
        callback && callback(error);
    }
}

function readFile(path, callback)
{
    try
    {
        var fd = fs.openSync(path, "r");
        var data = fs.readFileSync(path, "utf8");
        fs.closeSync(fd)
        callback(null, data);
    } catch (error)
    {
        callback(error, null);
    }
}

function remove(path, callback)
{
    try
    {
        var stat = fs.statSync(path);
        if (stat.isDirectory())
        {
            //返回文件和子目录的数组
            var files = fs.readdirSync(path);
            files.forEach(function (file, index)
            {
                this.remove(path + "/" + file, null);
            });
            //清除文件夹
            fs.rmdirSync(path);
        }
        else
        {
            fs.unlinkSync(path);
        }
        callback && callback(null);
    } catch (error)
    {
        callback && callback(error);
    }
}

function mkdir(path, callback)
{
    try
    {
        fs.mkdirSync(path)
        callback(null);
    } catch (error)
    {
        callback(error);
    }
}

function rename(oldPath, newPath, callback)
{
    try
    {
        fs.renameSync(oldPath, newPath);
        callback(null);
    } catch (error)
    {
        callback(error);
    }
}

function move(src, dest, callback)
{
    try
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
                this.move(src + "/" + file, dest + "/" + file);
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
            this.detailStat(dest, (err, destfileinfo) =>
            {
                callback(null, destfileinfo);
            });
        }
    } catch (error)
    {
        callback && callback(error, null);
    }
}