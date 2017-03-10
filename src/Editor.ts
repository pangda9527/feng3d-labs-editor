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
        }
    }

    /*************************** 初始化模块 ***************************/
    //初始化配置
    $objectViewConfig = objectViewConfig;

    export var $editorEventDispatcher: EventDispatcher = new EventDispatcher();

    //
    export var editor3DData = new Editor3DData();
}