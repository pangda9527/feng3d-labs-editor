module feng3d.editor
{

    /**
     * 操作方式:鼠标按下后可以使用移动鼠标改变旋转，wasdqe平移
     */
    export class MousePickTest
    {

        constructor(scene3D: Scene3D)
        {

            var cube = new CubeObject3D();
            cube.transform.position = new Vector3D(0, 0, 0);
            scene3D.addChild(cube);

            var plane = new PlaneObject3D();
            plane.transform.position = new Vector3D(150, 0, 0);
            plane.transform.rotation = new Vector3D(90, 0, 0);
            scene3D.addChild(plane);

            var sphere = new SphereObject3D();
            sphere.transform.position = new Vector3D(-150, 0, 0);
            scene3D.addChild(sphere);

            var capsule = new CapsuleObject3D();
            capsule.transform.position = new Vector3D(300, 0, 0);
            scene3D.addChild(capsule);

            var cylinder = new CylinderObject3D();
            cylinder.transform.position = new Vector3D(-300, 0, 0);
            scene3D.addChild(cylinder);

            scene3D.addEventListener(Mouse3DEvent.CLICK, this.onMouseClick, this);
        }

        onMouseClick(event: Event)
        {
            var object3D: Object3D = <Object3D>event.target;
            var material = ClassUtils.as(object3D.getComponentByClass(MeshRenderer).material, ColorMaterial);
            if (material)
            {
                material.color.fromUnit(Math.random() * (1 << 24));
            }
        }
    }
}