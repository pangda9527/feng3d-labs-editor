/// <reference path="../feng3d/out/feng3d.d.ts" />

var fstype = GetQueryString("fstype");

var result = [];

xhrTsconfig("../feng3d/tsconfig.json", () =>
{
    xhrTsconfig("../cannon/tsconfig.json", () =>
    {
        xhrTsconfig("../cannon-plugin/tsconfig.json", () =>
        {
            loadjs(result, () =>
            {
                if (fstype == "indexedDB")
                {
                    feng3d.indexedDBFS.projectname = decodeURI(GetQueryString("project"));
                    feng3d.fs = feng3d.indexedDBFS;
                    feng3d.rs = new feng3d.ReadRS(feng3d.indexedDBFS);
                }
                // 初始化资源系统
                feng3d.rs.init(() =>
                {
                    loadProjectJs(initProject);
                });
            });
        });
    });

});

function loadProjectJs(callback)
{
    if (feng3d.fs.type == feng3d.FSType.http)
    {
        feng3d.fs.getAbsolutePath("project.js", (err, path) =>
        {
            if (err) { feng3d.err(err); return; }
            var script = document.createElement("script");
            script.onload = () => { callback(); };
            script.src = path;
            document.head.appendChild(script);
        });
    } else
    {
        // 读取项目脚本
        feng3d.fs.readString("project.js", (err, content) =>
        {
            //
            var windowEval = eval.bind(window);
            // 运行project.js
            windowEval(content);
            callback();
        });
    }
}

function initProject(callback)
{
    var view3D = new feng3d.Engine();

    // 加载并初始化场景
    feng3d.fs.readObject("default.scene.json", (err, obj) =>
    {
        feng3d.rs.deserializeWithAssets(obj, (scene) =>
        {
            if (scene.getComponent(feng3d.Scene3D))
                view3D.scene = scene.getComponent(feng3d.Scene3D);

            var cameras = view3D.root.getComponentsInChildren(feng3d.Camera);
            if (cameras.length > 0)
            {
                view3D.camera = cameras[0];
            } else
            {
                var camera = view3D.camera;
                camera.transform.z = -10;
                camera.transform.lookAt(new feng3d.Vector3D());
                //
            }
            callback && callback();
        });
    });
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}


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

function xhrTsconfig(url, callback)
{
    var ps = url.split("/");
    ps.pop();
    var root = ps.join("/");
    xhr(url, (xhr) =>
    {
        var obj;
        eval("obj=" + xhr.responseText);
        if (obj.compilerOptions.outDir)
        {
            var files = obj.files.filter(v => v.indexOf(".d.ts") == -1);

            var sameStr = files[0];
            files.forEach(v => { sameStr = getSameStr(sameStr, v) });
            files = files.map(v => v.substr(sameStr.length).replace(".ts", ".js"));
            files.forEach(v => result.push(root + "/" + obj.compilerOptions.outDir + "/" + v));
        } else if (obj.compilerOptions.outFile)
        {
            result.push(root + "/" + obj.compilerOptions.outFile);
        }
        callback && callback();
    });
}

function getSameStr(a, b)
{
    var len = Math.min(a.length, b.length);
    for (var i = 0; i < len; i++)
    {
        if (a.charAt(i) != b.charAt(i)) return a.substr(0, i);
    }
    return a.substr(0, len);
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