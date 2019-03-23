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
                editorRS.initproject.bind(editorRS),
                this.init.bind(this),
            ])(() =>
            {
                console.log(`初始化完成。`);
            });
            //
            window.onresize = this.onresize.bind(this);
            this.onresize();
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

                this.removeChild(mainui);
                callback();
            });
            this.addChild(mainui);
        }

        private init(callback: () => void)
        {
            document.head.getElementsByTagName("title")[0].innerText = "feng3d-editor -- " + editorcache.projectname;

            editorcache.setLastProject(editorcache.projectname);

            this.initMainView()

            //初始化feng3d
            new Main3D();

            new Editorshortcut();

            egret.mouseEventEnvironment();

            callback();
        }

        private initMainView()
        {
            //
            var mainView = new MainView();
            editorui.mainview = mainView;
            this.stage.addChildAt(mainView, 1);
            window.onresize = this.onresize.bind(this);
            this.onresize();
        }

        private onresize()
        {
            this.stage.setContentSize(window.innerWidth, window.innerHeight);
        }
    }
}