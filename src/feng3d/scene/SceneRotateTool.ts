namespace feng3d { export interface ComponentMap { SceneRotateTool: editor.SceneRotateTool } }

namespace editor
{
    export class SceneRotateTool extends feng3d.Component
    {
        get engine() { return this._engine; }
        set engine(v) { this._engine = v; this.load(); }
        private _engine: EditorEngine;

        private arrowsX: feng3d.GameObject;
        private arrowsNX: feng3d.GameObject;
        private arrowsY: feng3d.GameObject;
        private arrowsNY: feng3d.GameObject;
        private arrowsZ: feng3d.GameObject;
        private arrowsNZ: feng3d.GameObject;

        init()
        {
            super.init();

            this.load();
        }

        private isload = false;

        private load()
        {
            if (!this.engine) return;
            if (this.isload) return;
            this.isload = true;

            feng3d.loader.loadText(editorData.getEditorAssetPath("gameobjects/SceneRotateTool.gameobject.json"), (content) =>
            {
                var rotationToolModel: feng3d.GameObject = feng3d.serialization.deserialize(JSON.parse(content));
                this.onLoaded(rotationToolModel);
            });
        }

        private onLoaded(rotationToolModel: feng3d.GameObject)
        {
            var arrowsX = this.arrowsX = rotationToolModel.find("arrowsX");
            var arrowsY = this.arrowsY = rotationToolModel.find("arrowsY");
            var arrowsZ = this.arrowsZ = rotationToolModel.find("arrowsZ");
            var arrowsNX = this.arrowsNX = rotationToolModel.find("arrowsNX");
            var arrowsNY = this.arrowsNY = rotationToolModel.find("arrowsNY");
            var arrowsNZ = this.arrowsNZ = rotationToolModel.find("arrowsNZ");
            var planeX = rotationToolModel.find("planeX");
            var planeY = rotationToolModel.find("planeY");
            var planeZ = rotationToolModel.find("planeZ");
            var planeNX = rotationToolModel.find("planeNX");
            var planeNY = rotationToolModel.find("planeNY");
            var planeNZ = rotationToolModel.find("planeNZ");

            var { toolEngine, canvas } = this.newEngine();

            toolEngine.root.addChild(rotationToolModel);
            rotationToolModel.transform.sx = 0.01
            rotationToolModel.transform.sy = 0.01
            rotationToolModel.transform.sz = 0.01
            rotationToolModel.transform.z = 0.80

            var arr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ];
            arr.forEach(element =>
            {
                element.on("click", this.onclick, this);
            });
            var arrowsArr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ];

            feng3d.ticker.onframe(() =>
            {
                var rect = this.engine.canvas.getBoundingClientRect();
                canvas.style.top = rect.top + "px";
                canvas.style.left = (rect.left + rect.width - canvas.width) + "px";

                var rotation = this.engine.camera.transform.localToWorldMatrix.clone().invert().decompose()[1];
                rotationToolModel.transform.rotation = rotation;

                //隐藏角度
                var visibleAngle = Math.cos(15 * Math.DEG2RAD);
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
                                label: "右视图", click: () =>
                                {
                                    this.clickItem(arrowsX);
                                }
                            },
                            {
                                label: "顶视图", click: () =>
                                {
                                    this.clickItem(arrowsY);
                                }
                            },
                            {
                                label: "前视图", click: () =>
                                {
                                    this.clickItem(arrowsZ);
                                }
                            },
                            {
                                label: "左视图", click: () =>
                                {
                                    this.clickItem(arrowsNX);
                                }
                            },
                            {
                                label: "底视图", click: () =>
                                {
                                    this.clickItem(arrowsNY);
                                }
                            },
                            {
                                label: "后视图", click: () =>
                                {
                                    this.clickItem(arrowsNZ);
                                }
                            },
                        ]);
                }
            });

        }

        private newEngine()
        {
            var canvas = document.createElement("canvas");
            (<any>document.getElementById("SceneRotateToolLayer")).append(canvas);
            canvas.style.position = "absolute";
            canvas.width = 80;
            canvas.height = 80;
            // 
            var toolEngine = new feng3d.Engine(canvas);
            toolEngine.scene.background.a = 0.0;
            toolEngine.scene.ambientColor.setTo(0.2, 0.2, 0.2);
            toolEngine.root.addChild(feng3d.GameObject.createPrimitive("Point light"));
            return { toolEngine, canvas };
        }

        private onclick(e: feng3d.Event<any>)
        {
            this.clickItem(e.currentTarget);
        }

        private clickItem(item: feng3d.GameObject)
        {
            var front_view = new feng3d.Vector3(0, 0, 0);//前视图
            var back_view = new feng3d.Vector3(0, 180, 0);//后视图
            var right_view = new feng3d.Vector3(0, 90, 0);//右视图
            var left_view = new feng3d.Vector3(0, -90, 0);//左视图
            var top_view = new feng3d.Vector3(-90, 0, 0);//顶视图
            var bottom_view = new feng3d.Vector3(90, 0, 0);//底视图

            var rotation: feng3d.Vector3;
            switch (item)
            {
                case this.arrowsX:
                    rotation = right_view;
                    break;
                case this.arrowsNX:
                    rotation = left_view;
                    break;
                case this.arrowsY:
                    rotation = top_view;
                    break;
                case this.arrowsNY:
                    rotation = bottom_view;
                    break;
                case this.arrowsZ:
                    rotation = back_view;
                    break;
                case this.arrowsNZ:
                    rotation = front_view;
                    break;
            }
            if (rotation)
            {
                var cameraTargetMatrix3D = feng3d.Matrix4x4.fromRotation(rotation.x, rotation.y, rotation.z);
                cameraTargetMatrix3D.invert();
                var result = cameraTargetMatrix3D.decompose()[1];

                feng3d.globalDispatcher.dispatch("editorCameraRotate", result);

                this.onEditorCameraRotate(result);
            }
        }

        private onEditorCameraRotate(resultRotation: feng3d.Vector3)
        {
            var camera = this.engine.camera;
            var forward = camera.transform.forwardVector;
            var lookDistance: number;
            if (editorData.selectedGameObjects.length > 0)
            {
                //计算观察距离
                var selectedObj = editorData.selectedGameObjects[0];
                var lookray = selectedObj.transform.worldPosition.subTo(camera.transform.worldPosition);
                lookDistance = Math.max(0, forward.dot(lookray));
            } else
            {
                lookDistance = sceneControlConfig.lookDistance;
            }
            //旋转中心
            var rotateCenter = camera.transform.worldPosition.addTo(forward.scaleNumber(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new feng3d.Quaternion();
            resultRotation.scaleNumber(Math.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new feng3d.Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * Math.DEG2RAD, camera.transform.ry * Math.DEG2RAD, camera.transform.rz * Math.DEG2RAD)
            var rate = { rate: 0.0 };
            egret.Tween.get(rate, {
                onChange: () =>
                {
                    var cameraQuat = sourceQuat.slerpTo(targetQuat, rate.rate);
                    camera.transform.orientation = cameraQuat;
                    //
                    var translation = camera.transform.forwardVector;
                    translation.negate();
                    translation.scaleNumber(lookDistance);
                    camera.transform.position = rotateCenter.addTo(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        }

    }
}