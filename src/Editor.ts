namespace editor
{
    //
    export var editorData: EditorData;

    /**
     * feng3d的版本号
     */
    export var revision: string = "2018.08.22";

    feng3d.log(`editor version ${revision}`)

    /**
     * 编辑器
     */
    export class Editor extends eui.UILayer
    {
        private mainView: MainView;

        constructor()
        {
            super();
            // giteeOauth.oauth();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        }

        private onAddedToStage()
        {
            editorui.stage = this.stage;

            //
            feng3d.task.series([
                this.initEgret.bind(this),
                this.initProject.bind(this),
            ])(() =>
            {
                this.init();
                console.log(`初始化完成。`);
            });
        }

        /**
         * 初始化 Egret
         * 
         * @param callback 完成回调
         */
        private initEgret(callback: () => void)
        {
            var mainui = new MainUI(() =>
            {
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

                editorcache.projectname = editorcache.projectname || "newproject";

                callback();
            });
            this.addChild(mainui);
        }

        /**
         * 初始化项目
         * 
         * @param callback 完成回调
         */
        private initProject(callback: () => void)
        {
            editorRS.initproject(() =>
            {
                setTimeout(() =>
                {
                    callback();
                }, 1);
            });
        }

        private init()
        {
            document.head.getElementsByTagName("title")[0].innerText = "feng3d-editor -- " + editorcache.projectname;

            editorcache.setLastProject(editorcache.projectname);

            this.initMainView()

            //初始化feng3d
            new Main3D();

            feng3d.shortcut.addShortCuts(shortcutConfig);

            new Editorshortcut();

            this.once(egret.Event.ENTER_FRAME, function ()
            {
                //
                egret.mouseEventEnvironment();
            }, this);
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
    }
}