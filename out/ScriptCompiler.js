/// <reference path="../libs/typescriptServices.d.ts" />
define(["require", "exports", "./assets/EditorRS", "./ui/assets/EditorAsset"], function (require, exports, EditorRS_1, EditorAsset_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScriptCompiler = /** @class */ (function () {
        function ScriptCompiler() {
            feng3d.dispatcher.on("script.compile", this.onScriptCompile, this);
            feng3d.dispatcher.on("script.gettslibs", this.onGettsLibs, this);
        }
        ScriptCompiler.prototype.onGettsLibs = function (e) {
            this.loadtslibs(e.data.callback);
        };
        /**
         * 加载 tslibs
         *
         * @param callback 完成回调
         */
        ScriptCompiler.prototype.loadtslibs = function (callback) {
            // 加载 ts 配置
            EditorRS_1.editorRS.fs.readString("tsconfig.json", function (err, str) {
                if (err) {
                    throw err;
                    return;
                }
                var obj = json.parse(str);
                console.log(obj);
                var files = obj.files;
                EditorRS_1.editorRS.fs.readStrings(obj.files, function (strs) {
                    var tslibs = files.map(function (f, i) {
                        var str = strs[i];
                        if (typeof str == "string")
                            return { path: f, code: str };
                        feng3d.warn("\u6CA1\u6709\u627E\u5230\u6587\u4EF6 " + f);
                        return null;
                    }).filter(function (v) { return !!v; });
                    callback(tslibs);
                });
            });
        };
        ScriptCompiler.prototype.onScriptCompile = function (e) {
            var _this = this;
            this.loadtslibs(function (tslibs) {
                var tslist = EditorRS_1.editorRS.getAssetsByType(feng3d.ScriptAsset);
                _this.compile(tslibs, tslist, e.data && e.data.onComplete);
            });
        };
        ScriptCompiler.prototype.compile = function (tslibs, tslist, callback) {
            try {
                var output = this.transpileModule(tslibs, tslist);
                output.forEach(function (v) {
                    EditorRS_1.editorRS.fs.writeString(v.name, v.text);
                });
                callback && callback(output);
                EditorAsset_1.editorAsset.runProjectScript(function () {
                    feng3d.dispatcher.dispatch("asset.scriptChanged");
                });
                return output;
            }
            catch (e) {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
            callback && callback(null);
        };
        ScriptCompiler.prototype.transpileModule = function (tslibs, tslist) {
            var options = {
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noImplicitAny: false,
                sourceMap: true,
                suppressOutputPathCheck: true,
                outFile: "project.js",
            };
            var tsSourceMap = {};
            var fileNames = [];
            tslibs.forEach(function (item) {
                fileNames.push(item.path);
                tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
            });
            tslist.forEach(function (item) {
                fileNames.push(item.assetPath);
                tsSourceMap[item.assetPath] = ts.createSourceFile(item.assetPath, item.textContent, options.target || ts.ScriptTarget.ES5);
            });
            // Output
            var outputs = [];
            // 排序
            var program = this.createProgram(fileNames, options, tsSourceMap, outputs);
            var result = ts.reorderSourceFiles(program);
            console.log("ts \u6392\u5E8F\u7ED3\u679C");
            console.log(result);
            if (result.circularReferences.length > 0) {
                console.warn("\u51FA\u73B0\u5FAA\u73AF\u5F15\u7528");
                return;
            }
            // 编译
            var program = this.createProgram(result.sortedFileNames, options, tsSourceMap, outputs);
            program.emit();
            return outputs;
        };
        ScriptCompiler.prototype.createProgram = function (fileNames, options, tsSourceMap, outputs) {
            return ts.createProgram(fileNames, options, {
                getSourceFile: function (fileName) {
                    return tsSourceMap[fileName];
                },
                writeFile: function (_name, text) {
                    outputs.push({ name: _name, text: text });
                },
                getDefaultLibFileName: function () { return "lib.d.ts"; },
                useCaseSensitiveFileNames: function () { return false; },
                getCanonicalFileName: function (fileName) { return fileName; },
                getCurrentDirectory: function () { return ""; },
                getNewLine: function () { return "\r\n"; },
                fileExists: function (fileName) {
                    return !!tsSourceMap[fileName];
                },
                readFile: function () { return ""; },
                directoryExists: function () { return true; },
                getDirectories: function () { return []; }
            });
        };
        return ScriptCompiler;
    }());
    exports.ScriptCompiler = ScriptCompiler;
    exports.scriptCompiler = new ScriptCompiler();
});
//# sourceMappingURL=ScriptCompiler.js.map