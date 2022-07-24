import { windowEventProxy, serialization, GameObject, Renderable, Material, SphereGeometry } from 'feng3d';
import { EditorScript } from './EditorScript';

export class MouseRayTestScript extends EditorScript
{
    init()
    {
        super.init();

        windowEventProxy.on("click", this.onclick, this);
    }

    private onclick()
    {
        var mouseRay3D = this.gameObject.scene.mouseRay3D;

        var gameobject = serialization.setValue(new GameObject(), { name: "test" });
        var model = gameobject.addComponent(Renderable);
        model.material = new Material();
        model.geometry = serialization.setValue(new SphereGeometry(), { radius: 10 });
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
        windowEventProxy.off("click", this.onclick, this);
    }
}
