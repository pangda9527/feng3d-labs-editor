module feng3d.editor {

    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    export class Editor {

        constructor() {

            //初始化feng3d
            new Main3D();
            //初始化界面
            Laya.init(Laya.Browser.width, Laya.Browser.height);
            Laya.loader.load([{ url: "res/atlas/comp.json", type: laya.net.Loader.ATLAS }], laya.utils.Handler.create(null, onLoaded));

            function onLoaded(): void {
                //实例UI界面
                // var testUI = new MainUI();
                // Laya.stage.addChild(testUI);

                //背景完全透明
                Laya.stage.bgColor = "0";

                var view = ObjectView.getObjectView(new Vector3D());
                view.x = 20;
                view.y = 20;
                Laya.stage.addChild(view);
            }
        }
    }

    //启动编辑器
    var editor = new Editor();
}