var fs = require("fs-extra");
var path = require("path");
var asar = require("asar");

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
];

// 计算路径
var releasePath = path.resolve(__dirname, "release");
var appPath = path.resolve(__dirname, "node_modules/electron/dist/resources/app.asar");
var electronExePath = path.resolve(__dirname, "node_modules/electron/dist/electron.exe");

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
});

console.log(`完成！`);