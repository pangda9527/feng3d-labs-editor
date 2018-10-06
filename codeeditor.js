/// <reference path="../feng3d/out/feng3d.d.ts" />
/// <reference path="out/editor.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html

var ts;
var monacoEditor;

if (window.opener)
{
    window.feng3d = window.opener.feng3d;
    window.editor = window.opener.editor;
}

setTimeout(() =>
{
    var DBname = "feng3d-editor";
    var fstype = GetQueryString("fstype");
    var project = decodeURI(GetQueryString("project"));
    var id = decodeURI(GetQueryString("id"));

    var assetsfs = new feng3d.ReadWriteAssets(feng3d.indexedDBfs);
    if (fstype == "indexedDB")
    {
        feng3d.indexedDBfs.DBname = DBname;
        feng3d.indexedDBfs.projectname = project;
        assetsfs = feng3d.assets.fs = new feng3d.ReadWriteAssets(feng3d.indexedDBfs);
    } else if (fstype == "native")
    {
        var nativeFS = require(__dirname + "/io/NativeFS.js").nativeFS;
        nativeFS.projectname = project;
        assetsfs = feng3d.assets = new feng3d.ReadWriteAssets(nativeFS);
    }

    var compileButton = document.getElementById("compile");
    var watchCB = document.getElementById("watch");
    var logLabel = document.getElementById("log");

    compileButton.onclick = () =>
    {
        triggerCompile();
    };

    var timeoutid = 0;

    function autoCompile()
    {
        logLabel.textContent = "编码中。。。。";

        if (timeoutid)
            clearTimeout(timeoutid);

        timeoutid = setTimeout(() =>
        {
            if (timeoutid)
            {
                clearTimeout(timeoutid);
                logLabel.textContent = "自动编译中。。。。";
                triggerCompile();
            }
        }, 1000);
    }

    // ts 列表
    var tslist = [];
    var tslibs = [];

    document.head.getElementsByTagName("title")[0].innerText = id;

    // 加载所有ts文件
    function loadallts(callback)
    {
        assetsfs.readdir("Library/", (err, ids) =>
        {
            ids = ids.map(v => v.substring(0, v.length - 1));

            loadts();

            function loadts()
            {
                logLabel.textContent = "加载脚本中。。。。";
                if (ids.length > 0)
                {
                    var id = ids.pop();
                    assetsfs.readAssets(id, (err, assets) =>
                    {
                        if (err)
                            console.warn(err);
                        else
                        {
                            if (assets instanceof feng3d.ScriptFile)
                            {
                                tslist.push(assets);
                            }
                        }
                        loadts();
                    });
                } else
                {
                    logLabel.textContent = "加载脚本完成！";
                    callback();
                }
            }
        });
    }

    loadallts(init);

    function getModel(assets)
    {
        if (assets instanceof feng3d.JsonFile)
            return "json";
        if (assets instanceof feng3d.JSFile)
            return "javascript";
        if (assets instanceof feng3d.ScriptFile)
            return "typescript";
        if (assets instanceof feng3d.ShaderFile)
            return "typescript";
        if (assets instanceof feng3d.StringFile)
            return "text";
        return "text";
    }

    function init()
    {
        // 获取文件内容
        assetsfs.readAssets(id, (err, assets) =>
        {
            initEditor(() =>
            {
                var model = getModel(assets);
                var oldModel = monacoEditor.getModel();
                var newModel = monaco.editor.createModel(assets.textContent, model);
                monacoEditor.setModel(newModel);
                if (oldModel) oldModel.dispose();

                // monacoEditor.setValue(code);
                if (model == "typescript")
                {
                    logLabel.textContent = "初次编译中。。。。";
                    triggerCompile();
                }
                monacoEditor.onDidChangeModelContent(() =>
                {
                    logLabel.textContent = "";
                    assets.textContent = monacoEditor.getValue();
                    assetsfs.writeAssets(assets, (err) =>
                    {
                        if (err)
                            console.warn(err);
                        logLabel.textContent = "自动保存完成！";
                        if (assets instanceof feng3d.ScriptFile)
                        {
                            tslist.filter((v) => v.assetsId == id)[0].code = assets.textContent;
                            if (watch.checked)
                            {
                                autoCompile();
                            }
                        }
                    });
                });
            });
        });
    }

    function initEditor(callback)
    {
        if (fstype == feng3d.FSType.native)
        {
            var nodepath = require('path');
            function uriFromPath(_path)
            {
                var pathName = nodepath.resolve(_path).replace(/\\/g, '/');
                if (pathName.length > 0 && pathName.charAt(0) !== '/')
                {
                    pathName = '/' + pathName;
                }
                return encodeURI('file://' + pathName);
            }

            amdRequire.config({
                baseUrl: uriFromPath(nodepath.join(__dirname, 'libs/monaco-editor/min'))
            });
            // workaround monaco-css not understanding the environment
            self.module = undefined;
            // workaround monaco-typescript not understanding the environment
            self.process.browser = true;
            amdRequire(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], () =>
            {
                ts = amdRequire("vs/language/typescript/lib/typescriptServices");
                init();
            });
        } else
        {
            amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
            amdRequire(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], init);
        }

        function init()
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

            tslist.forEach(item =>
            {
                if (item.assetsId != id)
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(item.textContent, item.assetsId);
            });

            loadLibs(['https://unpkg.com/feng3d/out/feng3d.d.ts'], () =>
            {
                monacoEditor = monaco.editor.create(document.getElementById('container'), {
                    model: null,
                    formatOnType: true,
                });
                callback();
            });
        }
    }

    function loadLibs(libpaths, callback)
    {
        if (libpaths == null || libpaths.length == 0)
        {
            callback();
            return;
        }
        var libpath = libpaths.shift();
        xhr(libpath).then(function (response)
        {
            var libcode = response.responseText;
            monaco.languages.typescript.typescriptDefaults.addExtraLib(libcode, libpath.split("/").pop());
            tslibs.push({ path: libpath, code: libcode });
            loadLibs(libpaths, callback);
        });
    }

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
            assetsfs.writeString("project.js", outputStr, (err) =>
            {
                logLabel.textContent = "编译完成！";
                if (typeof editor != "undefined")
                {
                    editor.editorAssets.runProjectScript(() =>
                    {
                        feng3d.feng3dDispatcher.dispatch("assets.shaderChanged");
                        feng3d.feng3dDispatcher.dispatch("assets.scriptChanged");
                    });
                }
            });
        }
        catch (e)
        {
            logLabel.textContent = "Error from compilation: " + e + "  " + (e.stack || "");
            console.log("Error from compilation: " + e + "  " + (e.stack || ""));
        }
    }
    function transpileModule(options)
    {
        var tsSourceMap = {};
        tslibs.forEach(item =>
        {
            tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
        });
        tssort(tslist);

        // tslist.sort((a, b) => a.path > b.path);

        tslist.forEach((item) =>
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
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    }

    function xhr(url)
    {
        var req = null;
        return new monaco.Promise(function (c, e, p)
        {
            req = new XMLHttpRequest();
            req.onreadystatechange = function ()
            {
                if (req._canceled) { return; }

                if (req.readyState === 4)
                {
                    if ((req.status >= 200 && req.status < 300) || req.status === 1223)
                    {
                        c(req);
                    } else
                    {
                        e(req);
                    }
                    req.onreadystatechange = function () { };
                } else
                {
                    p(req);
                }
            };

            req.open("GET", url, true);
            req.responseType = "";

            req.send(null);
        }, function ()
            {
                req._canceled = true;
                req.abort();
            });
    }
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
        //按照字母排序
        filelist.sort((a, b) =>
        {
            if (a.class.length != b.class.length)
                return a.class.length - b.class.length;
            return a.path - b.path;
        })

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
                tsfiles.push(element.assets);
            }
        }
    }
}, 5000);