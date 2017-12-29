/// <reference path="libs/feng3d.d.ts" />

var view3D = new feng3d.Engine();

var project = window.location.search.substr(1).match(/project=([^&]*)/)[1];

feng3d.indexedDBfs.initproject(project, () =>
{
    feng3d.indexedDBfs.readFileAsString("default.scene", (err, content) =>
    {
        var json = JSON.parse(content);
        var scene = feng3d.serialization.deserialize(json);
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
    });
});