namespace feng3d.editor
{
    //
    export var editorData: EditorData;

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
                var popupLayer = new eui.UILayer();
                popupLayer.touchEnabled = false;
                this.stage.addChild(popupLayer);
                editorui.popupLayer = popupLayer;

                //初始化配置
                objectViewConfig();

                this.initeditorcache(() =>
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
            //
            editorData = new EditorData();

            document.head.getElementsByTagName("title")[0].innerText = "editor -- " + assets.projectPath;

            //
            new EditorEnvironment();

            this.initMainView()

            //初始化feng3d
            new Main3D();

            shortcut.addShortCuts(shortcutConfig);

            editorshortcut.init();

            this.once(egret.Event.ENTER_FRAME, function ()
            {
                //
                egret.mouseEventEnvironment = new egret.MouseEventEnvironment();
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

        private initeditorcache(callback: () => void)
        {
            //获取项目路径
            try
            {
                tryprojectpath(callback);
            } catch (e)
            {
                createnewproject(callback);
            }

            function tryprojectpath(callback: () => void)
            {
                if (editorcache.projectname)
                {
                    var projectname = editorcache.projectname;
                    fs.hasProject(projectname, (has) =>
                    {
                        if (has)
                        {
                            assets.projectPath = projectname;
                            fs.initproject(projectname, callback);
                        } else
                        {
                            createnewproject(callback);
                        }
                    });
                } else
                {
                    createnewproject(callback);
                }
            }

            function createnewproject(callback: () => void)
            {
                var projectname = "testproject";
                fs.createproject(projectname, () =>
                {
                    editorcache.projectname = assets.projectPath = projectname;
                    fs.initproject(projectname, callback);
                });
            }
        }

        private _onAddToStage()
        {
            editorData.stage = this.stage;
        }
    }
}