/// <reference path="../libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html
namespace editor
{
    export var scriptCompiler: ScriptCompiler;

    export class ScriptCompiler
    {
        tslibs: { path: string, code: string }[];
        // ts 列表
        private tslist: feng3d.ScriptFile[] = [];

        _script: feng3d.StringFile;

        constructor()
        {
            this.tslibs = [];
            feng3d.loadjs.load({
                paths: ["../feng3d/out/feng3d.d.ts"], onitemload: (url, content) =>
                {
                    this.tslibs.push({ path: url, code: content });
                },
            });
        }

        edit(script: feng3d.StringFile)
        {
            this._script = script;
            if (codeeditoWin) codeeditoWin.close();
            codeeditoWin = window.open(`codeeditor.html`);
        }

        compile(callback?: (result: string) => void)
        {
            this.tslist = this.getScripts();

            try
            {
                var output = this.transpileModule();
                var outputStr = output.reduce((prev, item) =>
                {
                    return prev + item.text;
                }, "");

                outputStr += `\n//# sourceURL=project.js`;

                callback && callback(outputStr);

                return outputStr;
            }
            catch (e)
            {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
            callback && callback("");
        }

        getScripts()
        {
            var files = editorAssets.files
            var tslist: feng3d.ScriptFile[] = [];
            for (const key in files)
            {
                var file = files[key].feng3dAssets;
                if (file instanceof feng3d.ScriptFile)
                {
                    tslist.push(file);
                }
            }

            this.tssort(tslist);

            return tslist;
        }

        private transpileModule()
        {
            var options = {
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noLib: true,
                noResolve: true,
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
                fileNames.push(item.assetsId + ".ts");
                tsSourceMap[item.assetsId + ".ts"] = ts.createSourceFile(item.assetsId + ".ts", item.textContent, options.target || ts.ScriptTarget.ES5);
            })

            // Output
            var outputs = [];
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
        private tssort(filelist: feng3d.ScriptFile[])
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

var ts;

// Monaco uses a custom amd loader that overrides node's require.
// Keep a reference to node's require so we can restore it after executing the amd loader file.
var nodeRequire = window["require"];

var script = document.createElement("script");
script.src = "libs/monaco-editor/min/vs/loader.js";
script.onload = () =>
{
    // Save Monaco's amd require and restore Node's require
    var amdRequire = window["require"];
    window["require"] = nodeRequire;

    //
    amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
    amdRequire(['vs/language/typescript/lib/typescriptServices'], () =>
    {

    });
}
document.body.appendChild(script);