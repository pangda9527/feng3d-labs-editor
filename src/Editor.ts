module feng3d.editor
{
    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    export class Editor extends eui.UILayer
    {
        constructor()
        {
            super();

            //
            new EditorEnvironment();

            shortcut.addShortCuts(shortcutConfig);

            //初始化feng3d
            new Main3D();

            this.addChild(new MainUI());

            this.once(egret.Event.ENTER_FRAME, function ()
            {
                //
                mouseEventEnvironment = new MouseEventEnvironment();
            }, this);

            this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        }

        private _onAddToStage()
        {
            editor3DData.stage = this.stage;
        }
    }

    /*************************** 初始化模块 ***************************/
    //初始化配置
    $objectViewConfig = objectViewConfig;


    export var $editorEventDispatcher: EventDispatcher = new EventDispatcher();

    //
    export var editor3DData = new Editor3DData();
}