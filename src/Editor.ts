module feng3d.editor
{
    //
    export var editor3DData: Editor3DData;

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

                this.initeditorcache(this.init.bind(this));
                this.removeChild(mainui);
            });
            this.addChild(mainui);
        }

        private init()
        {
            //
            editor3DData = new Editor3DData();

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
                mouseEventEnvironment = new MouseEventEnvironment();
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
            file.readFile("editorcache.json", (err, data) =>
            {
                if (err)
                {
                    createnewproject();
                } else
                {
                    try
                    {
                        editorcache = JSON.parse(data);
                        tryprojectpath();
                    } catch (e)
                    {
                        createnewproject();
                    }
                }
            });

            function tryprojectpath()
            {
                file.stat(editorcache.projectpath, (err, stats) =>
                {
                    if (!err)
                    {
                        assets.projectPath = editorcache.projectpath;
                        var content = JSON.stringify(editorcache, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                        file.writeFile("editorcache.json", content);

                        file.initproject(editorcache.projectpath, callback);
                        return;
                    }
                    editorcache.historyprojectpaths = editorcache.historyprojectpaths || [];
                    var index = editorcache.historyprojectpaths.indexOf(editorcache.projectpath);
                    if (index != -1)
                        editorcache.historyprojectpaths.splice(index, 1);
                    if (editorcache.historyprojectpaths.length > 0)
                    {
                        editorcache.projectpath = editorcache.historyprojectpaths[0];
                        tryprojectpath();
                    } else
                    {
                        createnewproject();
                    }
                });
            }

            function createnewproject()
            {
                //选择项目路径
                if (isNative)
                {
                    electron.call("selected-directory", { param: { title: "选择项目路径" }, callback: onSeletedProjectPath });
                } else
                {
                    popupview.popup({ projectName: "" }, (obj) =>
                    {
                        onSeletedProjectPath(obj.projectName);
                    });
                }

                function onSeletedProjectPath(path)
                {
                    file.createproject(path, () =>
                    {
                        editorcache.projectpath = assets.projectPath = path;
                        editorcache.historyprojectpaths = editorcache.historyprojectpaths = [];
                        if (editorcache.historyprojectpaths.indexOf(path) == -1)
                            editorcache.historyprojectpaths.unshift(path);

                        var content = JSON.stringify(editorcache, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                        file.writeFile("editorcache.json", content);

                        file.initproject(path, callback);
                    });
                }
            }
        }

        private _onAddToStage()
        {
            editor3DData.stage = this.stage;
        }
    }
}