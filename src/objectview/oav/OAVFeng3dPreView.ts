import { OAVComponent, AttributeViewInfo, windowEventProxy, ticker, Vector2, Vector3, GameObject, Geometry, Material } from 'feng3d';
import { Feng3dScreenShot } from '../../feng3d/Feng3dScreenShot';
import { MouseOnDisableScroll } from '../../ui/components/tools/MouseOnDisableScroll';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVFeng3dPreView extends OAVBase
{
    public image: eui.Image;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = 'OAVFeng3dPreView';
        this.alpha = 1;
    }

    initView()
    {
        this.cameraRotation = Feng3dScreenShot.feng3dScreenShot.camera.transform.rotation.clone();
        this.onResize();
        this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        //
        windowEventProxy.on('mousedown', this.onMouseDown, this);

        ticker.on(100, this.onDrawObject, this);

        MouseOnDisableScroll.register(this);
    }

    dispose()
    {
        windowEventProxy.off('mousedown', this.onMouseDown, this);
        ticker.off(100, this.onDrawObject, this);

        MouseOnDisableScroll.unRegister(this);
    }

    private preMousePos: Vector2;
    private onMouseDown()
    {
        this.preMousePos = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        const rect = this.getGlobalBounds();
        if (rect.contains(this.preMousePos.x, this.preMousePos.y))
        {
            windowEventProxy.on('mousemove', this.onMouseMove, this);
            windowEventProxy.on('mouseup', this.onMouseUp, this);
        }
    }

    private onMouseMove()
    {
        const mousePos = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);

        const X_AXIS = Feng3dScreenShot.feng3dScreenShot.camera.transform.matrix.getAxisX();
        const Y_AXIS = Feng3dScreenShot.feng3dScreenShot.camera.transform.matrix.getAxisY();
        Feng3dScreenShot.feng3dScreenShot.camera.transform.rotate(X_AXIS, mousePos.y - this.preMousePos.y);
        Feng3dScreenShot.feng3dScreenShot.camera.transform.rotate(Y_AXIS, mousePos.x - this.preMousePos.x);
        this.cameraRotation = Feng3dScreenShot.feng3dScreenShot.camera.transform.rotation.clone();

        this.preMousePos = mousePos;
    }

    private cameraRotation: Vector3;
    private onDrawObject()
    {
        if (this.space instanceof GameObject)
        {
            Feng3dScreenShot.feng3dScreenShot.drawGameObject(this.space, this.cameraRotation);
        }
 else if (this.space instanceof Geometry)
        {
            Feng3dScreenShot.feng3dScreenShot.drawGeometry(<any> this.space, this.cameraRotation);
        }
 else if (this.space instanceof Material)
        {
            Feng3dScreenShot.feng3dScreenShot.drawMaterial(this.space, this.cameraRotation);
        }
        this.image.source = Feng3dScreenShot.feng3dScreenShot.toDataURL(this.width, this.height);
    }

    private onMouseUp()
    {
        windowEventProxy.off('mousemove', this.onMouseMove, this);
        windowEventProxy.off('mouseup', this.onMouseUp, this);
    }

    updateView()
    {
    }

    onResize()
    {
        this.height = this.width;
        this.image.width = this.image.height = this.width;
    }
}
