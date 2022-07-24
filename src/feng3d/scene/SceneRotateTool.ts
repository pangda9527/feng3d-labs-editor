declare global
{
    export interface MixinsComponentMap
    {
        SceneRotateTool: editor.SceneRotateTool
    }
}

@feng3d.RegisterComponent()
export class SceneRotateTool extends feng3d.Component
{
    get view() { return this._view; }
    set view(v) { this._view = v; this.load(); }
    private _view: EditorView;

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
        if (!this.view) return;
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

        var { toolView: toolView, canvas } = this.newView();

        toolView.root.addChild(rotationToolModel);
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
            var rect = this.view.canvas.getBoundingClientRect();
            canvas.style.top = rect.top + "px";
            canvas.style.left = (rect.left + rect.width - canvas.width) + "px";

            var rotation = this.view.camera.transform.localToWorldMatrix.clone().invert().toTRS()[1];
            rotationToolModel.transform.rotation = rotation;

            //隐藏角度
            var visibleAngle = Math.cos(15 * feng3d.mathUtil.DEG2RAD);
            //隐藏正面箭头
            arrowsArr.forEach(element =>
            {
                if (Math.abs(element.transform.localToWorldMatrix.getAxisY().dot(feng3d.Vector3.Z_AXIS)) < visibleAngle)
                    element.activeSelf = true;
                else
                    element.activeSelf = false;
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

        feng3d.windowEventProxy.on("mouseup", (event) =>
        {
            const e = event.data;
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

    private newView()
    {
        var canvas = document.createElement("canvas");
        document.getElementById("SceneRotateToolLayer").appendChild(canvas);
        canvas.style.position = "absolute";
        canvas.width = 80;
        canvas.height = 80;
        // 
        var toolView = new feng3d.View(canvas);
        toolView.scene.background.a = 0.0;
        toolView.scene.ambientColor.setTo(0.2, 0.2, 0.2);
        toolView.root.addChild(feng3d.GameObject.createPrimitive("Point Light"));
        return { toolView: toolView, canvas };
    }

    private onclick(e: feng3d.IEvent<any>)
    {
        this.clickItem(e.currentTarget as any);
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
            var cameraTargetMatrix = feng3d.Matrix4x4.fromRotation(rotation.x, rotation.y, rotation.z);
            cameraTargetMatrix.invert();
            var result = cameraTargetMatrix.toTRS()[1];

            feng3d.globalEmitter.emit("editorCameraRotate", result);

            this.onEditorCameraRotate(result);
        }
    }

    private onEditorCameraRotate(resultRotation: feng3d.Vector3)
    {
        var camera = this.view.camera;
        var forward = camera.transform.matrix.getAxisZ();
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
        resultRotation.scaleNumber(feng3d.mathUtil.DEG2RAD);
        targetQuat.fromEuler(resultRotation.x, resultRotation.y, resultRotation.z);
        //
        var sourceQuat = new feng3d.Quaternion();
        sourceQuat.fromEuler(camera.transform.rx * feng3d.mathUtil.DEG2RAD, camera.transform.ry * feng3d.mathUtil.DEG2RAD, camera.transform.rz * feng3d.mathUtil.DEG2RAD)
        var rate = { rate: 0.0 };
        egret.Tween.get(rate, {
            onChange: () =>
            {
                var cameraQuat = sourceQuat.slerpTo(targetQuat, rate.rate);
                camera.transform.orientation = cameraQuat;
                //
                var translation = camera.transform.matrix.getAxisZ();
                translation.normalize(-lookDistance);
                camera.transform.position = rotateCenter.addTo(translation);
            },
        }).to({ rate: 1 }, 300, egret.Ease.sineIn);
    }

}
