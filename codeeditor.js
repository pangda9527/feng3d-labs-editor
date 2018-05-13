/// <reference path="libs/feng3d.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

var monacoEditor;
(function ()
{
    var compileButton = document.getElementById("compile");
    var watchCB = document.getElementById("watch");
    var logLabel = document.getElementById("log");
    var codeeditorDiv = document.getElementById("codeeditorDiv");

    window.onkeyup = (e) =>
    {
        if (e.key == "Escape")
        {
            codeeditorDiv.style.display = "none";
        }
    }

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

    var fstype = GetQueryString("fstype");
    var code;
    var codedata;
    // ts 列表
    var tslist = [];
    var tslibs = [];

    if (fstype == "indexedDB")
    {
        var DBname = decodeURI(GetQueryString("DBname"));
        var project = decodeURI(GetQueryString("project"));
        var path = decodeURI(GetQueryString("path"));
        var extension = decodeURI(GetQueryString("extension"));
        if (!extension)
            extension = path.split(".").pop();

        document.head.getElementsByTagName("title")[0].innerText = path;

        // 加载所有ts文件
        function loadallts(callback)
        {
            feng3d.storage.getAllKeys(DBname, project, (err, keys) =>
            {
                var tspaths = keys.filter((v) => v.split(".").pop() == "ts");
                loadts();

                function loadts()
                {
                    logLabel.textContent = "加载脚本中。。。。";
                    if (tspaths.length > 0)
                    {
                        var path = tspaths.pop();
                        feng3d.storage.get(DBname, project, path, (err, data) =>
                        {
                            feng3d.dataTransform.arrayBufferToString(data.data, function (str)
                            {
                                tslist.push({ path: path, code: str });
                                loadts();
                            });
                        });
                    } else
                    {
                        callback();
                    }
                }
            });
        }

        var modelMap = { ts: "typescript", js: "javascript", json: "json", text: "text" };
        init();

        function init()
        {
            // 获取文件内容
            feng3d.storage.get(DBname, project, path, function (err, data)
            {
                codedata = data;
                feng3d.assert(data.data.constructor == ArrayBuffer, "读取的数据不是 ArrayBuffer");
                feng3d.dataTransform.arrayBufferToString(data.data, function (str)
                {
                    var code = str;
                    initEditor(extension, function ()
                    {
                        var oldModel = monacoEditor.getModel();
                        var newModel = monaco.editor.createModel(code, modelMap[extension] || modelMap.text);
                        monacoEditor.setModel(newModel);
                        if (oldModel) oldModel.dispose();

                        // monacoEditor.setValue(code);
                        if (extension == "ts")
                        {
                            loadallts(() =>
                            {
                                logLabel.textContent = "初次编译中。。。。";
                                triggerCompile();
                            });
                        }
                        monacoEditor.onDidChangeModelContent(function ()
                        {
                            logLabel.textContent = "";
                            code = monacoEditor.getValue();
                            feng3d.dataTransform.stringToArrayBuffer(code, (arrayBuffer) =>
                            {
                                codedata.data = arrayBuffer;
                                feng3d.storage.set(DBname, project, path, codedata);
                                if (extension == "ts")
                                {
                                    tslist.filter((v) => v.path == path)[0].code = code;
                                    if (watch.checked)
                                    {
                                        autoCompile();
                                    }
                                }
                            })
                        });
                    });
                });
            });
        }
    }

    function initEditor(extension, callback)
    {
        require.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], function ()
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

            loadLibs(['libs/feng3d.d.ts'], () =>
            {
                monacoEditor = monaco.editor.create(document.getElementById('container'), {
                    model: null,
                    formatOnType: true,
                });
                callback();
            });
        });
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
            feng3d.dataTransform.stringToArrayBuffer(outputStr, (arrayBuffer) =>
            {
                codedata.data = arrayBuffer;
                feng3d.storage.set(DBname, project, "project.js", codedata);
                logLabel.textContent = "编译完成！";
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
        tslist.forEach((item) =>
        {
            tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
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
})();