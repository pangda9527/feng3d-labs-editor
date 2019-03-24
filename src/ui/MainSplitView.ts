namespace editor
{
    /**
     * 主分割界面
     * 
     * 用于管理分割界面，以及处理界面布局
     */
    export class MainSplitView extends eui.Component implements eui.UIComponent
    {
        constructor()
        {
            super();
            this.skinName = "MainSplitView";
        }

        protected childrenCreated(): void
        {
            super.childrenCreated();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {

        }

        private onRemovedFromStage()
        {

        }

    }
}