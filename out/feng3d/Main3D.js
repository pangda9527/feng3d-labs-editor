"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EditorComponent_1 = require("./EditorComponent");
var Hierarchy_1 = require("./hierarchy/Hierarchy");
var EditorEngine = /** @class */ (function (_super) {
    __extends(EditorEngine, _super);
    function EditorEngine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wireframeColor = new feng3d.Color4(125 / 255, 176 / 255, 250 / 255);
        return _this;
    }
    Object.defineProperty(EditorEngine.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        set: function (value) {
            if (this._scene) {
                this._scene.runEnvironment = feng3d.RunEnvironment.feng3d;
            }
            this._scene = value;
            if (this._scene) {
                this._scene.runEnvironment = feng3d.RunEnvironment.editor;
                Hierarchy_1.hierarchy.rootGameObject = this._scene.gameObject;
            }
            exports.editorComponent.scene = this._scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorEngine.prototype, "camera", {
        get: function () {
            return exports.editorCamera;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 绘制场景
     */
    EditorEngine.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this);
        exports.editorScene.update();
        feng3d.forwardRenderer.draw(this.gl, exports.editorScene, this.camera);
        var selectedObject = this.mouse3DManager.pick(exports.editorScene, this.camera);
        if (selectedObject)
            this.selectedObject = selectedObject;
        editorData.selectedGameObjects.forEach(function (element) {
            if (element.getComponent(feng3d.Model) && !element.getComponent(feng3d.ParticleSystem))
                feng3d.wireframeRenderer.drawGameObject(_this.gl, element, _this.scene, _this.camera, _this.wireframeColor);
        });
    };
    return EditorEngine;
}(feng3d.Engine));
exports.EditorEngine = EditorEngine;
/**
* 编辑器3D入口
*/
var Main3D = /** @class */ (function () {
    function Main3D() {
        this.init();
    }
    Main3D.prototype.init = function () {
        //
        exports.editorCamera = Object.setValue(new feng3d.GameObject(), { name: "editorCamera" }).addComponent(feng3d.Camera);
        exports.editorCamera.lens.far = 5000;
        exports.editorCamera.transform.x = 5;
        exports.editorCamera.transform.y = 3;
        exports.editorCamera.transform.z = 5;
        exports.editorCamera.transform.lookAt(new feng3d.Vector3());
        //
        exports.editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
        //
        exports.editorScene = Object.setValue(new feng3d.GameObject(), { name: "scene" }).addComponent(feng3d.Scene3D);
        exports.editorScene.runEnvironment = feng3d.RunEnvironment.all;
        //
        exports.editorScene.gameObject.addComponent(SceneRotateTool);
        //
        //初始化模块
        exports.editorScene.gameObject.addComponent(GroundGrid);
        exports.editorScene.gameObject.addComponent(MRSTool);
        exports.editorComponent = exports.editorScene.gameObject.addComponent(EditorComponent_1.EditorComponent);
        feng3d.loader.loadText(editorData.getEditorAssetPath("gameobjects/Trident.gameobject.json"), function (content) {
            var trident = feng3d.serialization.deserialize(JSON.parse(content));
            exports.editorScene.gameObject.addChild(trident);
        });
        //
        feng3d.dispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
        //
        var canvas = document.getElementById("glcanvas");
        exports.engine = new EditorEngine(canvas, null, exports.editorCamera);
        //
        editorAsset.runProjectScript(function () {
            editorAsset.readScene("default.scene.json", function (err, scene) {
                if (err)
                    exports.engine.scene = creatNewScene();
                else
                    exports.engine.scene = scene;
            });
        });
        window.addEventListener("beforeunload", function () {
            editorRS.fs.writeObject("default.scene.json", exports.engine.scene.gameObject);
        });
    };
    Main3D.prototype.onEditorCameraRotate = function (e) {
        var resultRotation = e.data;
        var camera = exports.editorCamera;
        var forward = camera.transform.forwardVector;
        var lookDistance;
        if (editorData.selectedGameObjects.length > 0) {
            //计算观察距离
            var selectedObj = editorData.selectedGameObjects[0];
            var lookray = selectedObj.transform.scenePosition.subTo(camera.transform.scenePosition);
            lookDistance = Math.max(0, forward.dot(lookray));
        }
        else {
            lookDistance = sceneControlConfig.lookDistance;
        }
        //旋转中心
        var rotateCenter = camera.transform.scenePosition.addTo(forward.scaleNumber(lookDistance));
        //计算目标四元素旋转
        var targetQuat = new feng3d.Quaternion();
        resultRotation.scaleNumber(feng3d.FMath.DEG2RAD);
        targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
        //
        var sourceQuat = new feng3d.Quaternion();
        sourceQuat.fromEulerAngles(camera.transform.rx * feng3d.FMath.DEG2RAD, camera.transform.ry * feng3d.FMath.DEG2RAD, camera.transform.rz * feng3d.FMath.DEG2RAD);
        var rate = { rate: 0.0 };
        egret.Tween.get(rate, {
            onChange: function () {
                var cameraQuat = new feng3d.Quaternion();
                cameraQuat.slerp(sourceQuat, targetQuat, rate.rate);
                camera.transform.orientation = cameraQuat;
                //
                var translation = camera.transform.forwardVector;
                translation.negate();
                translation.scaleNumber(lookDistance);
                camera.transform.position = rotateCenter.addTo(translation);
            },
        }).to({ rate: 1 }, 300, egret.Ease.sineIn);
    };
    return Main3D;
}());
exports.Main3D = Main3D;
function creatNewScene() {
    var scene = Object.setValue(new feng3d.GameObject(), { name: "Untitled" }).addComponent(feng3d.Scene3D);
    scene.background.setTo(0.408, 0.38, 0.357);
    scene.ambientColor.setTo(0.4, 0.4, 0.4);
    var camera = feng3d.gameObjectFactory.createCamera("Main Camera");
    camera.addComponent(feng3d.AudioListener);
    camera.transform.position = new feng3d.Vector3(0, 1, -10);
    scene.gameObject.addChild(camera);
    var directionalLight = Object.setValue(new feng3d.GameObject(), { name: "DirectionalLight" });
    directionalLight.addComponent(feng3d.DirectionalLight).shadowType = feng3d.ShadowType.Hard_Shadows;
    directionalLight.transform.rx = 50;
    directionalLight.transform.ry = -30;
    directionalLight.transform.y = 3;
    scene.gameObject.addChild(directionalLight);
    return scene;
}
exports.creatNewScene = creatNewScene;
//# sourceMappingURL=Main3D.js.map