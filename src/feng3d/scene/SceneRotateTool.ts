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
        "children": [
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rz": 90,
                        "x": 19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomClosed": true,
                            "bottomRadius": 7,
                            "height": 21,
                            "segmentsH": 1,
                            "segmentsW": 16,
                            "surfaceClosed": true,
                            "topClosed": false,
                            "topRadius": 0,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4",
                                    "b": 0,
                                    "g": 0
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "arrowsX",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rz": -90,
                        "x": -19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomClosed": true,
                            "bottomRadius": 7,
                            "height": 21,
                            "segmentsH": 1,
                            "segmentsW": 16,
                            "surfaceClosed": true,
                            "topClosed": false,
                            "topRadius": 0,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "arrowsNX",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rz": 180,
                        "y": 19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomClosed": true,
                            "bottomRadius": 7,
                            "height": 21,
                            "segmentsH": 1,
                            "segmentsW": 16,
                            "surfaceClosed": true,
                            "topClosed": false,
                            "topRadius": 0,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4",
                                    "b": 0,
                                    "r": 0
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "arrowsY",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "y": -19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomClosed": true,
                            "bottomRadius": 7,
                            "height": 21,
                            "segmentsH": 1,
                            "segmentsW": 16,
                            "surfaceClosed": true,
                            "topClosed": false,
                            "topRadius": 0,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "arrowsNY",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rx": -90,
                        "z": 19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomClosed": true,
                            "bottomRadius": 7,
                            "height": 21,
                            "segmentsH": 1,
                            "segmentsW": 16,
                            "surfaceClosed": true,
                            "topClosed": false,
                            "topRadius": 0,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4",
                                    "g": 0.058823529411764705,
                                    "r": 0
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "arrowsZ",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rx": 90,
                        "z": -19
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.ConeGeometry",
                            "bottomClosed": true,
                            "bottomRadius": 7,
                            "height": 21,
                            "segmentsH": 1,
                            "segmentsW": 16,
                            "surfaceClosed": true,
                            "topClosed": false,
                            "topRadius": 0,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "arrowsNZ",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rz": -90,
                        "x": 7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "height": 14,
                            "segmentsH": 1,
                            "segmentsW": 1,
                            "width": 14,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "planeX",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rz": 90,
                        "x": -7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "height": 14,
                            "segmentsH": 1,
                            "segmentsW": 1,
                            "width": 14,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "planeNX",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "y": 7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "height": 14,
                            "segmentsH": 1,
                            "segmentsW": 1,
                            "width": 14,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "planeY",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rz": 180,
                        "y": -7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "height": 14,
                            "segmentsH": 1,
                            "segmentsW": 1,
                            "width": 14,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "planeNY",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rx": 90,
                        "z": 7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "height": 14,
                            "segmentsH": 1,
                            "segmentsW": 1,
                            "width": 14,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "planeZ",
                "navigationArea": -1
            },
            {
                "__class__": "feng3d.GameObject",
                "children": [],
                "components": [
                    null,
                    {
                        "__class__": "feng3d.Transform",
                        "rx": -90,
                        "z": -7
                    },
                    {
                        "__class__": "feng3d.MeshRenderer",
                        "enabled": true,
                        "geometry": {
                            "__class__": "feng3d.PlaneGeometry",
                            "height": 14,
                            "segmentsH": 1,
                            "segmentsW": 1,
                            "width": 14,
                            "yUp": true
                        },
                        "material": {
                            "__class__": "feng3d.StandardMaterial",
                            "fogMethod": {
                                "__class__": "feng3d.FogMethod",
                                "density": 0.1,
                                "enable": false,
                                "fogColor": {
                                    "__class__": "feng3d.Color3"
                                },
                                "maxDistance": 100,
                                "minDistance": 0,
                                "mode": 3
                            },
                            "renderParams": {
                                "__class__": "feng3d.RenderParams"
                            },
                            "terrainMethod": {
                                "__class__": "feng3d.TerrainMethod"
                            },
                            "uniforms": {
                                "__class__": "feng3d.StandardUniforms",
                                "s_ambient": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_diffuse": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_envMap": {
                                    "__class__": "feng3d.TextureCube"
                                },
                                "s_normal": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "s_specular": {
                                    "__class__": "feng3d.Texture2D"
                                },
                                "u_ambient": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_diffuse": {
                                    "__class__": "feng3d.Color4"
                                },
                                "u_reflectivity": 1,
                                "u_specular": {
                                    "__class__": "feng3d.Color3"
                                }
                            }
                        }
                    }],
                "name": "planeNZ",
                "navigationArea": -1
            }],
        "components": [
            null,
            {
                "__class__": "feng3d.Transform"
            },
            null],
        "name": "RotationToolModel",
        "navigationArea": -1
    };
}