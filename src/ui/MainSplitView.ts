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
            var sp = this.getChildAt(0);

            var data = this._getData(sp);
            console.log(data);
        }

        private _getData(sp: egret.DisplayObject)
        {
            let data: any = {};
            data.x = sp.x;
            data.y = sp.y;
            data.width = sp.width;
            data.height = sp.height;
            data.type = egret.getQualifiedClassName(sp);
            if (sp instanceof eui.Group || sp instanceof eui.Component)
            {
                data.percentWidth = sp.percentWidth;
                data.percentHeight = sp.percentHeight;
                data.top = sp.top;
                data.bottom = sp.bottom;
                data.left = sp.left;
                data.right = sp.right;
            }
            if (sp instanceof SplitGroup)
            {
                if (sp.layout instanceof eui.HorizontalLayout)
                {
                    data.layout = "HorizontalLayout";
                } else if (sp.layout instanceof eui.VerticalLayout)
                {
                    data.layout = "VerticalLayout";
                }
                var children = [];
                for (let i = 0; i < sp.numChildren; i++)
                {
                    const element = sp.getChildAt(i);
                    children[i] = this._getData(element);
                }
                data.children = children;
            }
            if (sp instanceof TabView)
            {
                data.modules = sp.getModuleNames();
            }
            return data;
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