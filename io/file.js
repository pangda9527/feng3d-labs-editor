"use strict";

var fs = require("fs-extra");
var process = require('child_process');
var path = require("path");

/**
 * 工作空间路径，工作空间内存放所有编辑器项目
 */
var workspace = "e:/editorworkspace";

/**
 * 项目路径
 */
var projectpath;

exports.file = {
    createproject: function (projectname, callback)
    {
        var templatepath = path.join(__dirname, "../templates/template");
        var projectpath = workspace + "/" + projectname;
        if (fs.existsSync(projectpath))
        {
            fs.copy(templatepath, workspace + "/" + projectname, { overwrite: true }, callback);
        } else
        {
            fs.mkdir(projectpath, (err) =>
            {
                fs.copy(templatepath, workspace + "/" + projectname, { overwrite: true }, callback);
            });
        }
    },
    initproject: function (projectname, callback)
    {
        console.log(`exec tsc -w -p ${projectname}`)
        var childProcess = process.exec('tsc -w -p ' + workspace + "/" + projectname, function (error, stdout, stderr)
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
        projectpath = workspace + "/" + projectname;
        callback();
    },
    stat: function (path, callback)
    {
        var realpath = getProjectPath(path);
        fs.stat(realpath, (err, stats) =>
        {
            if (err)
            {
                callback(err, null);
                return;
            }
            var fileInfo = {
                path: path,
                size: stats.size,
                isDirectory: stats.isDirectory(),
                birthtime: stats.birthtime.getTime(),
                mtime: stats.mtime.getTime(),
                children: []
            }
            callback(err, fileInfo);
        });
    },
    readdir: function (path, callback)
    {
        path = getProjectPath(path);
        fs.readdir(path, callback);
    },
    writeFile: function (path, data, callback)
    {
        path = getProjectPath(path);
        fs.open(path, "w", (err, fd) =>
        {
            if (err)
            {
                callback && callback(err);
                return;
            }
            fs.writeFile(path, data, (err) =>
            {
                fs.close(fd);
                callback && callback(err);
            });
        });
    },
    readFile(path, encoding, callback)
    {
        encoding = encoding || "utf8";
        path = getProjectPath(path);
        fs.open(path, "r", (err, fd) =>
        {
            if (err)
            {
                callback(err, null);
                return;
            }
            fs.readFile(path, encoding, (err, data) =>
            {
                fs.close(fd);
                callback(err, data);
            });
        });
    },
    remove: function (path, callback)
    {
        path = getProjectPath(path);
        fs.remove(path, callback);
    },
    mkdir: function (path, callback)
    {
        path = getProjectPath(path);
        fs.mkdir(path, callback);
    },
    rename: function (oldPath, newPath, callback)
    {
        oldPath = getProjectPath(oldPath);
        newPath = getProjectPath(newPath);
        fs.rename(oldPath, newPath, callback);
    },
    move: function (src, dest, callback)
    {
        src = getProjectPath(src);
        dest = getProjectPath(dest);
        fs.move(src, dest, callback);
    },
    /**
     * 获取项目列表
     */
    getProjectList: function (callback)
    {
        fs.readdir(workspace, (err, files) =>
        {
            callback(err, files);
        });
    },
    /**
     * 判断指定项目是否存在
     */
    hasProject: function (projectname, callback)
    {
        fs.stat(workspace + "/" + projectname, (err, stats) =>
        {
            callback(!err);
        });
    },
    /**
     * 获取文件绝对路径
     */
    getAbsolutePath(path, callback)
    {
        callback(null, getProjectPath(path));
    },
    getAllfilepathInFolder(dirpath, callback)
    {
        var totalfiles = [];
        var folders = [getProjectPath(dirpath)];

        while (folders.length > 0)
        {
            var dirtemp = folders.shift();
            fs.readdirSync(dirtemp).forEach(element =>
            {
                var realelementpath = dirtemp + "/" + element;
                if (fs.statSync(realelementpath).isDirectory())
                {
                    folders.push(realelementpath);
                } else
                {
                    totalfiles.push(realelementpath);
                }
            });
        }
        for (let i = 0; i < totalfiles.length; i++)
        {
            totalfiles[i] = totalfiles[i].replace(projectpath + "/", "");
        }
        callback(null, totalfiles);
    },
};

function getProjectPath(path)
{
    if (!projectpath)
        return path;
    if (path.indexOf(projectpath) != -1)
        return path;
    if (path == "")
        return projectpath;
    return projectpath + "/" + path;
}