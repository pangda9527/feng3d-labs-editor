namespace editor
{
    //
    export var editorData: EditorData;

    /**
     * feng3d的版本号
     * @author feng 2015-03-20
     */
    export var revision: string = "2018.08.02";

    feng3d.log(`Editot version ${revision}`)

    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    export class Editor extends eui.UILayer
    {
        private mainView: MainView;

        constructor()
        {
            super();

            var mainui = new MainUI(() =>
            {
                editorui.stage = this.stage;

                //
                var maskLayer = new eui.UILayer();
                maskLayer.touchEnabled = false;
                this.stage.addChild(maskLayer);
                editorui.maskLayer = maskLayer;
                //
                var tooltipLayer = new eui.UILayer();
                tooltipLayer.touchEnabled = false;
                this.stage.addChild(tooltipLayer);
                editorui.tooltipLayer = tooltipLayer;
                //
                var popupLayer = new eui.UILayer();
                popupLayer.touchEnabled = false;
                this.stage.addChild(popupLayer);
                editorui.popupLayer = popupLayer;

                this.initproject(() =>
                {
                    setTimeout(() =>
                    {
                        this.init();
                    }, 1);
                });
                this.removeChild(mainui);
            });
            this.addChild(mainui);
        }

        private init()
        {

            document.head.getElementsByTagName("title")[0].innerText = "editor -- " + editorcache.projectname;

            feng3d.runEnvironment = feng3d.RunEnvironment.editor;

            this.initMainView()

            //初始化feng3d
            new Main3D();

            feng3d.shortcut.addShortCuts(shortcutConfig);

            editorshortcut.init();

            this.once(egret.Event.ENTER_FRAME, function ()
            {
                //
                egret.mouseEventEnvironment();
            }, this);

            this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        }

        private initMainView()
        {
            //
            this.mainView = new MainView();
            this.stage.addChildAt(this.mainView, 1);
            this.onresize();
            window.onresize = this.onresize.bind(this);
            editorui.mainview = this.mainView;
        }

        private onresize()
        {
            this.stage.setContentSize(window.innerWidth, window.innerHeight);
            this.mainView.width = this.stage.stageWidth;
            this.mainView.height = this.stage.stageHeight;
        }

        private initproject(callback: () => void)
        {
            editorcache.projectname = editorcache.projectname || "newproject";

            fs.hasProject(editorcache.projectname, (has) =>
            {
                if (has)
                {
                    fs.initproject(editorcache.projectname, callback);
                } else
                {
                    fs.createproject(editorcache.projectname, () =>
                    {
                        fs.initproject(editorcache.projectname, callback);
                    });
                }
            });
        }

        private _onAddToStage()
        {
            editorData.stage = this.stage;
        }
    }
}