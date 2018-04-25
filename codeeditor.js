/// <reference path="libs/feng3d.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

var editor;
(function ()
{
    var fstype = GetQueryString("fstype");
    var code;
    var codedata;
    var feng3ddts;

    if (fstype == "indexedDB")
    {
        var DBname = decodeURI(GetQueryString("DBname"));
        var project = decodeURI(GetQueryString("project"));
        var path = decodeURI(GetQueryString("path"));
        var extension = decodeURI(GetQueryString("extension"));
        if (!extension)
            extension = path.split(".").pop();

        feng3d.storage.get(DBname, project, path, function (err, data)
        {
            if (data && data.data)
            {
                code = data.data;
                if (code.constructor == Uint8Array)
                {
                    feng3d.dataTransform.uint8ArrayToString(code, function (str)
                    {
                        code = str;
                    });
                }
            }
            else
                code = "";
            codedata = data;

            initEditor(extension, function ()
            {
                editor.setValue(code);
                if (extension == "ts")
                    triggerCompile();
                editor.onDidChangeModelContent(function ()
                {
                    codedata.data = editor.getValue();
                    feng3d.storage.set(DBname, project, path, codedata);
                    if (extension == "ts")
                        triggerCompile();
                });
            });

        });
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
    var compilerTriggerTimeoutID = null;
    function triggerCompile()
    {
        if (compilerTriggerTimeoutID !== null)
        {
            window.clearTimeout(compilerTriggerTimeoutID);
        }
        compilerTriggerTimeoutID = window.setTimeout(function ()
        {
            try
            {
                var output = transpileModule(editor.getValue(), {
                    // module: ts.ModuleKind.AMD,
                    target: ts.ScriptTarget.ES5,
                    noLib: true,
                    noResolve: true,
                    suppressOutputPathCheck: true
                });
                if (typeof output === "string")
                {
                    codedata.data = output;
                    feng3d.storage.set(DBname, project, path.replace(/\.ts\b/, ".js"), codedata);
                }
            }
            catch (e)
            {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
        }, 100);
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


    layout();
    window.onresize = layout;


    function layout()
    {
        var GLOBAL_PADDING = 20;

        var WIDTH = window.innerWidth - 2 * GLOBAL_PADDING;
        var HEIGHT = window.innerHeight - 2 * GLOBAL_PADDING;

        var editorContainer = document.getElementById('container')

        editorContainer.style.position = 'absolute';
        editorContainer.style.boxSizing = 'border-box';
        editorContainer.style.top = GLOBAL_PADDING + 'px';
        editorContainer.style.left = GLOBAL_PADDING + 'px';
        editorContainer.style.width = WIDTH + 'px';
        editorContainer.style.height = HEIGHT + 'px';
    }
})();