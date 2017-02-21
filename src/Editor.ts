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
            //初始化feng3d
            new Main3D();
        }

        protected createChildren(): void
        {
            super.createChildren();

            this.addChild(new MainUI());
        }
    }
}