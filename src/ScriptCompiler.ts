/// <reference path="../libs/typescriptServices.d.ts" />

import { globalEmitter, IEvent, ScriptAsset, ticker } from 'feng3d';
import { editorRS } from './assets/EditorRS';
import { nativeAPI } from './assets/NativeRequire';
import { EditorData } from './global/EditorData';
import { EditorAsset, editorAsset } from './ui/assets/EditorAsset';

export var scriptCompiler: ScriptCompiler;

export class ScriptCompiler
{
    private tsconfig: { compilerOptions: ts.CompilerOptions, files: string[] };

    constructor()
    {
        globalEmitter.on("script.compile", this.onScriptCompile, this);
        globalEmitter.on("script.gettslibs", this.onGettsLibs, this);

        globalEmitter.on("openScript", this.onOpenScript, this);

        globalEmitter.on("fs.delete", this.onFileChanged, this);
        globalEmitter.on("fs.write", this.onFileChanged, this);
    }

    private onOpenScript(e)
    {
        EditorData.editorData.openScript = e.data;

        if (nativeAPI)
        {
            // 使用本地 VSCode 打开
            var path = editorRS.fs.getAbsolutePath(EditorData.editorData.openScript.assetPath);
            nativeAPI.openWithVSCode(editorRS.fs.projectname, (err) =>
            {
                if (err) throw err;
                nativeAPI.openWithVSCode(path, (err) =>
                {
                    if (err) throw err;
                });
            });
        } else
        {
            if (EditorAsset.codeeditoWin) EditorAsset.codeeditoWin.close();
            EditorAsset.codeeditoWin = window.open(`codeeditor.html`);
            EditorAsset.codeeditoWin.onload = () =>
            {
                globalEmitter.emit("codeeditor.openScript", EditorData.editorData.openScript);
            };
        }
    }

    private onGettsLibs(e: IEvent<{ callback: (tslibs: { path: string; code: string; }[]) => void; }>)
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
            console.assert(!err);

            this.tsconfig = json.parse(str);
            console.log(this.tsconfig);

            var tslist = editorRS.getAssetsByType(ScriptAsset);
            var files: string[] = this.tsconfig.files;
            files = files.filter(v => v.indexOf("Assets") != 0);
            files = files.concat(tslist.map(v => v.assetPath));
            //
            editorRS.fs.readStrings(files, (strs) =>
            {
                var tslibs = files.map((f, i) =>
                {
                    let str = strs[i]; if (typeof str == "string") return { path: f, code: str };
                    console.warn(`没有找到文件 ${f}`);
                    return null;
                }).filter(v => !!v);
                callback(tslibs)
            });
        });
    }

    private onFileChanged(e: IEvent<string>)
    {
        if (!e.data) return;
        if (e.data.substr(-3) == ".ts")
        {
            ticker.once(2000, <any>this.onScriptCompile, this);
        }
    }

    private onScriptCompile(e?: IEvent<{ onComplete?: () => void; }>)
    {
        this.loadtslibs((tslibs) =>
        {
            this.compile(tslibs, e && e.data && e.data.onComplete);
        });
    }

    private getOptions()
    {
        var targetMap = {
            'es3': ts.ScriptTarget.ES3, 'es5': ts.ScriptTarget.ES5, 'es2015': ts.ScriptTarget.ES2015, 'es2016': ts.ScriptTarget.ES2016, 'es2017': ts.ScriptTarget.ES2017, 'es2018': ts.ScriptTarget.ES2018
        };
        var options: ts.CompilerOptions = JSON.parse(JSON.stringify(this.tsconfig.compilerOptions));
        if (targetMap[options.target]) options.target = targetMap[options.target];
        return options;
    }

    private compile(tslibs: { path: string; code: string; }[], callback?: (output: { name: string; text: string; }[]) => void)
    {
        try
        {
            var output = this.transpileModule(tslibs);

            output.forEach(v =>
            {
                editorRS.fs.writeString(v.name, v.text);
            });

            editorAsset.runProjectScript(() =>
            {
                globalEmitter.emit("asset.scriptChanged");
            });
        }
        catch (e)
        {
            console.log("Error from compilation: " + e + "  " + (e.stack || ""));
        }
        callback && callback(null);

        globalEmitter.emit("message", `编译完成！`)
    }

    private transpileModule(tslibs: { path: string; code: string; }[])
    {
        var options = this.getOptions();
        var tsSourceMap: { [filepath: string]: ts.SourceFile } = {};
        var fileNames: string[] = [];
        tslibs.forEach(item =>
        {
            fileNames.push(item.path);
            tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
        });

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
        this.tsconfig.files = result.sortedFileNames;
        editorRS.fs.writeObject("tsconfig.json", this.tsconfig);
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
