'use strict';

var process = require('child_process');
var fs = require("fs");
var path = require("path");

watchcopyDir("node_modules/feng3d/out", "resource/template/libs");

/**
 * Watch for changes in TypeScript
 */
watchProject([
    __dirname
]);

function watchcopyDir(srcdir, destdir)
{
    var realsrcdir = path.join(__dirname, srcdir);
    var realdestdir = path.join(__dirname, destdir);
    fs.readdir(realsrcdir, (err, files) =>
    {
        if (err) return;
        files.forEach(element =>
        {
            var src = `${realsrcdir}/${element}`;
            var dest = `${realdestdir}/${element}`;
            watchCopyFile(src, dest);
        });
    });

    function watchCopyFile(src, dest)
    {
        if (fs.existsSync(src))
        {
            fs.watchFile(src, () =>
            {
                copyfile();
            });
            copyfile();
        }
        function copyfile()
        {
            var str = fs.readFileSync(src, "utf8");
            if (src.indexOf(".js.map") != -1)
            {
                str = str.replace(`"sourceRoot":""`, `"sourceRoot":"../${srcdir}/"`);
            }
            fs.writeFileSync(dest, str, "utf8");
        }
    }
}


function watchProject(project)
{
    if (project instanceof Array)
    {
        for (var i = 0; i < project.length; i++)
        {
            watchProject(project[i]);
        }
        return;
    }

    var childProcess = process.exec('tsc -w -p ' + project, function (error, stdout, stderr)
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
        if (data.length > 10) console.log(data);
        if (data.indexOf("Compilation complete") != -1 || data.indexOf("Watching for file changes") != -1)
        {
            //在编译完成后处理 模块导出
            var tsconfig = readTsConfig(readFile(project + "/tsconfig.json"));
            var outjsFilePath = tsconfig.compilerOptions.outFile;
            if (outjsFilePath !== undefined)
            {
                //添加 js 文件的模块导出代码
                outjsFilePath = project + "/" + outjsFilePath;
                if (fs.existsSync(outjsFilePath))
                    writeFile(outjsFilePath, readFile(outjsFilePath) + "\n" + getUniversalModuleDefinition("feng3d"));
                //添加 d.ts 文件的模块导出代码
                var outdtsFilePath = ((path) =>
                {
                    var paths = path.split(".");
                    paths.pop();
                    paths.push("d", "ts");
                    return paths.join(".");
                })(outjsFilePath);
                if (fs.existsSync(outdtsFilePath))
                {
                    //计算 module.d.ts 路径
                    var moduledtsPath = outdtsFilePath;
                    // var moduledtsPath = ((path) =>
                    // {
                    //     var paths = path.split(".");
                    //     paths.splice(-2, 0, "module");
                    //     return paths.join(".");
                    // })(outdtsFilePath);
                    writeFile(moduledtsPath, getdeclaremodule("feng3d") + "\n" + readFile(outdtsFilePath));
                }
            }
        }
    });
    childProcess.stderr.on('data', function (data)
    {
        data = data.trim();
        console.error(data);
    });
}

function getdeclaremodule(moduleName)
{
    return `declare module '${moduleName}' {
    export = ${moduleName};
}`;
}

function getUniversalModuleDefinition(moduleName)
{
    return `
(function universalModuleDefinition(root, factory)
{
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["${moduleName}"] = factory();
    else
        root["${moduleName}"] = factory();
    var globalObject = (typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this);
    globalObject["${moduleName}"] = factory();
})(this, function ()
{
    return ${moduleName};
});
`
}

function writeFile(filePath, content)
{
    fs.openSync(filePath, "w");
    fs.writeFileSync(filePath, content);
}

function readFile(filePath)
{
    fs.openSync(filePath, "r");
    var result = fs.readFileSync(filePath, 'utf8');
    return result;
}

function readTsConfig(tsconfigStr)
{
    var tsconfig;
    eval("tsconfig=" + tsconfigStr);
    return tsconfig;
}