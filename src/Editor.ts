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

            new EditorEnvironment();

            shortcut.addShortCuts(shortcutConfig);

            //初始化feng3d
            new Main3D();
        }

        protected createChildren(): void
        {
            super.createChildren();

            var editorObjectView = new EditorObjectView();
            editorObjectView.addEventListener(EditorObjectView.COMPLETED, this.onEditorObjectViewCompleted, this)
            editorObjectView.init();
        }

        private onEditorObjectViewCompleted()
        {
            this.addChild(new MainUI());
        }
    }

    /*************************** 初始化模块 ***************************/
    export var $editorEventDispatcher: EventDispatcher = new EventDispatcher();

    //
    export var editor3DData = new Editor3DData();
}