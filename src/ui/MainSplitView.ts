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
            feng3d.dispatcher.on("viewLayout.changed", this._saveViewLayout, this);
            this._initViewLayout();
        }

        private onRemovedFromStage()
        {
            feng3d.dispatcher.off("viewLayout.changed", this._saveViewLayout, this);
        }

        private _initViewLayout()
        {
            if (editorcache.viewLayout)
            {
                this.removeChildAt(0);

                var sp = this._createViews(editorcache.viewLayout);
                this.addChild(sp);

            } else
            {
                this._saveViewLayout();
            }

        }

        private _saveViewLayout()
        {
            var sp = this.getChildAt(0);

            var data = this._getData(sp);

            editorcache.viewLayout = data;

            console.log(data);
        }

        private _getData(sp: egret.DisplayObject)
        {
            let data: any = {};
            data.x = sp.x;
            data.y = sp.y;
            data.width = sp.width;
            data.height = sp.height;
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
                data.type = "SplitGroup";
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
                data.type = "TabView";
                data.modules = sp.getModuleNames();
            }
            return data;
        }

        private _createViews(data: any): egret.DisplayObject
        {
            var displayObject: egret.DisplayObject;

            if (data.type == "SplitGroup")
            {
                var splitGroup = displayObject = new SplitGroup();
                if (data.layout == "HorizontalLayout")
                {
                    splitGroup.layout = new eui.HorizontalLayout();
                } else if (data.layout == "VerticalLayout")
                {
                    splitGroup.layout = new eui.VerticalLayout();
                }
                var children = data.children;
                for (let i = 0; i < children.length; i++)
                {
                    let child = this._createViews(children[i]);
                    splitGroup.addChild(child);
                }
            } else if (data.type == "TabView")
            {
                var tabView = displayObject = new TabView();
                tabView.setModuleNames(data.modules);

            }

            return displayObject;
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