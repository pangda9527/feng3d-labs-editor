namespace editor
{
    @feng3d.OAVComponent()
    export class OAVFeng3dPreView extends OAVBase
    {
        public image: eui.Image;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVFeng3dPreView";
            this.alpha = 1;
        }

        initView()
        {
            this.cameraRotation = feng3dScreenShot.camera.transform.rotation.clone();
            this.onResize();
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);

            feng3d.ticker.on(100, this.onDrawObject, this);

            MouseOnDisableScroll.register(this);
        }

        dispose()
        {
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.ticker.off(100, this.onDrawObject, this);

            MouseOnDisableScroll.unRegister(this);
        }

        private preMousePos: feng3d.Vector2;
        private onMouseDown()
        {
            this.preMousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rect = this.getGlobalBounds();
            if (rect.contains(this.preMousePos.x, this.preMousePos.y))
            {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
        }

        private onMouseMove()
        {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);

            var X_AXIS = feng3dScreenShot.camera.transform.rightVector;
            var Y_AXIS = feng3dScreenShot.camera.transform.upVector;
            feng3dScreenShot.camera.transform.rotate(X_AXIS, mousePos.y - this.preMousePos.y);
            feng3dScreenShot.camera.transform.rotate(Y_AXIS, mousePos.x - this.preMousePos.x);
            this.cameraRotation = feng3dScreenShot.camera.transform.rotation.clone();

            this.preMousePos = mousePos;
        }

        private cameraRotation: feng3d.Vector3;
        private onDrawObject()
        {
            this.cameraRotation && (feng3dScreenShot.camera.transform.rotation = this.cameraRotation);

            if (this.space instanceof feng3d.GameObject)
            {
                feng3dScreenShot.drawGameObject(this.space);
            } else if (this.space instanceof feng3d.Geometry)
            {
                feng3dScreenShot.drawGeometry(<any>this.space);
            } else if (this.space instanceof feng3d.Material)
            {
                feng3dScreenShot.drawMaterial(this.space);
            }
            this.image.source = feng3dScreenShot.toDataURL(this.width, this.height);
        }

        private onMouseUp()
        {
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
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
}
