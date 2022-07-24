declare global
{
    export interface MixinsComponentMap { MTool: editor.MTool }
}

export interface MTool
{
    get toolModel(): MToolModel;
    set toolModel(v: MToolModel);
}

/**
 * 位移工具
 */
@feng3d.RegisterComponent()
export class MTool extends MRSToolBase
{
    /**
     * 用于判断是否改变了XYZ
     */
    private changeXYZ = new feng3d.Vector3();
    private startPlanePos: feng3d.Vector3;
    private startPos: feng3d.Vector3;

    init()
    {
        super.init();

        this.toolModel = new feng3d.GameObject().addComponent(MToolModel);
    }

    protected onAddedToScene()
    {
        super.onAddedToScene();
        this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.yzPlane.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.xzPlane.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.xyPlane.on("mousedown", this.onItemMouseDown, this);
        this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
    }

    protected onRemovedFromScene()
    {
        super.onRemovedFromScene();
        this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.yzPlane.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.xzPlane.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.xyPlane.off("mousedown", this.onItemMouseDown, this);
        this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
    }

    protected onItemMouseDown(event: feng3d.IEvent<any>)
    {
        if (!feng3d.shortcut.getState("mouseInView3D")) return;

        if (feng3d.shortcut.keyState.getKeyState("alt"))
            return;
        if (!this.editorCamera) return;

        super.onItemMouseDown(event);
        //全局矩阵
        var globalMatrix = this.transform.localToWorldMatrix;
        //中心与X,Y,Z轴上点坐标
        var po = globalMatrix.transformPoint3(new feng3d.Vector3(0, 0, 0));
        var px = globalMatrix.transformPoint3(new feng3d.Vector3(1, 0, 0));
        var py = globalMatrix.transformPoint3(new feng3d.Vector3(0, 1, 0));
        var pz = globalMatrix.transformPoint3(new feng3d.Vector3(0, 0, 1));
        //
        var ox = px.subTo(po);
        var oy = py.subTo(po);
        var oz = pz.subTo(po);
        //摄像机前方方向
        var cameraSceneTransform = this.editorCamera.transform.localToWorldMatrix;
        var cameraDir = cameraSceneTransform.getAxisZ();
        this.movePlane3D = new feng3d.Plane();
        //
        switch (event.currentTarget)
        {
            case this.toolModel.xAxis:
                this.selectedItem = this.toolModel.xAxis;
                this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                this.changeXYZ.set(1, 0, 0);
                break;
            case this.toolModel.yAxis:
                this.selectedItem = this.toolModel.yAxis;
                this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                this.changeXYZ.set(0, 1, 0);
                break;
            case this.toolModel.zAxis:
                this.selectedItem = this.toolModel.zAxis;
                this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                this.changeXYZ.set(0, 0, 1);
                break;
            case this.toolModel.yzPlane:
                this.selectedItem = this.toolModel.yzPlane;
                this.movePlane3D.fromPoints(po, py, pz);
                this.changeXYZ.set(0, 1, 1);
                break;
            case this.toolModel.xzPlane:
                this.selectedItem = this.toolModel.xzPlane;
                this.movePlane3D.fromPoints(po, px, pz);
                this.changeXYZ.set(1, 0, 1);
                break;
            case this.toolModel.xyPlane:
                this.selectedItem = this.toolModel.xyPlane;
                this.movePlane3D.fromPoints(po, px, py);
                this.changeXYZ.set(1, 1, 0);
                break;
            case this.toolModel.oCube:
                this.selectedItem = this.toolModel.oCube;
                this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                this.changeXYZ.set(1, 1, 1);
                break;
        }
        //
        this.startSceneTransform = globalMatrix.clone();
        this.startPlanePos = this.getLocalMousePlaneCross();
        this.startPos = this.toolModel.transform.position;
        this.mrsToolTarget.startTranslation();
        //
        feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
    }

    private onMouseMove()
    {
        var crossPos = this.getLocalMousePlaneCross();
        var addPos = crossPos.subTo(this.startPlanePos);
        addPos.x *= this.changeXYZ.x;
        addPos.y *= this.changeXYZ.y;
        addPos.z *= this.changeXYZ.z;
        var sceneTransform = this.startSceneTransform.clone();
        sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
        var sceneAddpos = sceneTransform.getPosition().subTo(this.startSceneTransform.getPosition());
        this.mrsToolTarget.translation(sceneAddpos);
    }

    protected onMouseUp()
    {
        super.onMouseUp()
        feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);

        this.mrsToolTarget.stopTranslation();
        this.startPos = null;
        this.startPlanePos = null;
        this.startSceneTransform = null;
    }

    protected updateToolModel()
    {
        //鼠标按下时不更新
        if (this.ismouseDown) return;
        if (!this.editorCamera) return;

        var cameraPos = this.editorCamera.transform.worldPosition;
        var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformPoint3(cameraPos);

        this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
        this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;

        this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
        this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;

        this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
        this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
    }
}
