namespace editor
{
    @feng3d.OAVComponent()
    export class OAVFeng3dPreView extends OAVBase
    {
        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVFeng3dPreView";
        }

        initView()
        {
            feng3dview = feng3dview || new Feng3dScreenShot();
            feng3dview.engine.start();
            feng3dview.engine.canvas.style.visibility = null;

            if (this.space instanceof feng3d.GameObject)
            {
                feng3dview.drawGameObject(this.space);
            } else if (this.space instanceof feng3d.Geometry)
            {
                feng3dview.drawGeometry(<any>this.space);
            } else if (this.space instanceof feng3d.Material)
            {
                feng3dview.drawMaterial(this.space);
            }
            this.onResize();
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);

            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
        }

        dispose()
        {
            feng3dview.engine.canvas.style.visibility = "hidden";
            feng3dview.engine.stop();
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
        }

        private preMousePos: feng3d.Vector2;
        private onMouseDown()
        {
            this.preMousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var s = this.localToGlobal(0, 0);
            if (new feng3d.Rectangle(s.x, s.y, this.width, this.height).containsPoint(this.preMousePos))
            {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
        }
        private onMouseMove()
        {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);

            var X_AXIS = feng3dview.camera.transform.rightVector;
            var Y_AXIS = feng3dview.camera.transform.upVector;
            feng3dview.camera.transform.rotate(X_AXIS, mousePos.y - this.preMousePos.y);
            feng3dview.camera.transform.rotate(Y_AXIS, mousePos.x - this.preMousePos.x);

            this.preMousePos = mousePos;
            feng3dview.updateCameraPosition();
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
            feng3dview.engine.setSize(this.width, this.height);

            var lt = this.localToGlobal(0, 0);

            //
            var style = feng3dview.engine.canvas.style;
            style.position = "absolute";
            style.left = lt.x + "px";
            style.top = lt.y + "px";
            style.width = this.width + "px";
            style.height = this.height + "px";
            style.cursor = "hand";
        }
    }

    var feng3dview: Feng3dScreenShot;
}
