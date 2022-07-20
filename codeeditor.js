/// <reference path="../feng3d/dist/index.d.ts" />
/// <reference path="dist/index.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html

window.feng3d = window.opener.feng3d;
window.editor = window.opener.editor;

initMonaco(() =>
{
    if (!monacoEditor)
    {
        monacoEditor = monaco.editor.create(document.getElementById('container'), {
            model: null,
            formatOnType: true,
        });
        window.onresize = function ()
        {
            monacoEditor.layout();
        };
    }

    feng3d.globalEmitter.on("codeeditor.openScript", (e) =>
    {
        openScript(e.data);
    });
    openScript(editor.editorData.openScript);
});

function openScript(script)
{
    feng3d.globalEmitter.emit("script.gettslibs", {
        callback: (tslibs) =>
        {
            codeEditor(tslibs, script);
        }
    });
}

var isInitMonaco = false;

//
var monacoEditor;

/**
 * 初始化 Monaco
 */
function initMonaco(callback)
{
    if (isInitMonaco) { callback(); return; }

    //
    amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
    amdRequire(['vs/editor/editor.main'], () =>
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

        isInitMonaco = true;
        callback();
    });
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
    }, 5000);
}

function getModel(file)
{
    if (file instanceof feng3d.JsonAsset)
        return "json";
    if (file instanceof feng3d.JSAsset)
        return "javascript";
    if (file instanceof feng3d.ScriptAsset)
        return "typescript";
    if (file instanceof feng3d.ShaderAsset)
        return "typescript";
    if (file instanceof feng3d.TextAsset)
        return "text";
    return "text";
}

function codeEditor(tslibs, file)
{
    if (!(file instanceof feng3d.TextAsset)) return;

    var model = getModel(file);
    var oldModel = monacoEditor.getModel();
    var newModel = monaco.editor.createModel(file.textContent, model);
    monacoEditor.setModel(newModel);
    if (oldModel) oldModel.dispose();

    // monacoEditor.setValue(code);
    if (file instanceof feng3d.ScriptAsset)
    {
        tslibs.forEach(v =>
        {
            if (v.path != file.assetPath) monaco.languages.typescript.typescriptDefaults.addExtraLib(v.code, v.path);
        });
        logLabel.textContent = "初次编译中。。。。";
        triggerCompile();
    }
    monacoEditor.onDidChangeModelContent(() =>
    {
        logLabel.textContent = "";
        file.textContent = monacoEditor.getValue();
        editor.editorRS.writeAsset(file, (err) =>
        {
            if (err) console.warn(err);
            logLabel.textContent = "自动保存完成！";
            if (file instanceof feng3d.ScriptAsset)
            {
                if (watchCB.checked)
                {
                    autoCompile();
                }
            }
        });
    });
};

// ------------ Compilation logic
function triggerCompile(callback)
{
    logLabel.textContent = "正在编译。。。。";
    feng3d.globalEmitter.emit("script.compile", {
        onComplete: () =>
        {
            logLabel.textContent = "完成编译。。。。";
            callback && callback();
        }
    });
}