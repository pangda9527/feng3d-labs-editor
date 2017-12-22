namespace feng3d.editor
{
    export var editorshortcut = {
        init: init,
    };

    function init()
    {
        //监听命令
        shortcut.on("deleteSeletedGameObject", onDeleteSeletedGameObject);

        shortcut.on("gameobjectMoveTool", () =>
        {
            mrsTool.toolType = MRSToolType.MOVE;
        });
        shortcut.on("gameobjectRotationTool", () =>
        {
            mrsTool.toolType = MRSToolType.ROTATION;
        });
        shortcut.on("gameobjectScaleTool", () =>
        {
            mrsTool.toolType = MRSToolType.SCALE;
        });
        shortcut.on("selectGameObject", () =>
        {
            var gameObject = engine.mouse3DManager.getSelectedGameObject();
            if (!gameObject || !gameObject.scene)
            {
                editorData.selectedObjects = null;
                return;
            }
            if (editorData.mrsToolObject == gameObject)
                return;
            var node = hierarchyTree.getNode(gameObject);
            while (!node && gameObject.parent)
            {
                if (editorData.mrsToolObject == gameObject)
                    return;
                gameObject = gameObject.parent;
                node = hierarchyTree.getNode(gameObject);
            }
            if (gameObject != gameObject.scene.gameObject)
            {
                editorData.selectObject(gameObject);
            } else
            {
                editorData.selectedObjects = null;
            }
        });
        var preMousePoint: Point;
        shortcut.on("sceneCameraForwardBackMouseMoveStart", () =>
        {
            preMousePoint = new Point(windowEventProxy.clientX, windowEventProxy.clientY);
        });
        shortcut.on("sceneCameraForwardBackMouseMove", () =>
        {
            var currentMousePoint = new Point(windowEventProxy.clientX, windowEventProxy.clientY);
            var moveDistance = (currentMousePoint.x + currentMousePoint.y - preMousePoint.x - preMousePoint.y) * sceneControlConfig.sceneCameraForwardBackwardStep;
            sceneControlConfig.lookDistance -= moveDistance;

            var forward = engine.camera.transform.localToWorldMatrix.forward;
            var camerascenePosition = engine.camera.transform.scenePosition;
            var newCamerascenePosition = new Vector3D(
                forward.x * moveDistance + camerascenePosition.x,
                forward.y * moveDistance + camerascenePosition.y,
                forward.z * moveDistance + camerascenePosition.z);
            var newCameraPosition = engine.camera.transform.inverseTransformPoint(newCamerascenePosition);
            engine.camera.transform.position = newCameraPosition;

            preMousePoint = currentMousePoint;
        });

    }

    function onDeleteSeletedGameObject()
    {
        var selectedObject = editorData.selectedObjects;

        if (!selectedObject)
            return;
        selectedObject.forEach(element =>
        {
            if (element instanceof GameObject)
            {
                element.remove();
            } else if (element instanceof AssetsFile)
            {
                element.deleteFile();
            }
        });
        //
        editorData.selectedObjects = null;
    }
}