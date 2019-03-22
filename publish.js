var process = require('child_process');
var fs = require("fs-extra");
var path = require("path");
var asar = require("asar");

// 排除文件
var exclude = [".git", "node_modules", "electron", "src", "release", "publish"];
var files = fs.readdirSync(__dirname);
files = files.filter(f => exclude.indexOf(f) == -1);

// 计算路径
var releasePath = path.resolve(__dirname, "release");
var appPath = path.resolve(__dirname, "node_modules/electron/dist/resources/app.asar");
var electronExePath = path.resolve(__dirname, "node_modules/electron/dist/electron.exe");

// 删除历史文件
fs.removeSync(releasePath);
fs.removeSync(appPath);

// 拷贝文件
files.forEach(f =>
{
    fs.copySync(path.resolve(__dirname, f), path.resolve(releasePath, f));
});

// 打包 asar
asar.createPackage(releasePath, appPath);

console.log(`完成！`);