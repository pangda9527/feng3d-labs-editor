/// <reference path="libs/feng3d.d.ts" />
/// <reference path="node_modules/monaco-editor/monaco.d.ts" />

var editor;
(function ()
{
    var fstype = GetQueryString("fstype");
    var code;

    if (fstype == "indexedDB")
    {
        var DBname = GetQueryString("DBname");
        var project = GetQueryString("project");
        var path = GetQueryString("path");

        feng3d.storage.get(DBname, project, path, function (err, data)
        {
            console.log(err, data);
            if (data && data.data)
                code = data.data;
            else
                code = "";
        });
    }

    require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], function ()
    {
        xhr('libs/feng3d.d.ts').then(function (response)
        {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(response.responseText, 'feng3d.d.ts');
            editor = monaco.editor.create(document.getElementById('container'), {
                value: "",
                language: 'typescript',
                formatOnType: true
            });
            editor.setValue(code);
        });
    });


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