module feng3d.editor {

    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    export class Main3D {

        view3D: feng3d.View3D;

        constructor() {

            this.init();
        }

        init() {
            var canvas = document.getElementById("glcanvas");
            this.view3D = new feng3d.View3D(canvas);

            //初始化颜色材质
            var colorMaterial = new feng3d.ColorMaterial();
            var cube = feng3d.$object3DFactory.createCube();
            cube.transform.z = 300;
            this.view3D.scene.addChild(cube);

            //变化旋转与颜色
            setInterval(function () {
                cube.transform.ry += 1;
            }, 15);
            setInterval(function () {
                colorMaterial.color.fromUnit(Math.random() * (1 << 32 - 1));
            }, 1000);

            this.view3D.scene.addChild(new GroundGrid().groundGridObject3D);
        }
    }
}