/// <reference path="../libs/typescriptServices.d.ts" />
namespace editor
{
    export var scriptCompiler: ScriptCompiler;

    export class ScriptCompiler
    {
        tslibs: { path: string, code: string }[];
        // ts 列表
        private tslist: feng3d.ScriptAsset[] = [];

        _script: feng3d.StringAsset;

        constructor()
        {
            this.tslibs = [];
            feng3d.loadjs.load({
                paths: ["feng3d/out/feng3d.d.ts"], onitemload: (url, content) =>
                {
                    this.tslibs.push({ path: url, code: content });
                },
            });
        }

        edit(script: feng3d.StringAsset)
        {
            this._script = script;
            if (codeeditoWin) codeeditoWin.close();
            codeeditoWin = window.open(`codeeditor.html`);
        }

        compile(callback?: (output: { name: string; text: string; }[]) => void)
        {
            this.tslist = this.getScripts();

            try
            {
                var output = this.transpileModule();

                output.forEach(v =>
                {
                    editorRS.fs.writeString(v.name, v.text);
                });

                callback && callback(output);

                editorAsset.runProjectScript(() =>
                {
                    feng3d.feng3dDispatcher.dispatch("asset.scriptChanged");
                });

                return output;
            }
            catch (e)
            {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
            callback && callback(null);
        }

        getScripts()
        {
            var tslist = editorRS.getAssetsByType(feng3d.ScriptAsset);

            this.tssort(tslist);

            return tslist;
        }

        private transpileModule()
        {
            var options: ts.CompilerOptions = {
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noImplicitAny: false,
                sourceMap: true,
                suppressOutputPathCheck: true,
                outFile: "project.js",
            };

            var tsSourceMap = {};
            var fileNames: string[] = [];
            this.tslibs.forEach(item =>
            {
                fileNames.push(item.path);
                tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
            });

            this.tslist.forEach((item) =>
            {
                fileNames.push(item.assetPath);
                tsSourceMap[item.assetPath] = ts.createSourceFile(item.assetPath, item.textContent, options.target || ts.ScriptTarget.ES5);
            })

            // Output
            var outputs: { name: string, text: string }[] = [];
            var program = ts.createProgram(fileNames, options, {
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
            // Emit
            program.emit();
            return outputs;
        }

        /**
         * ts 文件排序
         */
        private tssort(filelist: feng3d.ScriptAsset[])
        {
            //按继承排序
            for (let i = 0; i < filelist.length; i++)
            {
                var item = filelist[i];
                var newpos = i;
                if (item.parentScriptName)
                {
                    for (let j = i + 1; j < filelist.length; j++)
                    {
                        var itemk = filelist[j];
                        if (itemk.scriptName == item.parentScriptName && newpos < j)
                        {
                            newpos = j;
                        }
                    }
                }
                if (newpos > i)
                {
                    filelist[i] = null;
                    filelist.splice(newpos + 1, 0, item);
                }
            }
        }

    }
    scriptCompiler = new ScriptCompiler();

}

var codeeditoWin: Window;