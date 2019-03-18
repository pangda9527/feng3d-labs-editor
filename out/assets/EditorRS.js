"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Editorcache_1 = require("../caches/Editorcache");
var NativeRequire_1 = require("./NativeRequire");
var NativeFS_1 = require("./NativeFS");
/**
 * 编辑器资源系统
 */
var EditorRS = /** @class */ (function (_super) {
    __extends(EditorRS, _super);
    function EditorRS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 初始化项目
     *
     * @param callback 完成回调
     */
    EditorRS.prototype.initproject = function (callback) {
        var _this = this;
        this.fs.hasProject(Editorcache_1.editorcache.projectname, function (has) {
            _this.fs.initproject(Editorcache_1.editorcache.projectname, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                if (has) {
                    callback();
                    return;
                }
                _this.createproject(callback);
            });
        });
    };
    /**
     * 创建项目
     */
    EditorRS.prototype.createproject = function (callback) {
        var _this = this;
        var urls = [
            ["resource/template/.vscode/settings.json", ".vscode/settings.json"],
            ["resource/template/app.js", "app.js"],
            ["resource/template/index.html", "index.html"],
            ["resource/template/project.js", "project.js"],
            ["resource/template/tsconfig.json", "tsconfig.json"],
            ["resource/template/libs/feng3d.js", "libs/feng3d.js"],
            ["resource/template/libs/feng3d.d.ts", "libs/feng3d.d.ts"],
        ];
        var index = 0;
        var loadUrls = function () {
            if (index >= urls.length) {
                callback();
                return;
            }
            feng3d.loader.loadText(urls[index][0], function (content) {
                _this.fs.writeString(urls[index][1], content, function (err) {
                    if (err)
                        throw err;
                    index++;
                    loadUrls();
                });
            }, null, function (e) {
                throw e;
                index++;
                loadUrls();
            });
        };
        loadUrls();
    };
    EditorRS.prototype.upgradeProject = function (callback) {
        var _this = this;
        var urls = [
            ["resource/template/libs/feng3d.js", "libs/feng3d.js"],
            ["resource/template/libs/feng3d.d.ts", "libs/feng3d.d.ts"],
        ];
        var index = 0;
        var loadUrls = function () {
            if (index >= urls.length) {
                callback();
                return;
            }
            feng3d.loader.loadText(urls[index][0], function (content) {
                _this.fs.writeString(urls[index][1], content, function (err) {
                    if (err)
                        feng3d.warn(err);
                    index++;
                    loadUrls();
                });
            }, null, function (e) {
                feng3d.warn(e);
                index++;
                loadUrls();
            });
        };
        loadUrls();
    };
    EditorRS.prototype.selectFile = function (callback) {
        selectFileCallback = callback;
        isSelectFile = true;
    };
    /**
     * 导出项目
     */
    EditorRS.prototype.exportProject = function (callback) {
        var zip = new JSZip();
        this.fs.getAllfilepathInFolder("", function (err, filepaths) {
            readfiles();
            function readfiles() {
                if (filepaths.length > 0) {
                    var filepath = filepaths.shift();
                    this.fs.readArrayBuffer(filepath, function (err, data) {
                        //处理文件夹
                        data && zip.file(filepath, data);
                        readfiles();
                    });
                }
                else {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        callback(null, content);
                    });
                }
            }
        });
    };
    /**
     * 导入项目
     */
    EditorRS.prototype.importProject = function (file, callback) {
        var zip = new JSZip();
        zip.loadAsync(file).then(function (value) {
            var filepaths = Object.keys(value.files);
            filepaths.sort();
            writeFiles();
            function writeFiles() {
                var _this = this;
                if (filepaths.length > 0) {
                    var filepath = filepaths.shift();
                    if (value.files[filepath].dir) {
                        this.fs.mkdir(filepath, function (err) {
                            writeFiles();
                        });
                    }
                    else {
                        zip.file(filepath).async("arraybuffer").then(function (data) {
                            _this.fs.writeArrayBuffer(filepath, data, function (err) {
                                writeFiles();
                            });
                        }, function (reason) {
                        });
                    }
                }
                else {
                    callback();
                }
            }
        });
    };
    return EditorRS;
}(feng3d.ReadWriteRS));
exports.EditorRS = EditorRS;
if (NativeRequire_1.supportNative) {
    feng3d.fs = new NativeFS_1.NativeFS(NativeRequire_1.nativeFS);
    feng3d.rs = exports.editorRS = new EditorRS();
}
else {
    feng3d.fs = feng3d.indexedDBFS;
    feng3d.rs = exports.editorRS = new EditorRS();
}
//
var isSelectFile = false;
var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true;
fileInput.style.display = "none";
fileInput.addEventListener('change', function (event) {
    selectFileCallback && selectFileCallback(fileInput.files);
    selectFileCallback = null;
    fileInput.value = null;
});
// document.body.appendChild(fileInput);
window.addEventListener("click", function () {
    if (isSelectFile)
        fileInput.click();
    isSelectFile = false;
});
var selectFileCallback;
//# sourceMappingURL=EditorRS.js.map