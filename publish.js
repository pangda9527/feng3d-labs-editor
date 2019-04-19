var process = require("child_process");

var fs = require("fs-extra");
var path = require("path");
var asar = require("asar");

downloadElectron(() =>
{
    exeRename(() =>
    {
        packageasar(() =>
        {
            console.log(`完成！`);
        });
    });
});

function downloadElectron(callback)
{
    if (!fs.existsSync(path.resolve(__dirname, "publish")))
    {
        // 下载 electron 包
        var cmdstr = 'git.exe clone --progress -v "https://gitee.com/feng3d_admin/editor-publish-electron.git" "publish"';
        console.log(cmdstr);
        process.exec(cmdstr, function (error, stdout, stderr)
        {
            if (error !== null)
            {
                console.log('exec error: ' + error);
            }
            console.log(stdout)
            console.log(stderr)
            callback();
        });
    } else
    {
        callback()
    }
}

function exeRename(callback)
{
    if (!fs.existsSync(path.resolve(__dirname, "publish/electron/feng3d-editor.exe")))
    {
        fs.moveSync(path.resolve(__dirname, "publish/electron/electron.exe"), path.resolve(__dirname, "publish/electron/feng3d-editor.exe"))
    }
    // 下载 electron 包
    var cmdstr = path.resolve(__dirname, 'publish/rcedit.cmd');
    console.log(cmdstr);
    process.exec(cmdstr, function (error, stdout, stderr)
    {
        if (error !== null)
        {
            console.log('exec error: ' + error);
        }
        console.log(stdout)
        console.log(stderr)
        callback();
    });
}

function packageasar(callback)
{
    console.log(`打包 asar 文件中...`);

    // 文件列表
    var files = [
        './node_modules/feng3d/out',
        './node_modules/feng3d/src',
        './node_modules/feng3d/tsconfig.json',
        './out',
        './libs',
        './tsconfig.json',
        './projects',
        './resource',
        './codeeditor.html',
        './codeeditor.js',
        './favicon.ico',
        './index.html',
        './index.js',
        './run.html',
        './run.js',
        './main.js',
        './native',
        './package.json',
    ];

    // 计算路径
    var releasePath = path.resolve(__dirname, "release");
    var appPath = path.resolve(__dirname, "publish/electron/resources/app.asar");

    // 删除历史文件
    fs.removeSync(appPath);

    // 拷贝文件
    files.forEach(f =>
    {
        fs.copySync(path.resolve(__dirname, f), path.resolve(releasePath, f));
    });

    // 打包 asar
    asar.createPackage(releasePath, appPath).then(() =>
    {
        // 删除临时文件
        fs.removeSync(releasePath);
        callback();
    });
}
