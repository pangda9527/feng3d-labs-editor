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
        constructor()
        {
            super();

            this.initeditorcache(this.init.bind(this));
        }

        private init()
        {
            //
            editor3DData = new Editor3DData();
            //初始化配置
            objectViewConfig();

            document.head.getElementsByTagName("title")[0].innerText = "editor -- " + assets.projectPath;

            //
            new EditorEnvironment();

            //初始化feng3d
            new Main3D();

            shortcut.addShortCuts(shortcutConfig);

            this.addChild(new MainUI());

            editorshortcut.init();

            this.once(egret.Event.ENTER_FRAME, function ()
            {
                //
                mouseEventEnvironment = new MouseEventEnvironment();
            }, this);

            this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        }

        private initeditorcache(callback: Function)
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
                        file.writeJsonFile("editorcache.json", editorcache);
                        electron.call("initproject", { param: { path: editorcache.projectpath } });
                        callback();
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
                electron.call("selected-directory", {
                    param: { title: "选择项目路径" },
                    callback: (path) =>
                    {
                        electron.call("createproject", {
                            param: { path: path }, callback: () =>
                            {
                                electron.call("initproject", { param: { path: path } });
                                editorcache.projectpath = assets.projectPath = path;
                                editorcache.historyprojectpaths = editorcache.historyprojectpaths = [];
                                if (editorcache.historyprojectpaths.indexOf(path) == -1)
                                    editorcache.historyprojectpaths.unshift(path);

                                file.writeJsonFile("editorcache.json", editorcache);
                                callback();
                            }
                        });
                    }
                });
            }
        }

        private _onAddToStage()
        {
            editor3DData.stage = this.stage;
        }
    }
}