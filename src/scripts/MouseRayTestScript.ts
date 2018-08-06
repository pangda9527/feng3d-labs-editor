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
            var gameobject = feng3d.GameObject.create("test");
            var model = gameobject.addComponent(feng3d.Model);
            model.material = feng3d.materialFactory.create("standard");
            model.geometry = new feng3d.SphereGeometry({ radius: 10 });
            gameobject.mouseEnabled = false;

            var mouseRay3D = engine.camera.getMouseRay3D();

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