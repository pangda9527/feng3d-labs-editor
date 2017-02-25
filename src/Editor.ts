module feng3d.editor
{

    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    export class Editor extends eui.UILayer
    {
        // export class Editor {

        constructor()
        {

            super();

            ClassUtils.addClassNameSpace("feng3d.editor");
            ClassUtils.addClassNameSpace("egret");

            egret.TextField.default_size = 12;

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
    export var $editorEventDispatcher: EventDispatcher = new EventDispatcher();
}