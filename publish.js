var fs = require("fs-extra");
var path = require("path");
var asar = require("asar");

// 排除文件
var exclude = [".git", "node_modules", "electron", "src", "release", "publish"];
var files = fs.readdirSync(__dirname);
files = files.filter(f => exclude.indexOf(f) == -1);

// 删除历史文件
fs.removeSync(path.resolve(__dirname, "release"));
fs.removeSync(path.resolve(__dirname, "publish/electron/resources/app.asar"));

// 拷贝文件
files.forEach(f =>
{
    fs.copySync(path.resolve(__dirname, f), path.resolve(__dirname, "release", f));
});

// 打包 asar
asar.createPackage(path.resolve(__dirname, "release"), path.resolve(__dirname, "publish/electron/resources/app.asar"));

