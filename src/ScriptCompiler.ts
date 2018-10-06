/// <reference path="../libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html

var ts;

declare var amdRequire;

amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
amdRequire(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], () =>
{
    // 设置ts编译选项
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        module: monaco.languages.typescript.ModuleKind.AMD,
        noResolve: true,
        suppressOutputPathCheck: true,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        target: monaco.languages.typescript.ScriptTarget.ES5,
        noImplicitAny: false,
        strictNullChecks: false,
        noImplicitThis: false,
        noImplicitReturns: false,
        experimentalDecorators: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
    });
});


namespace editor
{
    export var scriptCompiler: ScriptCompiler;

    export class ScriptCompiler
    {
        private tslibs: { path: string, code: string }[];
        // ts 列表
        private tslist = [];

        private loadLibs(callback: () => void)
        {
            this.tslibs = [];
            feng3d.loadjs.load({
                paths: ["../feng3d/out/feng3d.d.ts"], onitemload: (url, content) =>
                {
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(content, url.split("/").pop());
                    this.tslibs.push({ path: url, code: content });
                },
                success: callback,
            });
        }

        compile()
        {
            if (!this.tslibs)
            {
                this.loadLibs(() =>
                {
                    this.compile();
                });
                return;
            }

            this.tslibs;


            // ------------ Compilation logic
            function triggerCompile()
            {
                try
                {
                    var output = transpileModule({
                        // module: ts.ModuleKind.AMD,
                        target: ts.ScriptTarget.ES5,
                        noLib: true,
                        noResolve: true,
                        suppressOutputPathCheck: true
                    });
                    var outputStr = output.reduce((prev, item) =>
                    {
                        return prev + item.text;
                    }, "");

                    outputStr += `\n//# sourceURL=project.js`;
                }
                catch (e)
                {
                    console.log("Error from compilation: " + e + "  " + (e.stack || ""));
                }
            }
            function transpileModule(options)
            {
                var tsSourceMap = {};
                this.tslibs.forEach(item =>
                {
                    tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
                });
                tssort(this.tslist);

                // tslist.sort((a, b) => a.path > b.path);

                this.tslist.forEach((item) =>
                {
                    tsSourceMap[item.assetsId + ".ts"] = ts.createSourceFile(item.assetsId + ".ts", item.textContent, options.target || ts.ScriptTarget.ES5);
                })

                // Output
                var outputs = [];
                var program = ts.createProgram(Object.keys(tsSourceMap), options, {
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
                if (outputs === undefined)
                {
                    throw new Error("Output generation failed");
                }
                return outputs;
            }
            // ------------ Execution logic
            /**
             * 脚本中的类
             */
            var scriptClassReg = /(export\s+)?(abstract\s+)?class\s+([\w$_\d]+)(\s+extends\s+([\w$_\d\.]+))?/;

            /**
             * ts 文件排序
             */
            function tssort(tsfiles)
            {
                var filelist = [{ path: "", class: [""], extends: [""] }];

                filelist = tsfiles.map((v) =>
                {
                    var result = v.textContent.match(scriptClassReg);
                    //目前只处理了ts文件中单个导出对象
                    var item = { path: v.assetsId, code: v.textContent, class: [], extends: [], assets: v }
                    if (result)
                    {
                        item.class.push(result[3]);
                        if (result[5])
                            item.extends.push(result[5].split(".").pop());
                    }
                    return item;
                });

                //按继承排序
                for (let i = 0; i < filelist.length; i++)
                {
                    var item = filelist[i];
                    var newpos = i;
                    if (item.extends.length > 0)
                    {
                        for (let j = 0; j < item.extends.length; j++)
                        {
                            var extendsclass = item.extends[j];
                            for (let k = i + 1; k < filelist.length; k++)
                            {
                                var itemk = filelist[k];
                                if (itemk.class.indexOf(extendsclass) != -1 && newpos < k)
                                {
                                    newpos = k;
                                }
                            }
                        }
                    }
                    if (newpos > i)
                    {
                        filelist[i] = null;
                        filelist.splice(newpos + 1, 0, item);
                    }
                }

                tsfiles.length = 0;
                for (let i = 0; i < filelist.length; i++)
                {
                    const element = filelist[i];
                    if (element)
                    {
                        // tsfiles.push(element.assets);
                    }
                }
            }
        }

    }
    codeCompiler = new ScriptCompiler();

}