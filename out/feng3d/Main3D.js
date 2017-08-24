var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
        * 编辑器3D入口
        * @author feng 2016-10-29
        */
        var Main3D = (function () {
            function Main3D() {
                this.init();
                //
                feng3d.ticker.on("enterFrame", this.process, this);
            }
            Main3D.prototype.process = function (event) {
                editor.editor3DData.mouseInView3D.copyFrom(editor.editor3DData.view3D.mousePos);
                editor.editor3DData.view3DRect.copyFrom(editor.editor3DData.view3D.viewRect);
            };
            Main3D.prototype.init = function () {
                var canvas = document.getElementById("glcanvas");
                var view3D = new feng3d.Engine(canvas);
                view3D.scene.background.fromUnit(0x666666);
                editor.editor3DData.view3D = view3D;
                editor.editor3DData.scene3D = view3D.scene;
                editor.editor3DData.camera = view3D.camera;
                editor.editor3DData.hierarchy = new editor.Hierarchy(view3D.scene.gameObject);
                //
                var camera = view3D.camera;
                camera.transform.z = -500;
                camera.transform.y = 300;
                camera.transform.lookAt(new feng3d.Vector3D());
                var trident = feng3d.GameObject.create("Trident");
                trident.addComponent(feng3d.Trident);
                view3D.scene.gameObject.addChild(trident);
                //初始化模块
                var groundGrid = feng3d.GameObject.create("GroundGrid").addComponent(editor.GroundGrid);
                view3D.scene.gameObject.addChild(groundGrid.gameObject);
                var object3DControllerTool = feng3d.GameObject.create("object3DControllerTool").addComponent(editor.Object3DControllerTool);
                //
                var sceneControl = new editor.SceneControl();
                this.test();
            };
            Main3D.prototype.test = function () {
                editor.editor3DData.scene3D.gameObject.on("mousedown", function (event) {
                    var gameobject = event.target;
                    var names = [gameobject.name];
                    while (gameobject.parent) {
                        gameobject = gameobject.parent;
                        names.push(gameobject.name);
                    }
                    console.log(event.type, names.reverse().join("->"));
                }, this);
                // this.testMouseRay();
            };
            Main3D.prototype.testMouseRay = function () {
                feng3d.input.on("click", function () {
                    var gameobject = feng3d.GameObject.create("test");
                    gameobject.addComponent(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
                    gameobject.addComponent(feng3d.MeshFilter).mesh = new feng3d.SphereGeometry(10);
                    gameobject.mouseEnabled = false;
                    editor.editor3DData.scene3D.gameObject.addChild(gameobject);
                    var mouseRay3D = editor.editor3DData.camera.getMouseRay3D();
                    gameobject.transform.position = mouseRay3D.position;
                    var direction = mouseRay3D.direction.clone();
                    var num = 1000;
                    var translate = function () {
                        gameobject.transform.translate(direction, 15);
                        if (num > 0) {
                            setTimeout(function () {
                                translate();
                            }, 1000 / 60);
                        }
                        else {
                            editor.editor3DData.scene3D.gameObject.removeChild(gameobject);
                        }
                        num--;
                    };
                    translate();
                }, this);
            };
            return Main3D;
        }());
        editor.Main3D = Main3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Main3D.js.map