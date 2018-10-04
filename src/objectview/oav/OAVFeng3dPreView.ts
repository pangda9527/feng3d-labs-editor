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
        }

        dispose()
        {
            feng3dview.engine.canvas.style.visibility = "hidden";
            feng3dview.engine.stop();
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
