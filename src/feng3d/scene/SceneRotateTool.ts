import { RegisterComponent, Component, GameObject, loader, serialization, ticker, mathUtil, Vector3, Rectangle, windowEventProxy, shortcut, View, IEvent, Matrix4x4, globalEmitter, Quaternion } from 'feng3d';
import { EditorData } from '../../global/EditorData';
import { sceneControlConfig } from '../../shortcut/Editorshortcut';
import { menu } from '../../ui/components/Menu';
import { EditorView } from '../EditorView';

declare global
{
    export interface MixinsComponentMap
    {
        SceneRotateTool: SceneRotateTool
    }
}

@RegisterComponent()
export class SceneRotateTool extends Component
{
    get view() { return this._view; }
    set view(v) { this._view = v; this.load(); }
    private _view: EditorView;

    private arrowsX: GameObject;
    private arrowsNX: GameObject;
    private arrowsY: GameObject;
    private arrowsNY: GameObject;
    private arrowsZ: GameObject;
    private arrowsNZ: GameObject;

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

        loader.loadText(EditorData.editorData.getEditorAssetPath("gameobjects/SceneRotateTool.gameobject.json"), (content) =>
        {
            var rotationToolModel: GameObject = serialization.deserialize(JSON.parse(content));
            this.onLoaded(rotationToolModel);
        });
    }

    private onLoaded(rotationToolModel: GameObject)
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

        ticker.onframe(() =>
        {
            var rect = this.view.canvas.getBoundingClientRect();
            canvas.style.top = rect.top + "px";
            canvas.style.left = (rect.left + rect.width - canvas.width) + "px";

            var rotation = this.view.camera.transform.localToWorldMatrix.clone().invert().toTRS()[1];
            rotationToolModel.transform.rotation = rotation;

            //隐藏角度
            var visibleAngle = Math.cos(15 * mathUtil.DEG2RAD);
            //隐藏正面箭头
            arrowsArr.forEach(element =>
            {
                if (Math.abs(element.transform.localToWorldMatrix.getAxisY().dot(Vector3.Z_AXIS)) < visibleAngle)
                    element.activeSelf = true;
                else
                    element.activeSelf = false;
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

        windowEventProxy.on("mouseup", (event) =>
        {
            const e = event.data;
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
        var toolView = new View(canvas);
        toolView.scene.background.a = 0.0;
        toolView.scene.ambientColor.setTo(0.2, 0.2, 0.2);
        toolView.root.addChild(GameObject.createPrimitive("Point Light"));
        return { toolView: toolView, canvas };
    }

    private onclick(e: IEvent<any>)
    {
        this.clickItem(e.currentTarget as any);
    }

    private clickItem(item: GameObject)
    {
        var front_view = new Vector3(0, 0, 0);//前视图
        var back_view = new Vector3(0, 180, 0);//后视图
        var right_view = new Vector3(0, 90, 0);//右视图
        var left_view = new Vector3(0, -90, 0);//左视图
        var top_view = new Vector3(-90, 0, 0);//顶视图
        var bottom_view = new Vector3(90, 0, 0);//底视图

        var rotation: Vector3;
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
            var cameraTargetMatrix = Matrix4x4.fromRotation(rotation.x, rotation.y, rotation.z);
            cameraTargetMatrix.invert();
            var result = cameraTargetMatrix.toTRS()[1];

            globalEmitter.emit("editorCameraRotate", result);

            this.onEditorCameraRotate(result);
        }
    }

    private onEditorCameraRotate(resultRotation: Vector3)
    {
        var camera = this.view.camera;
        var forward = camera.transform.matrix.getAxisZ();
        var lookDistance: number;
        if (EditorData.editorData.selectedGameObjects.length > 0)
        {
            //计算观察距离
            var selectedObj = EditorData.editorData.selectedGameObjects[0];
            var lookray = selectedObj.transform.worldPosition.subTo(camera.transform.worldPosition);
            lookDistance = Math.max(0, forward.dot(lookray));
        } else
        {
            lookDistance = sceneControlConfig.lookDistance;
        }
        //旋转中心
        var rotateCenter = camera.transform.worldPosition.addTo(forward.scaleNumber(lookDistance));
        //计算目标四元素旋转
        var targetQuat = new Quaternion();
        resultRotation.scaleNumber(mathUtil.DEG2RAD);
        targetQuat.fromEuler(resultRotation.x, resultRotation.y, resultRotation.z);
        //
        var sourceQuat = new Quaternion();
        sourceQuat.fromEuler(camera.transform.rx * mathUtil.DEG2RAD, camera.transform.ry * mathUtil.DEG2RAD, camera.transform.rz * mathUtil.DEG2RAD)
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
