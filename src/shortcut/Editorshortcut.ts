namespace editor
{
    export var editorshortcut: Editorshortcut;
    export class Editorshortcut
    {
        init()
        {
            //监听命令
            feng3d.shortcut.on("deleteSeletedGameObject", onDeleteSeletedGameObject);

            feng3d.shortcut.on("gameobjectMoveTool", () =>
            {
                mrsTool.toolType = MRSToolType.MOVE;
            });
            feng3d.shortcut.on("gameobjectRotationTool", () =>
            {
                mrsTool.toolType = MRSToolType.ROTATION;
            });
            feng3d.shortcut.on("gameobjectScaleTool", () =>
            {
                mrsTool.toolType = MRSToolType.SCALE;
            });
            feng3d.shortcut.on("selectGameObject", () =>
            {
                var gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), editorScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
                if (gameObjects.length > 0) return;

                gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), engine.scene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
                if (gameObjects.length == 0)
                {
                    editorData.selectedObjects = null;
                    return;
                }

                var gameObject = gameObjects[0];
                var node = hierarchyTree.getNode(gameObject);
                while (!node && gameObject.parent)
                {
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
            var preMousePoint: feng3d.Vector2;
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", () =>
            {
                preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            });
            feng3d.shortcut.on("sceneCameraForwardBackMouseMove", () =>
            {
                var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
                var moveDistance = (currentMousePoint.x + currentMousePoint.y - preMousePoint.x - preMousePoint.y) * sceneControlConfig.sceneCameraForwardBackwardStep;
                sceneControlConfig.lookDistance -= moveDistance;

                var forward = editorCamera.transform.localToWorldMatrix.forward;
                var camerascenePosition = editorCamera.transform.scenePosition;
                var newCamerascenePosition = new feng3d.Vector3(
                    forward.x * moveDistance + camerascenePosition.x,
                    forward.y * moveDistance + camerascenePosition.y,
                    forward.z * moveDistance + camerascenePosition.z);
                var newCameraPosition = editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
                editorCamera.transform.position = newCameraPosition;

                preMousePoint = currentMousePoint;
            });
            //
            feng3d.shortcut.on("lookToSelectedGameObject", onLookToSelectedGameObject);
            feng3d.shortcut.on("dragSceneStart", onDragSceneStart);
            feng3d.shortcut.on("dragScene", onDragScene);
            feng3d.shortcut.on("fpsViewStart", onFpsViewStart);
            feng3d.shortcut.on("fpsViewStop", onFpsViewStop);
            feng3d.shortcut.on("mouseRotateSceneStart", onMouseRotateSceneStart);
            feng3d.shortcut.on("mouseRotateScene", onMouseRotateScene);
            feng3d.shortcut.on("mouseWheelMoveSceneCamera", onMouseWheelMoveSceneCamera);
        }
    }

    editorshortcut = new Editorshortcut();

    var dragSceneMousePoint: feng3d.Vector2;
    var dragSceneCameraGlobalMatrix3D: feng3d.Matrix4x4;
    var rotateSceneCenter: feng3d.Vector3;
    var rotateSceneCameraGlobalMatrix3D: feng3d.Matrix4x4;
    var rotateSceneMousePoint: feng3d.Vector2;

    function onDeleteSeletedGameObject()
    {
        var selectedObject = editorData.selectedObjects;

        if (!selectedObject)
            return;
        //删除文件引用计数
        var deletefileNum = 0;
        selectedObject.forEach(element =>
        {
            if (element instanceof feng3d.GameObject)
            {
                element.remove();
            } else if (element instanceof AssetsFile)
            {
                deletefileNum++;
                editorAssets.deletefile(element.path, () =>
                {
                    deletefileNum--;
                    // 等待删除所有文件 后清空选中对象
                    if (deletefileNum == 0)
                    {
                        editorData.selectedObjects = null;
                    }
                });
            }
        });
        // 等待删除所有文件 后清空选中对象
        if (deletefileNum == 0)
        {
            editorData.selectedObjects = null;
        }
    }

    function onDragSceneStart()
    {
        dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        dragSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
    }

    function onDragScene()
    {
        var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
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
        var fpsController: feng3d.FPSController = editorCamera.getComponent(feng3d.FPSController)
        fpsController.onMousedown();
        feng3d.ticker.onframe(updateFpsView)
    }

    function onFpsViewStop()
    {
        var fpsController = editorCamera.getComponent(feng3d.FPSController)
        fpsController.onMouseup();
        feng3d.ticker.offframe(updateFpsView)
    }

    function updateFpsView()
    {
        var fpsController = editorCamera.getComponent(feng3d.FPSController)
        fpsController.update();
    }

    function onMouseRotateSceneStart()
    {
        rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
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
        var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var view3DRect = engine.viewRect;
        var rotateX = (mousePoint.y - rotateSceneMousePoint.y) / view3DRect.height * 180;
        var rotateY = (mousePoint.x - rotateSceneMousePoint.x) / view3DRect.width * 180;
        globalMatrix3D.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, rotateSceneCenter);
        var rotateAxisX = globalMatrix3D.right;
        globalMatrix3D.appendRotation(rotateAxisX, rotateX, rotateSceneCenter);
        editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    }

    function onLookToSelectedGameObject()
    {
        var selectedGameObject = editorData.firstSelectedGameObject;
        if (selectedGameObject)
        {
            var model = selectedGameObject.getComponent(feng3d.Model);

            var size = 1;
            if (model && model.worldBounds)
                size = model.worldBounds.getSize().length;
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
        var distance = feng3d.windowEventProxy.wheelDelta * sceneControlConfig.mouseWheelMoveStep * sceneControlConfig.lookDistance / 10;
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