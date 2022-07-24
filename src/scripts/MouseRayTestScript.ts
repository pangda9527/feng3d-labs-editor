
export class MouseRayTestScript extends EditorScript
{
    init()
    {
        super.init();

        feng3d.windowEventProxy.on("click", this.onclick, this);
    }

    private onclick()
    {
        var mouseRay3D = this.gameObject.scene.mouseRay3D;

        var gameobject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "test" });
        var model = gameobject.addComponent(feng3d.Renderable);
        model.material = new feng3d.Material();
        model.geometry = feng3d.serialization.setValue(new feng3d.SphereGeometry(), { radius: 10 });
        gameobject.mouseEnabled = false;
        this.gameObject.addChild(gameobject);

        var position = mouseRay3D.origin.clone();
        var direction = mouseRay3D.direction.clone();
        position = gameobject.transform.worldToLocalPoint(position);
        direction = gameobject.transform.inverseTransformDirection(direction);
        gameobject.transform.position = position;

        var num = 1000;
        var translate = () =>
        {
            gameobject.transform.translate(direction, 15);
            if (num > 0)
            {
                setTimeout(function ()
                {
                    translate();
                }, 1000 / 60);
            } else
            {
                gameobject.remove();
            }
            num--;
        }
        translate();
    }

    update()
    {
    }

    /**
     * 销毁
     */
    dispose()
    {
        feng3d.windowEventProxy.off("click", this.onclick, this);
    }
}
