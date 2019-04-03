var isdebug = true;


var result = [
    isdebug ? "libs/modules/egret/egret.js" : "libs/modules/egret/egret.min.js",
    isdebug ? "libs/modules/egret/egret.web.js" : "libs/modules/egret/egret.web.min.js",
    isdebug ? "libs/modules/res/res.js" : "libs/modules/res/res.min.js",
    isdebug ? "libs/modules/eui/eui.js" : "libs/modules/eui/eui.min.js",
    isdebug ? "libs/modules/tween/tween.js" : "libs/modules/tween/tween.min.js",
];

xhrTsconfig("feng3d/tsconfig.json", () =>
{
    xhrTsconfig("tsconfig.json", () =>
    {
        loadjs(result, loadComplete);
    });
});

function loadjs(path, onload, onerror)
{
    if (typeof path == "string")
    {
        var script = document.createElement('script');
        script.src = path;
        script.onload = (ev) =>
        {
            if (onload)
                onload(ev);
            else
            {
                console.log(`${path} 加载完成`);
            }
        }
        script.onerror = () =>
        {
            if (onerror)
                onerror();
            else
            {
                console.warn(`${path} 加载失败！`);
            }
        }
        document.head.appendChild(script);
    } else
    {
        if (path.length == 0)
        {
            onload();
        } else
        {
            loadjs(path.shift(), () =>
            {
                loadjs(path, onload, onerror);
            }, onerror);
        }
    }
}

function loadComplete()
{
    // console.log("loadComplete!");
    /**
     * {
     * "renderMode":, //引擎渲染模式，"canvas" 或者 "webgl"
     * "audioType": "" //使用的音频类型，0:默认，1:qq audio，2:web audio，3:audio
     * "antialias": //WebGL模式下是否开启抗锯齿，true:开启，false:关闭，默认为false
     * }
     **/
    egret.runEgret({ renderMode: "webgl", audioType: 0 });
}

function xhrTsconfig(url, callback)
{
    var ps = url.split("/");
    ps.pop();
    var root = ps.join("/");
    xhr(url, (xhr) =>
    {
        var obj = JSON.parse(xhr.responseText.split("\n").map(v =>
        {
            var index = v.indexOf("//");
            if (index > 0)
                v = v.substr(0, index);
            return v;
        }).join(""));
        if (obj.compilerOptions.outDir)
        {
            obj.files.forEach(v => result.push(root + "/" + obj.compilerOptions.outDir + "/" + v));
        } else if (obj.compilerOptions.outFile)
        {
            result.push(root + "/" + obj.compilerOptions.outFile);
        }
        callback && callback();
    });
}

function xhr(url, complete, error)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function ()
    {
        if (req.readyState === 4)
        {
            if ((req.status >= 200 && req.status < 300) || req.status === 1223)
            {
                complete(req);
            }
            else
            {
                error && error(req);
            }
            req.onreadystatechange = function () { };
        }
    };
    req.open("GET", url, true);
    req.responseType = "";
    req.send(null);
}