namespace editor
{
    export class SceneRotateTool extends feng3d.Component
    {
        showInInspector = false;
        serializable = false;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            var thisObj = this;

            feng3d.Loader.loadText(editorData.getEditorAssetsPath("gameobjects/SceneRotateTool.gameobject.json"), (content) =>
            {
                var rotationToolModel = feng3d.serialization.deserialize(JSON.parse(content));
                this.onLoaded(rotationToolModel);
            });
        }

        private onLoaded(rotationToolModel: feng3d.GameObject)
        {
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

            var { toolEngine, canvas } = newEngine();

            toolEngine.root.addChild(rotationToolModel);
            rotationToolModel.transform.sx = 0.01
            rotationToolModel.transform.sy = 0.01
            rotationToolModel.transform.sz = 0.01
            rotationToolModel.transform.z = 0.80

            var arr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ];
            arr.forEach(element =>
            {
                element.on("click", onclick);
            });
            var arrowsArr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ];

            feng3d.ticker.onframe(() =>
            {
                var rect = engine.canvas.getBoundingClientRect();
                canvas.style.top = rect.top + "px";
                canvas.style.left = (rect.left + rect.width - canvas.width) + "px";

                var rotation = editorCamera.transform.localToWorldMatrix.clone().invert().decompose()[1].scale(180 / Math.PI);
                rotationToolModel.transform.rotation = rotation;

                //隐藏角度
                var visibleAngle = Math.cos(15 * feng3d.FMath.DEG2RAD);
                //隐藏正面箭头
                arrowsArr.forEach(element =>
                {
                    if (Math.abs(element.transform.localToWorldMatrix.up.dot(feng3d.Vector3.Z_AXIS)) < visibleAngle)
                        element.visible = true;
                    else
                        element.visible = false;
                });

                //
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
                {
                    feng3d.shortcut.activityState("mouseInSceneRotateTool");
                } else
                {
                    feng3d.shortcut.deactivityState("mouseInSceneRotateTool");
                }
            });

            feng3d.windowEventProxy.on("mouseup", (e) =>
            {
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (!bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
                    return;

                //右键点击菜单
                if (e.button == 2)
                {
                    menu.popup(
                        [
                            {
                                label: "左视图", click: () =>
                                {
                                    onclick({ type: "click", currentTarget: arrowsX, data: null });
                                }
                            },
                            {
                                label: "右视图", click: () =>
                                {
                                    onclick({ type: "click", currentTarget: arrowsNX, data: null });
                                }
                            },
                            {
                                label: "顶视图", click: () =>
                                {
                                    onclick({ type: "click", currentTarget: arrowsY, data: null });
                                }
                            },
                            {
                                label: "底视图", click: () =>
                                {
                                    onclick({ type: "click", currentTarget: arrowsNY, data: null });
                                }
                            },
                            {
                                label: "前视图", click: () =>
                                {
                                    onclick({ type: "click", currentTarget: arrowsZ, data: null });
                                }
                            },
                            {
                                label: "后视图", click: () =>
                                {
                                    onclick({ type: "click", currentTarget: arrowsNZ, data: null });
                                }
                            },
                        ]);
                }
            });

            function newEngine()
            {
                var canvas = <HTMLCanvasElement>document.getElementById("sceneRotateToolCanvas");;
                // can
                canvas.width = 80;
                canvas.height = 80;
                var toolEngine = new feng3d.Engine(canvas);
                toolEngine.scene.background.a = 0.0;
                toolEngine.root.addChild(feng3d.gameObjectFactory.createPointLight());
                return { toolEngine, canvas };
            }

            function onclick(e: feng3d.Event<any>)
            {
                var front_view = new feng3d.Vector3(0, 0, 0);//前视图
                var back_view = new feng3d.Vector3(0, 180, 0);//后视图
                var right_view = new feng3d.Vector3(0, -90, 0);//右视图
                var left_view = new feng3d.Vector3(0, 90, 0);//左视图
                var top_view = new feng3d.Vector3(-90, 0, 180);//顶视图
                var bottom_view = new feng3d.Vector3(-90, 180, 0);//底视图

                var rotation: feng3d.Vector3;
                switch (e.currentTarget)
                {
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
                if (rotation)
                {
                    var cameraTargetMatrix3D = feng3d.Matrix4x4.fromRotation(rotation);
                    cameraTargetMatrix3D.invert();
                    var result = cameraTargetMatrix3D.decompose()[1];
                    result.scale(180 / Math.PI);

                    editorDispatcher.dispatch("editorCameraRotate", result);
                }
            }
        }
    }
}