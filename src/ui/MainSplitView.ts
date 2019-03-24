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

            this._saveViewLayout();

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

        private _saveViewLayout()
        {
            var sp = <SplitGroup>this.getChildAt(0);

            sp.numChildren;



        }
    }

    interface ViewLayout
    {
        /**
         * 类型
         */
        type: "SplitGroup" | "TabView";
    }

    interface ViewLayoutSplitGroup extends ViewLayout
    {
        type: "SplitGroup";

        

        children: [ViewLayout, ViewLayout];
    }

    interface ViewLayoutTabView extends ViewLayout
    {
        type: "TabView";
    }


}