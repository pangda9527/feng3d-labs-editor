namespace feng3d.editor
{
    export class SceneRotateTool extends Component
    {
        showInInspector = false;
        serializable = false;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var thisObj = this;

            var { rotationToolModel, arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ } = initModel();

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

            ticker.onframe(() =>
            {
                var rect = engine.canvas.getBoundingClientRect();
                canvas.style.top = rect.top + "px";
                canvas.style.left = (rect.left + rect.width - canvas.width) + "px";

                var rotation = editorCamera.transform.localToWorldMatrix.clone().invert().decompose()[1].scale(180 / Math.PI);
                rotationToolModel.transform.rotation = rotation;

                //隐藏角度
                var visibleAngle = Math.cos(15 * FMath.DEG2RAD);
                //隐藏正面箭头
                arrowsArr.forEach(element =>
                {
                    if (Math.abs(element.transform.localToWorldMatrix.up.dot(Vector3.Z_AXIS)) < visibleAngle)
                        element.visible = true;
                    else
                        element.visible = false;
                });

                //
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (bound.contains(windowEventProxy.clientX, windowEventProxy.clientY))
                {
                    shortcut.activityState("mouseInSceneRotateTool");
                } else
                {
                    shortcut.deactivityState("mouseInSceneRotateTool");
                }
            });

            windowEventProxy.on("mouseup", (e) =>
            {
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (!bound.contains(windowEventProxy.clientX, windowEventProxy.clientY))
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

            function initModel()
            {
                var rotationToolModel = rawData.create(<any>rotateToolModelJson);
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
                return { rotationToolModel, arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ };
            }

            function newEngine()
            {
                var canvas = <HTMLCanvasElement>document.getElementById("sceneRotateToolCanvas");;
                // can
                canvas.width = 80;
                canvas.height = 80;
                var toolEngine = new Engine(canvas);
                toolEngine.scene.background.a = 0.0;
                toolEngine.root.addChild(GameObjectFactory.createPointLight());
                return { toolEngine, canvas };
            }

            function onclick(e: Event<any>)
            {
                var front_view = new Vector3(0, 0, 0);//前视图
                var back_view = new Vector3(0, 180, 0);//后视图
                var right_view = new Vector3(0, -90, 0);//右视图
                var left_view = new Vector3(0, 90, 0);//左视图
                var top_view = new Vector3(-90, 0, 180);//顶视图
                var bottom_view = new Vector3(-90, 180, 0);//底视图

                var rotation: Vector3;
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
                    var cameraTargetMatrix3D = Matrix4x4.fromRotation(rotation);
                    cameraTargetMatrix3D.invert();
                    var result = cameraTargetMatrix3D.decompose()[1];
                    result.scale(180 / Math.PI);

                    editorDispatcher.dispatch("editorCameraRotate", result);
                }
            }
        }
    }

    /**
     * 旋转工具模型，该模型由editor生成 RotationToolModel.gameobject
     */
    var rotateToolModelJson = {
        "__class__": "feng3d.GameObject",
        "name": "RotationToolModel",
        "children": [
            {
                "__class__": "feng3d.GameObject",
                "name": "arrowsX",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "x": 19,
                        "rz": 90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomRadius": 7,
                            "height": 21
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "u_diffuse": {
                                    "g": 0,
                                    "b": 0
                                }
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "arrowsNX",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "x": -19,
                        "rz": -90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomRadius": 7,
                            "height": 21
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "arrowsY",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "y": 19,
                        "rz": 180
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomRadius": 7,
                            "height": 21
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "u_diffuse": {
                                    "r": 0,
                                    "b": 0
                                }
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "arrowsNY",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "y": -19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomRadius": 7,
                            "height": 21
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "arrowsZ",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "z": 19,
                        "rx": -90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomRadius": 7,
                            "height": 21
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "u_diffuse": {
                                    "r": 0,
                                    "g": 0
                                }
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "arrowsNZ",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "z": -19,
                        "rx": 90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomRadius": 7,
                            "height": 21
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "planeX",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "x": 7,
                        "rz": -90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "width": 14,
                            "height": 14
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "planeNX",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "x": -7,
                        "rz": 90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "width": 14,
                            "height": 14
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "planeY",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "y": 7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "width": 14,
                            "height": 14
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "planeNY",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "y": -7,
                        "rz": 180
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "width": 14,
                            "height": 14
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "planeZ",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "z": 7,
                        "rx": 90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "width": 14,
                            "height": 14
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            },
            {
                "__class__": "feng3d.GameObject",
                "name": "planeNZ",
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "z": -7,
                        "rx": -90
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "width": 14,
                            "height": 14
                        },
                        "material": {
                            "__class__": "feng3d.Material",
                            "shaderName": "standard",
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms"
                            }
                        }
                    }]
            }],
        "components": [
            null,
            {
                "__class__": "feng3d.Transform"
            },
            null]
    };
}