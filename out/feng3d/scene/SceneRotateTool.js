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
define(["require", "exports", "../../global/EditorData", "../Main3D", "../../ui/components/Menu"], function (require, exports, EditorData_1, Main3D_1, Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // namespace feng3d { export interface ComponentMap { SceneRotateTool: editor.SceneRotateTool } }
    var SceneRotateTool = /** @class */ (function (_super) {
        __extends(SceneRotateTool, _super);
        function SceneRotateTool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SceneRotateTool.prototype.init = function (gameObject) {
            var _this = this;
            _super.prototype.init.call(this, gameObject);
            var thisObj = this;
            feng3d.loader.loadText(EditorData_1.editorData.getEditorAssetPath("gameobjects/SceneRotateTool.gameobject.json"), function (content) {
                var rotationToolModel = feng3d.serialization.deserialize(JSON.parse(content));
                _this.onLoaded(rotationToolModel);
            });
        };
        SceneRotateTool.prototype.onLoaded = function (rotationToolModel) {
            var arrowsX = rotationToolModel.find("arrowsX");
            var arrowsY = rotationToolModel.find("arrowsY");
            var arrowsZ = rotationToolModel.find("arrowsZ");
            var arrowsNX = rotationToolModel.find("arrowsNX");
            var arrowsNY = rotationToolModel.find("arrowsNY");
            var arrowsNZ = rotationToolModel.find("arrowsNZ");
            var planeX = rotationToolModel.find("planeX");
            var planeY = rotationToolModel.find("planeY");
            var planeZ = rotationToolModel.find("planeZ");
            var planeNX = rotationToolModel.find("planeNX");
            var planeNY = rotationToolModel.find("planeNY");
            var planeNZ = rotationToolModel.find("planeNZ");
            var _a = newEngine(), toolEngine = _a.toolEngine, canvas = _a.canvas;
            toolEngine.root.addChild(rotationToolModel);
            rotationToolModel.transform.sx = 0.01;
            rotationToolModel.transform.sy = 0.01;
            rotationToolModel.transform.sz = 0.01;
            rotationToolModel.transform.z = 0.80;
            var arr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ];
            arr.forEach(function (element) {
                element.on("click", onclick);
            });
            var arrowsArr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ];
            feng3d.ticker.onframe(function () {
                var rect = Main3D_1.engine.canvas.getBoundingClientRect();
                canvas.style.top = rect.top + "px";
                canvas.style.left = (rect.left + rect.width - canvas.width) + "px";
                var rotation = Main3D_1.editorCamera.transform.localToWorldMatrix.clone().invert().decompose()[1].scaleNumber(180 / Math.PI);
                rotationToolModel.transform.rotation = rotation;
                //隐藏角度
                var visibleAngle = Math.cos(15 * feng3d.FMath.DEG2RAD);
                //隐藏正面箭头
                arrowsArr.forEach(function (element) {
                    if (Math.abs(element.transform.localToWorldMatrix.up.dot(feng3d.Vector3.Z_AXIS)) < visibleAngle)
                        element.visible = true;
                    else
                        element.visible = false;
                });
                //
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                    feng3d.shortcut.activityState("mouseInSceneRotateTool");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInSceneRotateTool");
                }
            });
            feng3d.windowEventProxy.on("mouseup", function (e) {
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (!bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
                    return;
                //右键点击菜单
                if (e.button == 2) {
                    Menu_1.menu.popup([
                        {
                            label: "左视图", click: function () {
                                clickItem(arrowsX);
                            }
                        },
                        {
                            label: "右视图", click: function () {
                                clickItem(arrowsNX);
                            }
                        },
                        {
                            label: "顶视图", click: function () {
                                clickItem(arrowsY);
                            }
                        },
                        {
                            label: "底视图", click: function () {
                                clickItem(arrowsNY);
                            }
                        },
                        {
                            label: "前视图", click: function () {
                                clickItem(arrowsZ);
                            }
                        },
                        {
                            label: "后视图", click: function () {
                                clickItem(arrowsNZ);
                            }
                        },
                    ]);
                }
            });
            function newEngine() {
                var canvas = document.getElementById("sceneRotateToolCanvas");
                ;
                // can
                canvas.width = 80;
                canvas.height = 80;
                var toolEngine = new feng3d.Engine(canvas);
                toolEngine.scene.background.a = 0.0;
                toolEngine.scene.ambientColor.setTo(0.2, 0.2, 0.2);
                toolEngine.root.addChild(feng3d.gameObjectFactory.createPointLight());
                return { toolEngine: toolEngine, canvas: canvas };
            }
            function onclick(e) {
                clickItem(e.currentTarget);
            }
            function clickItem(item) {
                var front_view = new feng3d.Vector3(0, 0, 0); //前视图
                var back_view = new feng3d.Vector3(0, 180, 0); //后视图
                var right_view = new feng3d.Vector3(0, -90, 0); //右视图
                var left_view = new feng3d.Vector3(0, 90, 0); //左视图
                var top_view = new feng3d.Vector3(-90, 0, 180); //顶视图
                var bottom_view = new feng3d.Vector3(-90, 180, 0); //底视图
                var rotation;
                switch (item) {
                    case arrowsX:
                        rotation = left_view;
                        break;
                    case arrowsNX:
                        rotation = right_view;
                        break;
                    case arrowsY:
                        rotation = top_view;
                        break;
                    case arrowsNY:
                        rotation = bottom_view;
                        break;
                    case arrowsZ:
                        rotation = back_view;
                        break;
                    case arrowsNZ:
                        rotation = front_view;
                        break;
                }
                if (rotation) {
                    var cameraTargetMatrix3D = feng3d.Matrix4x4.fromRotation(rotation.x, rotation.y, rotation.z);
                    cameraTargetMatrix3D.invert();
                    var result = cameraTargetMatrix3D.decompose()[1];
                    result.scaleNumber(180 / Math.PI);
                    feng3d.dispatcher.dispatch("editorCameraRotate", result);
                }
            }
        };
        return SceneRotateTool;
    }(feng3d.Component));
    exports.SceneRotateTool = SceneRotateTool;
});
//# sourceMappingURL=SceneRotateTool.js.map