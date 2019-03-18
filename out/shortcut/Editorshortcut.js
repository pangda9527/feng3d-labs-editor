"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var editorui_1 = require("../global/editorui");
var Editorshortcut = /** @class */ (function () {
    function Editorshortcut() {
        this.selectedObjectsHistory = [];
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
        //
        feng3d.shortcut.on("openDevTools", this.onOpenDevTools, this);
        feng3d.shortcut.on("refreshWindow", this.onRefreshWindow, this);
    }
    Editorshortcut.prototype.onAreaSelectStart = function () {
        this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
    };
    Editorshortcut.prototype.onAreaSelect = function () {
        var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var lt = editorui_1.editorui.feng3dView.localToGlobal(0, 0);
        var rb = editorui_1.editorui.feng3dView.localToGlobal(editorui_1.editorui.feng3dView.width, editorui_1.editorui.feng3dView.height);
        var rectangle = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
        //
        areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
        //
        areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
        //
        var gs = engine.getObjectsInGlobalArea(this.areaSelectStartPosition, areaSelectEndPosition);
        var gs0 = gs.filter(function (g) {
            return !!hierarchy.getNode(g);
        });
        editorData.selectMultiObject(gs0);
    };
    Editorshortcut.prototype.onAreaSelectEnd = function () {
        areaSelectRect.hide();
    };
    Editorshortcut.prototype.onGameobjectMoveTool = function () {
        editorData.toolType = MRSToolType.MOVE;
    };
    Editorshortcut.prototype.onGameobjectRotationTool = function () {
        editorData.toolType = MRSToolType.ROTATION;
    };
    Editorshortcut.prototype.onGameobjectScaleTool = function () {
        editorData.toolType = MRSToolType.SCALE;
    };
    Editorshortcut.prototype.onSceneCameraForwardBackMouseMoveStart = function () {
        this.preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
    };
    Editorshortcut.prototype.onSceneCameraForwardBackMouseMove = function () {
        var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var moveDistance = (currentMousePoint.x + currentMousePoint.y - this.preMousePoint.x - this.preMousePoint.y) * exports.sceneControlConfig.sceneCameraForwardBackwardStep;
        exports.sceneControlConfig.lookDistance -= moveDistance;
        var forward = editorCamera.transform.localToWorldMatrix.forward;
        var camerascenePosition = editorCamera.transform.scenePosition;
        var newCamerascenePosition = new feng3d.Vector3(forward.x * moveDistance + camerascenePosition.x, forward.y * moveDistance + camerascenePosition.y, forward.z * moveDistance + camerascenePosition.z);
        var newCameraPosition = editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
        editorCamera.transform.position = newCameraPosition;
        this.preMousePoint = currentMousePoint;
    };
    Editorshortcut.prototype.onSelectGameObject = function () {
        var gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), editorScene.mouseCheckObjects).sort(function (a, b) { return a.rayEntryDistance - b.rayEntryDistance; }).map(function (v) { return v.gameObject; });
        if (gameObjects.length > 0)
            return;
        //
        gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), engine.scene.mouseCheckObjects).sort(function (a, b) { return a.rayEntryDistance - b.rayEntryDistance; }).map(function (v) { return v.gameObject; });
        if (gameObjects.length == 0) {
            editorData.clearSelectedObjects();
            return;
        }
        //
        gameObjects = gameObjects.reduce(function (pv, gameObject) {
            var node = hierarchy.getNode(gameObject);
            while (!node && gameObject.parent) {
                gameObject = gameObject.parent;
                node = hierarchy.getNode(gameObject);
            }
            if (gameObject != gameObject.scene.gameObject) {
                pv.push(gameObject);
            }
            return pv;
        }, []);
        //
        if (gameObjects.length > 0) {
            var selectedObjectsHistory = this.selectedObjectsHistory;
            var gameObject = gameObjects.reduce(function (pv, cv) {
                if (pv)
                    return pv;
                if (selectedObjectsHistory.indexOf(cv) == -1)
                    pv = cv;
                return pv;
            }, null);
            if (!gameObject) {
                selectedObjectsHistory.length = 0;
                gameObject = gameObjects[0];
            }
            editorData.selectObject(gameObject);
            selectedObjectsHistory.push(gameObject);
        }
        else {
            editorData.clearSelectedObjects();
        }
    };
    Editorshortcut.prototype.onDeleteSeletedGameObject = function () {
        var selectedObject = editorData.selectedObjects;
        if (!selectedObject)
            return;
        //删除文件引用计数
        selectedObject.forEach(function (element) {
            if (element instanceof feng3d.GameObject) {
                element.remove();
            }
            else if (element instanceof AssetNode) {
                element.delete();
            }
        });
        editorData.clearSelectedObjects();
    };
    Editorshortcut.prototype.onDragSceneStart = function () {
        this.dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        this.dragSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
    };
    Editorshortcut.prototype.onDragScene = function () {
        var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var addPoint = mousePoint.subTo(this.dragSceneMousePoint);
        var scale = editorCamera.getScaleByDepth(exports.sceneControlConfig.lookDistance);
        var up = this.dragSceneCameraGlobalMatrix3D.up;
        var right = this.dragSceneCameraGlobalMatrix3D.right;
        up.scaleNumber(addPoint.y * scale);
        right.scaleNumber(-addPoint.x * scale);
        var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
        globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
        editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    };
    Editorshortcut.prototype.onFpsViewStart = function () {
        var fpsController = editorCamera.getComponent(feng3d.FPSController);
        fpsController.onMousedown();
        feng3d.ticker.onframe(this.updateFpsView);
    };
    Editorshortcut.prototype.onFpsViewStop = function () {
        var fpsController = editorCamera.getComponent(feng3d.FPSController);
        fpsController.onMouseup();
        feng3d.ticker.offframe(this.updateFpsView);
    };
    Editorshortcut.prototype.updateFpsView = function () {
        var fpsController = editorCamera.getComponent(feng3d.FPSController);
        fpsController.update();
    };
    Editorshortcut.prototype.onMouseRotateSceneStart = function () {
        this.rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        this.rotateSceneCameraGlobalMatrix3D = editorCamera.transform.localToWorldMatrix.clone();
        this.rotateSceneCenter = null;
        //获取第一个 游戏对象
        var transformBox = editorData.transformBox;
        if (transformBox) {
            this.rotateSceneCenter = transformBox.getCenter();
        }
        else {
            this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
            this.rotateSceneCenter.scaleNumber(exports.sceneControlConfig.lookDistance);
            this.rotateSceneCenter = this.rotateSceneCenter.addTo(this.rotateSceneCameraGlobalMatrix3D.position);
        }
    };
    Editorshortcut.prototype.onMouseRotateScene = function () {
        var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
        var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var view3DRect = engine.viewRect;
        var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
        var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
        globalMatrix3D.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, this.rotateSceneCenter);
        var rotateAxisX = globalMatrix3D.right;
        globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
        editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    };
    Editorshortcut.prototype.onLookToSelectedGameObject = function () {
        var transformBox = editorData.transformBox;
        if (transformBox) {
            var scenePosition = transformBox.getCenter();
            var size = transformBox.getSize().length;
            size = Math.max(size, 1);
            var lookDistance = size;
            var lens = editorCamera.lens;
            if (lens instanceof feng3d.PerspectiveLens) {
                lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
            }
            //
            exports.sceneControlConfig.lookDistance = lookDistance;
            var lookPos = editorCamera.transform.localToWorldMatrix.forward;
            lookPos.scaleNumber(-lookDistance);
            lookPos.add(scenePosition);
            var localLookPos = lookPos.clone();
            if (editorCamera.transform.parent) {
                localLookPos = editorCamera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
            }
            egret.Tween.get(editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
        }
    };
    Editorshortcut.prototype.onMouseWheelMoveSceneCamera = function () {
        var distance = -feng3d.windowEventProxy.deltaY * exports.sceneControlConfig.mouseWheelMoveStep * exports.sceneControlConfig.lookDistance / 10;
        editorCamera.transform.localToWorldMatrix = editorCamera.transform.localToWorldMatrix.moveForward(distance);
        exports.sceneControlConfig.lookDistance -= distance;
    };
    Editorshortcut.prototype.onOpenDevTools = function () {
        if (nativeAPI)
            nativeAPI.openDevTools();
    };
    Editorshortcut.prototype.onRefreshWindow = function () {
        window.location.reload();
    };
    return Editorshortcut;
}());
exports.Editorshortcut = Editorshortcut;
var SceneControlConfig = /** @class */ (function () {
    function SceneControlConfig() {
        this.mouseWheelMoveStep = 0.004;
        //dynamic
        this.lookDistance = 3;
        this.sceneCameraForwardBackwardStep = 0.01;
    }
    return SceneControlConfig;
}());
exports.SceneControlConfig = SceneControlConfig;
exports.sceneControlConfig = new SceneControlConfig();
//# sourceMappingURL=Editorshortcut.js.map