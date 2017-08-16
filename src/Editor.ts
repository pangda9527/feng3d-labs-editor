namespace feng3d.editor
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

            //
            editor3DData = new Editor3DData();
            //初始化配置
            objectview.mergeConfig(objectViewConfig);

            //
            new EditorEnvironment();

            //初始化feng3d
            new Main3D();

            shortcut.addShortCuts(shortcutConfig);

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
}