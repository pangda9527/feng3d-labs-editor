/// <reference path="libs/feng3d.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

var editor;
(function ()
{
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

    var fstype = GetQueryString("fstype");
    var code;
    var codedata;
    var feng3ddts;
    // ts 列表
    var tslist = [];

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
                        editor.setValue(code);
                        if (extension == "ts")
                        {
                            loadallts(() =>
                            {
                                logLabel.textContent = "初次编译中。。。。";
                                triggerCompile();
                            });
                        }
                        editor.onDidChangeModelContent(function ()
                        {
                            logLabel.textContent = "";
                            code = editor.getValue();
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
            xhr('libs/feng3d.d.ts').then(function (response)
            {
                if (extension == "ts")
                {
                    var compilerOptions = {
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
                    };

                    feng3ddts = response.responseText;
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(feng3ddts, 'feng3d.d.ts');

                    editor = monaco.editor.create(document.getElementById('container'), {
                        value: "",
                        language: 'typescript',
                        formatOnType: true
                    });
                    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
                } else if (extension == "js")
                {
                    feng3ddts = response.responseText;
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(feng3ddts, 'feng3d.d.ts');
                    editor = monaco.editor.create(document.getElementById('container'), {
                        value: "",
                        language: 'javascript',
                        formatOnType: true
                    });
                } else if (extension == "json")
                {
                    editor = monaco.editor.create(document.getElementById('container'), {
                        value: "",
                        language: 'json',
                        formatOnType: true
                    });
                } else 
                {
                    editor = monaco.editor.create(document.getElementById('container'), {
                        value: "",
                        language: 'text',
                        formatOnType: true
                    });
                }
                callback();
            });
        });
    }

    // ------------ Compilation logic
    function triggerCompile()
    {
        try
        {
            var code = tslist.map((v) => v.code).join("\n");

            var output = transpileModule(code, {
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noLib: true,
                noResolve: true,
                suppressOutputPathCheck: true
            });
            if (typeof output === "string")
            {
                output += `\n//# sourceURL=project.js`;
                feng3d.dataTransform.stringToArrayBuffer(output, (arrayBuffer) =>
                {
                    codedata.data = arrayBuffer;
                    // feng3d.storage.set(DBname, project, path.replace(/\.ts\b/, ".js"), codedata);
                    feng3d.storage.set(DBname, project, "project.js", codedata);
                    logLabel.textContent = "编译完成！";
                });
            }
        }
        catch (e)
        {
            logLabel.textContent = "Error from compilation: " + e + "  " + (e.stack || "");
            console.log("Error from compilation: " + e + "  " + (e.stack || ""));
        }
    }
    function transpileModule(input, options)
    {
        var inputFileName = options.jsx ? "module.tsx" : "module.ts";

        var sourceFile = ts.createSourceFile(inputFileName, feng3ddts + input, options.target || ts.ScriptTarget.ES5);
        // Output
        var outputText;
        var program = ts.createProgram([inputFileName], options, {
            getSourceFile: function (fileName) { return fileName.indexOf("module") === 0 ? sourceFile : undefined; },
            writeFile: function (_name, text) { outputText = text; },
            getDefaultLibFileName: function () { return "lib.d.ts"; },
            useCaseSensitiveFileNames: function () { return false; },
            getCanonicalFileName: function (fileName) { return fileName; },
            getCurrentDirectory: function () { return ""; },
            getNewLine: function () { return "\r\n"; },
            fileExists: function (fileName) { return fileName === inputFileName; },
            readFile: function () { return ""; },
            directoryExists: function () { return true; },
            getDirectories: function () { return []; }
        });
        // Emit
        program.emit();
        if (outputText === undefined)
        {
            throw new Error("Output generation failed");
        }
        return outputText;
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