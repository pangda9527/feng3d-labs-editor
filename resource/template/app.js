/// <reference path="libs/feng3d.d.ts" />

var view3D = new feng3d.Engine();

// 初始化资源系统
feng3d.rs.init(() => {
    loadProjectJs(initProject);
});

function loadProjectJs(callback) {

    if (feng3d.fs.type == feng3d.FSType.http) {
        feng3d.fs.getAbsolutePath("project.js", (err, path) => {
            if (err) { feng3d.err(err); return; }
            var script = document.createElement("script");
            script.onload = () => { callback(); };
            script.src = path;
            document.head.appendChild(script);
        });
    } else {
        // 读取项目脚本
        feng3d.fs.readString("project.js", (err, content) => {
            //
            var windowEval = eval.bind(window);
            // 运行project.js
            windowEval(content);
            callback();
        });
    }
}

function initProject() {
    // 加载并初始化场景
    feng3d.fs.readObject("default.scene.json", (err, scene) => {
        if (scene.getComponent(feng3d.Scene3D))
            view3D.scene = scene.getComponent(feng3d.Scene3D);

        var cameras = view3D.root.getComponentsInChildren(feng3d.Camera);
        if (cameras.length > 0) {
            view3D.camera = cameras[0];
        } else {
            var camera = view3D.camera;
            camera.transform.z = -10;
            camera.transform.lookAt(new feng3d.Vector3D());
            //
        }
    });
}