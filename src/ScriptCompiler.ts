/// <reference path="../libs/typescriptServices.d.ts" />
namespace editor
{
    export var scriptCompiler: ScriptCompiler;

    export class ScriptCompiler
    {
        constructor()
        {
            feng3d.dispatcher.on("script.compile", this.onScriptCompile, this);
            feng3d.dispatcher.on("script.gettslibs", this.onGettsLibs, this);
        }

        private onGettsLibs(e: feng3d.Event<{
            callback: (tslibs: {
                path: string;
                code: string;
            }[]) => void;
        }>)
        {
            this.loadtslibs(e.data.callback);
        }

        /**
         * 加载 tslibs
         * 
         * @param callback 完成回调
         */
        private loadtslibs(callback: (tslibs: { path: string, code: string }[]) => void)
        {
            // 加载 ts 配置
            editorRS.fs.readString("tsconfig.json", (err, str) =>
            {
                if (err) { throw err; return; }

                var obj = json.parse(str);
                console.log(obj);

                var files: string[] = obj.files;
                editorRS.fs.readStrings(obj.files, (strs) =>
                {
                    var tslibs = files.map((f, i) =>
                    {
                        let str = strs[i]; if (typeof str == "string") return { path: f, code: str };
                        feng3d.warn(`没有找到文件 ${f}`);
                        return null;
                    }).filter(v => !!v);

                    callback(tslibs)
                });
            });
        }

        private onScriptCompile(e: feng3d.Event<{ onComplete?: () => void; }>)
        {
            this.loadtslibs((tslibs) =>
            {
                var tslist = editorRS.getAssetsByType(feng3d.ScriptAsset);

                this.compile(tslibs, tslist, e.data && e.data.onComplete);
            });
        }

        private compile(tslibs: {
            path: string;
            code: string;
        }[],
            tslist: feng3d.ScriptAsset[],
            callback?: (output: { name: string; text: string; }[]) => void)
        {
            try
            {
                var output = this.transpileModule(tslibs, tslist);

                output.forEach(v =>
                {
                    editorRS.fs.writeString(v.name, v.text);
                });

                callback && callback(output);

                editorAsset.runProjectScript(() =>
                {
                    feng3d.dispatcher.dispatch("asset.scriptChanged");
                });

                return output;
            }
            catch (e)
            {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
            callback && callback(null);
        }

        private transpileModule(tslibs: {
            path: string;
            code: string;
        }[], tslist: feng3d.ScriptAsset[])
        {
            var options: ts.CompilerOptions = {
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noImplicitAny: false,
                sourceMap: true,
                suppressOutputPathCheck: true,
                outFile: "project.js",
            };

            var tsSourceMap: { [filepath: string]: ts.SourceFile } = {};
            var fileNames: string[] = [];
            tslibs.forEach(item =>
            {
                fileNames.push(item.path);
                tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
            });

            tslist.forEach((item) =>
            {
                fileNames.push(item.assetPath);
                tsSourceMap[item.assetPath] = ts.createSourceFile(item.assetPath, item.textContent, options.target || ts.ScriptTarget.ES5);
            })

            // Output
            var outputs: { name: string, text: string }[] = [];
            // 排序
            var program = this.createProgram(fileNames, options, tsSourceMap, outputs);
            var result = ts.reorderSourceFiles(program);
            console.log(`ts 排序结果`);
            console.log(result);
            if (result.circularReferences.length > 0)
            {
                console.warn(`出现循环引用`);
                return;
            }
            // 编译
            var program = this.createProgram(result.sortedFileNames, options, tsSourceMap, outputs);
            program.emit();
            return outputs;
        }

        private createProgram(fileNames: string[], options: ts.CompilerOptions, tsSourceMap: {}, outputs: { name: string; text: string; }[])
        {
            return ts.createProgram(fileNames, options, {
                getSourceFile: function (fileName)
                {
                    return tsSourceMap[fileName];
                },
                writeFile: function (_name, text)
                {
                    outputs.push({ name: _name, text: text });
                },
                getDefaultLibFileName: function () { return "lib.d.ts"; },
                useCaseSensitiveFileNames: function () { return false; },
                getCanonicalFileName: function (fileName) { return fileName; },
                getCurrentDirectory: function () { return ""; },
                getNewLine: function () { return "\r\n"; },
                fileExists: function (fileName)
                {
                    return !!tsSourceMap[fileName];
                },
                readFile: function () { return ""; },
                directoryExists: function () { return true; },
                getDirectories: function () { return []; }
            });
        }

    }
    scriptCompiler = new ScriptCompiler();
}