namespace feng3d.editor
{
    export var editorshortcut: Editorshortcut;
    export class Editorshortcut
    {
        init()
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
            var preMousePoint: Vector2;
            shortcut.on("sceneCameraForwardBackMouseMoveStart", () =>
            {
                preMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
            });
            shortcut.on("sceneCameraForwardBackMouseMove", () =>
            {
                var currentMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
                var moveDistance = (currentMousePoint.x + currentMousePoint.y - preMousePoint.x - preMousePoint.y) * sceneControlConfig.sceneCameraForwardBackwardStep;
                sceneControlConfig.lookDistance -= moveDistance;

                var forward = editorCamera.transform.localToWorldMatrix.forward;
                var camerascenePosition = editorCamera.transform.scenePosition;
                var newCamerascenePosition = new Vector3(
                    forward.x * moveDistance + camerascenePosition.x,
                    forward.y * moveDistance + camerascenePosition.y,
                    forward.z * moveDistance + camerascenePosition.z);
                var newCameraPosition = editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
                editorCamera.transform.position = newCameraPosition;

                preMousePoint = currentMousePoint;
            });
            //
            shortcut.on("lookToSelectedGameObject", onLookToSelectedGameObject);
            shortcut.on("dragSceneStart", onDragSceneStart);
            shortcut.on("dragScene", onDragScene);
            shortcut.on("fpsViewStart", onFpsViewStart);
            shortcut.on("fpsViewStop", onFpsViewStop);
            shortcut.on("mouseRotateSceneStart", onMouseRotateSceneStart);
            shortcut.on("mouseRotateScene", onMouseRotateScene);
            shortcut.on("mouseWheelMoveSceneCamera", onMouseWheelMoveSceneCamera);
        }
    }

    editorshortcut = new Editorshortcut();

    var dragSceneMousePoint: Vector2;
    var dragSceneCameraGlobalMatrix3D: Matrix4x4;
    var rotateSceneCenter: Vector3;
    var rotateSceneCameraGlobalMatrix3D: Matrix4x4;
    var rotateSceneMousePoint: Vector2;

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

    function onDragSceneStart()
    {
        dragSceneMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        dragSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
    }

    function onDragScene()
    {
        var mousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        var addPoint = mousePoint.subTo(dragSceneMousePoint);
        var scale = editorCamera.getScaleByDepth(sceneControlConfig.lookDistance);
        var up = dragSceneCameraGlobalMatrix3D.up;
        var right = dragSceneCameraGlobalMatrix3D.right;
        up.scale(addPoint.y * scale);
        right.scale(-addPoint.x * scale);
        var globalMatrix3D = dragSceneCameraGlobalMatrix3D.clone();
        globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
        editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    }

    function onFpsViewStart()
    {
        var fpsController: FPSController = editorCamera.getComponent(FPSController)
        fpsController.onMousedown();
        ticker.onframe(updateFpsView)
    }

    function onFpsViewStop()
    {
        var fpsController: FPSController = editorCamera.getComponent(FPSController)
        fpsController.onMouseup();
        ticker.offframe(updateFpsView)
    }

    function updateFpsView()
    {
        var fpsController: FPSController = editorCamera.getComponent(FPSController)
        fpsController.update();
    }

    function onMouseRotateSceneStart()
    {
        rotateSceneMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        rotateSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
        rotateSceneCenter = null;
        //获取第一个 游戏对象
        var firstObject = editorData.firstSelectedGameObject;
        if (firstObject)
        {
            rotateSceneCenter = firstObject.transform.scenePosition;
        } else
        {
            rotateSceneCenter = rotateSceneCameraGlobalMatrix3D.forward;
            rotateSceneCenter.scale(sceneControlConfig.lookDistance);
            rotateSceneCenter = rotateSceneCenter.addTo(rotateSceneCameraGlobalMatrix3D.position);
        }
    }

    function onMouseRotateScene()
    {
        var globalMatrix3D = rotateSceneCameraGlobalMatrix3D.clone();
        var mousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        var view3DRect = engine.viewRect;
        var rotateX = (mousePoint.y - rotateSceneMousePoint.y) / view3DRect.height * 180;
        var rotateY = (mousePoint.x - rotateSceneMousePoint.x) / view3DRect.width * 180;
        globalMatrix3D.appendRotation(Vector3.Y_AXIS, rotateY, rotateSceneCenter);
        var rotateAxisX = globalMatrix3D.right;
        globalMatrix3D.appendRotation(rotateAxisX, rotateX, rotateSceneCenter);
        editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    }

    function onLookToSelectedGameObject()
    {
        var selectedGameObject = editorData.firstSelectedGameObject;
        if (selectedGameObject)
        {
            var worldBounds = selectedGameObject.getComponent(BoundingComponent).worldBounds;
            var size = 1;
            if (worldBounds)
                size = worldBounds.getSize().length;
            size = Math.max(size, 1);
            //
            var cameraGameObject = editorCamera;
            sceneControlConfig.lookDistance = size;
            var lookPos = cameraGameObject.transform.localToWorldMatrix.forward;
            lookPos.scale(- sceneControlConfig.lookDistance);
            lookPos.add(selectedGameObject.transform.scenePosition);
            var localLookPos = lookPos.clone();
            if (cameraGameObject.transform.parent)
            {
                cameraGameObject.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
            }
            egret.Tween.get(editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
        }
    }

    function onMouseWheelMoveSceneCamera()
    {
        var distance = windowEventProxy.wheelDelta * sceneControlConfig.mouseWheelMoveStep * sceneControlConfig.lookDistance / 10;
        editorCamera.transform.localToWorldMatrix = editorCamera.transform.localToWorldMatrix.moveForward(distance);
        sceneControlConfig.lookDistance -= distance;
    }

    export class SceneControlConfig
    {
        mouseWheelMoveStep = 0.004;

        //dynamic
        lookDistance = 3;

        sceneCameraForwardBackwardStep = 0.01;
    }
    export var sceneControlConfig = new SceneControlConfig();
}