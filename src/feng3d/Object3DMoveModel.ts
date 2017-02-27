module feng3d
{
    export class Object3DMoveModel extends Object3D
    {
        constructor()
        {
            super();
            this.name = "Object3DMoveModel";
            this.initModels();
        }

        private initModels()
        {
            // this.addChild()
            var xArrow = new ConeObject3D(6, 18);
            xArrow.transform.x = 90;
            var material = xArrow.getOrCreateComponentByClass(MeshRenderer).material = new ColorMaterial();
            material.color.fromInts(255, 0, 0, 255);
            this.addChild(xArrow);

            var yArrow = new ConeObject3D(6, 18);
            yArrow.transform.y = 90;
            var material = yArrow.getOrCreateComponentByClass(MeshRenderer).material = new ColorMaterial();
            material.color.fromInts(0, 255, 0, 255);
            this.addChild(yArrow);

            var zArrow = new ConeObject3D(6, 18);
            zArrow.transform.z = 90;
            var material = zArrow.getOrCreateComponentByClass(MeshRenderer).material = new ColorMaterial();
            material.color.fromInts(0, 0, 255, 255);
            this.addChild(zArrow);

            var oBox = new CubeObject3D(4);
            this.addChild(oBox);

        }
    }
}