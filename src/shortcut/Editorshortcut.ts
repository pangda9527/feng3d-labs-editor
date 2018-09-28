namespace editor
{
    export class Editorshortcut
    {
        private preMousePoint: feng3d.Vector2;
        private selectedObjectsHistory: feng3d.GameObject[] = [];
        private dragSceneMousePoint: feng3d.Vector2;
        private dragSceneCameraGlobalMatrix3D: feng3d.Matrix4x4;
        private rotateSceneCenter: feng3d.Vector3;
        private rotateSceneCameraGlobalMatrix3D: feng3d.Matrix4x4;
        private rotateSceneMousePoint: feng3d.Vector2;

        constructor()
        {
            //监听命令
            feng3d.shortcut.on("deleteSeletedGameObject", this.onDeleteSeletedGameObject, this);
            //
            feng3d.shortcut.on("gameobjectMoveTool", this.onGameobjectMoveTool, this);
            feng3d.shortcut.on("gameobjectRotationTool", this.onGameobjectRotationTool, this);
            feng3d.shortcut.on("gameobjectScaleTool", this.onGameobjectScaleTool, this);
            feng3d.shortcut.on("selectGameObject", this.onSelectGameObject, this);
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", this.onSceneCameraForwardBackMouseMoveStart, this);
            feng3d.shortcut.on("sceneCameraForwardBackMouseMove", this.onSceneCameraForwardBackMouseMove, this);
            //
            feng3d.shortcut.on("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
            feng3d.shortcut.on("dragSceneStart", this.onDragSceneStart, this);
            feng3d.shortcut.on("dragScene", this.onDragScene, this);
            feng3d.shortcut.on("fpsViewStart", this.onFpsViewStart, this);
            feng3d.shortcut.on("fpsViewStop", this.onFpsViewStop, this);
            feng3d.shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            feng3d.shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
            feng3d.shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
            //
            feng3d.shortcut.on("areaSelectStart", this.onAreaSelectStart, this);
            feng3d.shortcut.on("areaSelect", this.onAreaSelect, this);
            feng3d.shortcut.on("areaSelectEnd", this.onAreaSelectEnd, this);
        }

        private areaSelectStartPosition: feng3d.Vector2;
        private onAreaSelectStart()
        {
            this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        }

        private onAreaSelect()
        {
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);

            var lt = editorui.feng3dView.localToGlobal(0, 0);
            var rb = editorui.feng3dView.localToGlobal(editorui.feng3dView.width, editorui.feng3dView.height);
            var rectangle = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            //
            areaSelectEndPosition.x = Math.min(Math.max(areaSelectEndPosition.x, rectangle.left), rectangle.right);
            areaSelectEndPosition.y = Math.min(Math.max(areaSelectEndPosition.y, rectangle.top), rectangle.bottom);
            //
            areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);

        }

        private onAreaSelectEnd()
        {
            areaSelectRect.hide();
        }

        private onGameobjectMoveTool()
        {
            editorData.toolType = MRSToolType.MOVE;
        }

        private onGameobjectRotationTool()
        {
            editorData.toolType = MRSToolType.ROTATION;
        }

        private onGameobjectScaleTool()
        {
            editorData.toolType = MRSToolType.SCALE;
        }

        private onSceneCameraForwardBackMouseMoveStart()
        {
            this.preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        }

        private onSceneCameraForwardBackMouseMove()
        {
            var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var moveDistance = (currentMousePoint.x + currentMousePoint.y - this.preMousePoint.x - this.preMousePoint.y) * sceneControlConfig.sceneCameraForwardBackwardStep;
            sceneControlConfig.lookDistance -= moveDistance;

            var forward = editorCamera.transform.localToWorldMatrix.forward;
            var camerascenePosition = editorCamera.transform.scenePosition;
            var newCamerascenePosition = new feng3d.Vector3(
                forward.x * moveDistance + camerascenePosition.x,
                forward.y * moveDistance + camerascenePosition.y,
                forward.z * moveDistance + camerascenePosition.z);
            var newCameraPosition = editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
            editorCamera.transform.position = newCameraPosition;

            this.preMousePoint = currentMousePoint;
        }

        private onSelectGameObject()
        {
            var gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), editorScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
            if (gameObjects.length > 0)
                return;
            //
            gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), engine.scene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
            if (gameObjects.length == 0)
            {
                editorData.clearSelectedObjects();
                return;
            }
            //
            gameObjects = gameObjects.reduce((pv: feng3d.GameObject[], gameObject) =>
            {
                var node = hierarchy.getNode(gameObject);
                while (!node && gameObject.parent)
                {
                    gameObject = gameObject.parent;
                    node = hierarchy.getNode(gameObject);
                }
                if (gameObject != gameObject.scene.gameObject)
                {
                    pv.push(gameObject);
                }
                return pv;
            }, []);
            //
            if (gameObjects.length > 0)
            {
                var selectedObjectsHistory = this.selectedObjectsHistory;
                var gameObject = gameObjects.reduce((pv, cv) =>
                {
                    if (pv) return pv;
                    if (selectedObjectsHistory.indexOf(cv) == -1) pv = cv;
                    return pv;
                }, null);
                if (!gameObject)
                {
                    selectedObjectsHistory.length = 0;
                    gameObject = gameObjects[0];
                }
                editorData.selectObject(gameObject);
                selectedObjectsHistory.push(gameObject);
            }
            else
            {
                editorData.clearSelectedObjects();
            }
        }

        private onDeleteSeletedGameObject()
        {
            var selectedObject = editorData.selectedObjects;

            if (!selectedObject)
                return;
            //删除文件引用计数
            selectedObject.forEach(element =>
            {
                if (element instanceof feng3d.GameObject)
                {
                    element.remove();
                } else if (element instanceof AssetsFile)
                {
                    element.delete();
                }
            });
            editorData.clearSelectedObjects();
        }

        private onDragSceneStart()
        {
            this.dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            this.dragSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
        }

        private onDragScene()
        {
            var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var addPoint = mousePoint.subTo(this.dragSceneMousePoint);
            var scale = editorCamera.getScaleByDepth(sceneControlConfig.lookDistance);
            var up = this.dragSceneCameraGlobalMatrix3D.up;
            var right = this.dragSceneCameraGlobalMatrix3D.right;
            up.scale(addPoint.y * scale);
            right.scale(-addPoint.x * scale);
            var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            editorCamera.transform.localToWorldMatrix = globalMatrix3D;
        }

        private onFpsViewStart()
        {
            var fpsController: feng3d.FPSController = editorCamera.getComponent(feng3d.FPSController)
            fpsController.onMousedown();
            feng3d.ticker.onframe(this.updateFpsView)
        }

        private onFpsViewStop()
        {
            var fpsController = editorCamera.getComponent(feng3d.FPSController)
            fpsController.onMouseup();
            feng3d.ticker.offframe(this.updateFpsView)
        }

        private updateFpsView()
        {
            var fpsController = editorCamera.getComponent(feng3d.FPSController)
            fpsController.update();
        }

        private onMouseRotateSceneStart()
        {
            this.rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            this.rotateSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
            this.rotateSceneCenter = null;
            //获取第一个 游戏对象
            var transformBox = editorData.transformBox;
            if (transformBox)
            {
                this.rotateSceneCenter = transformBox.getCenter();
            } else
            {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scale(sceneControlConfig.lookDistance);
                this.rotateSceneCenter = this.rotateSceneCenter.addTo(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        }

        private onMouseRotateScene()
        {
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var view3DRect = engine.viewRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
            editorCamera.transform.localToWorldMatrix = globalMatrix3D;
        }

        private onLookToSelectedGameObject()
        {
            var transformBox = editorData.transformBox;
            if (transformBox)
            {
                var scenePosition = transformBox.getCenter();
                var size = transformBox.getSize().length;
                size = Math.max(size, 1);
                var lookDistance = size;
                var lens = editorCamera.lens;
                if (lens instanceof feng3d.PerspectiveLens)
                {
                    lookDistance = size / Math.tan(lens.fov * Math.PI / 360);
                }
                //
                sceneControlConfig.lookDistance = lookDistance;
                var lookPos = editorCamera.transform.localToWorldMatrix.forward;
                lookPos.scale(-sceneControlConfig.lookDistance);
                lookPos.add(scenePosition);
                var localLookPos = lookPos.clone();
                if (editorCamera.transform.parent)
                {
                    editorCamera.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
                }
                egret.Tween.get(editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
            }
        }

        private onMouseWheelMoveSceneCamera()
        {
            var distance = feng3d.windowEventProxy.wheelDelta * sceneControlConfig.mouseWheelMoveStep * sceneControlConfig.lookDistance / 10;
            editorCamera.transform.localToWorldMatrix = editorCamera.transform.localToWorldMatrix.moveForward(distance);
            sceneControlConfig.lookDistance -= distance;
        }
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