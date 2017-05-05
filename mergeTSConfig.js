var fs = require("fs");
const util = require("util");
const debuglog = util.debuglog('foo');

var files = getTsConfigFiles("feng3d").concat(getTsConfigFiles("objectview"));

var examplesTsConfig = readTsConfig("editor_tsconfig.json");
examplesTsConfig.files = files.concat(examplesTsConfig.files);

var exclude = ["typings/index.d.ts",
    "objectview/typings/index.d.ts",
    "feng3d/out/feng3d.d.ts",
    "feng3d/typings/index.d.ts",
    "objectview/out/objectview.d.ts"];
while (exclude.length > 0) {
    var index = examplesTsConfig.files.indexOf(exclude.pop());
    if (index != -1) { examplesTsConfig.files.splice(index, 1); }
}

var examplesTsConfigStr = JSON.stringify(examplesTsConfig, null, '\t');
examplesTsConfigStr = examplesTsConfigStr.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
examplesTsConfigStr = "//由node mergeTSConfig.js合并examples_tsconfig.json与feng3d/tsconfig.json生成\n" + examplesTsConfigStr;
writeFile("tsconfig.json", examplesTsConfigStr);


function getTsConfigFiles(root) {
    var feng3dtsconfig = readTsConfig(root + "/" + "tsconfig.json");
    var feng3dFiles = feng3dtsconfig.files;
    for (var i = 0; i < feng3dFiles.length; i++) {
        var element = feng3dFiles[i];
        feng3dFiles[i] = root + "/" + feng3dFiles[i];
    }
    return feng3dFiles;
}

function readTsConfig(path) {
    var tsconfigStr = readFile(path);
    var lines = tsconfigStr.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var element = lines[i];
        var index = element.indexOf("//");
        if (index != -1) {
            lines[i] = element.substring(0, index);
        }
    }
    tsconfigStr = lines.join("\n");
    var tsconfig = JSON.parse(tsconfigStr);
    return tsconfig;
}

function writeFile(filePath, content) {
    fs.openSync(filePath, "w");
    fs.writeFileSync(filePath, content);
}

function readFile(filePath) {
    fs.openSync(filePath, "r");
    var result = fs.readFileSync(filePath, 'utf8');
    return result;
}

function readFiles(filePaths) {
    var result = {};
    filePaths.forEach(function (element) {
        result[element] = readFile(element);
    }, this);
    return result;
}

function getFilePaths(rootPath, filePaths) {

    filePaths = filePaths || [];
    var stats = fs.statSync(rootPath);
    if (stats.isFile()) {
        filePaths.push(rootPath);
    } else if (stats.isDirectory) {
        var childPaths = fs.readdirSync(rootPath);
        for (var i = 0; i < childPaths.length; i++) {
            getFilePaths(rootPath + "/" + childPaths[i], filePaths);
        }
    }
    return filePaths;
}