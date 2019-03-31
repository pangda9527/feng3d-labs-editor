namespace editor
{
    export class MouseRayTestScript extends EditorScript
    {
        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            feng3d.windowEventProxy.on("click", this.onclick, this);
        }

        private onclick()
        {
            var result: feng3d.Ray3D[] = [];
            feng3d.dispatcher.dispatch("engine.getMouseRay3D", result);
            if (result.length == 0) return;
            var mouseRay3D = result[0];

            var gameobject = Object.setValue(new feng3d.GameObject(), { name: "test" });
            var model = gameobject.addComponent(feng3d.Model);
            model.material = new feng3d.Material();
            model.geometry = Object.setValue(new feng3d.SphereGeometry(), { radius: 10 });
            gameobject.mouseEnabled = false;
            this.gameObject.addChild(gameobject);

            var position = mouseRay3D.position.clone();
            var direction = mouseRay3D.direction.clone();
            position = gameobject.transform.inverseTransformPoint(position);
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
}