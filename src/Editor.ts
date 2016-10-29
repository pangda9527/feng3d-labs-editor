module feng3d.editor {
    export class Editor {

        constructor() {

            //初始化feng3d
            new Main3D();
            //初始化界面
            Laya.init(600, 400);
            Laya.loader.load([{ url: "res/atlas/comp.json", type: laya.net.Loader.ATLAS }], laya.utils.Handler.create(null, onLoaded));

            function onLoaded(): void {
                //实例UI界面
                var testUI = new MainUI();
                Laya.stage.addChild(testUI);
            }
        }
    }

    //启动编辑器
    var editor = new Editor();
}