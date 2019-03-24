namespace editor
{
    enum SplitGroupState
    {
        /**
         * 默认状态，鼠标呈现正常形态
         */
        default,
        /**
         * 鼠标处在分割线上，呈现上下或者左右箭头形态
         */
        onSplit,
        /**
         * 处于拖拽分隔线状态
         */
        draging,
    }

    class SplitdragData
    {
        splitGroupState = SplitGroupState.default;

        splitGroup: SplitGroup;

        preElement: egret.DisplayObject;
        nextElement: egret.DisplayObject;
        preElementRect: egret.Rectangle;
        nextElementRect: egret.Rectangle;
        dragRect: egret.Rectangle;
        dragingMousePoint: feng3d.Vector2;
    }

    var egretDiv = <HTMLDivElement>document.getElementsByClassName("egret-player")[0];
    var splitdragData = new SplitdragData();

    interface SplitItem extends eui.Component
    {

    }

    enum SplitLayout
    {
        HorizontalLayout,
        VerticalLayout
    }

    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    export class SplitGroup extends eui.Group
    {
        /**
         * 布局类型
         */
        public get layouttype()
        {
            if (this._layouttype != undefined) return this._layouttype;

            if (this.layout instanceof eui.HorizontalLayout)
            {
                this._layouttype = SplitLayout.HorizontalLayout;
            } else if (this.layout instanceof eui.VerticalLayout)
            {
                this._layouttype = SplitLayout.VerticalLayout;
            }

            return this._layouttype;
        }
        public set layouttype(value: SplitLayout)
        {
            var oldLayouttype = this.layouttype;
            if (oldLayouttype == value) return;
            this._layouttype = value;

            this._invalidateView()
        }
        private _layouttype: SplitLayout;

        /**
         * 分割子对象列表
         */
        private _splitChildren: SplitItem[];
        /**
         * 分割百分比
         */
        private _splitPercents: number[] = [];

        constructor()
        {
            super();
        }

        protected childrenCreated(): void
        {
            super.childrenCreated();

            this._initView();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        /**
         * 初始化界面
         */
        private _initView()
        {
            var layouttype = this.layouttype;

            // 筛选出应用于分割的子对象
            this._splitChildren = <any>this.$children.filter(v => true);
            // 计算子对象尺寸
            var childrenSizes = this._splitChildren.map(v =>
            {
                if (layouttype == SplitLayout.HorizontalLayout)
                    return v.width;
                return v.height;
            })
            // 计算总量
            var total = childrenSizes.reduce((pv, cv) => pv + cv, 0)
            // 计算分割比例
            this._splitPercents = childrenSizes.map(v => v / total * 100);
        }

        private onAddedToStage()
        {
            this.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);

            this._invalidateView();
        }

        private onRemovedFromStage()
        {

            this.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }

		/**
		 * 界面显示失效
		 */
        private _invalidateView()
        {
            this.once(egret.Event.ENTER_FRAME, this._updateView, this);
        }

		/**
		 * 更新界面
		 */
        private _updateView()
        {
            // let layout = this.layouttype;

            // for (let i = 0; i < this._splitChildren.length; i++)
            // {
            //     let child = this._splitChildren[i];
            //     let size = this._splitPercents[i];
            //     if (layout == SplitLayout.HorizontalLayout)
            //     {
            //         child.percentHeight = 100;
            //         child.percentWidth = size;
            //     } else
            //     {
            //         child.percentWidth = 100;
            //         child.percentHeight = size;
            //     }
            // }
        }

        private onMouseMove(e: egret.MouseEvent)
        {
            if (splitdragData.splitGroupState == SplitGroupState.default)
            {
                this._findSplit(e.stageX, e.stageY);
                return;
            }
            if (splitdragData.splitGroup != this)
                return;
            if (splitdragData.splitGroupState == SplitGroupState.onSplit)
            {
                this._findSplit(e.stageX, e.stageY);
            }
        }

        private _findSplit(stageX: number, stageY: number)
        {
            splitdragData.splitGroupState = SplitGroupState.default;
            egretDiv.style.cursor = "auto";
            feng3d.shortcut.deactivityState("splitGroupDraging");

            var layouttype = this.layouttype;

            for (let i = 0; i < this.numElements - 1; i++)
            {
                var element = this.getElementAt(i);
                var elementRect = element.getTransformedBounds(this.stage);
                var elementRectRight = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                var elementRectBotton = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                if (layouttype == SplitLayout.HorizontalLayout && elementRectRight.contains(stageX, stageY))
                {
                    splitdragData.splitGroupState = SplitGroupState.onSplit;
                    egretDiv.style.cursor = "e-resize";
                    feng3d.shortcut.activityState("splitGroupDraging");
                    //
                    splitdragData.splitGroup = this;
                    splitdragData.preElement = this.getElementAt(i);
                    splitdragData.nextElement = this.getElementAt(i + 1);
                    break;
                } else if (layouttype == SplitLayout.VerticalLayout && elementRectBotton.contains(stageX, stageY))
                {
                    splitdragData.splitGroupState = SplitGroupState.onSplit;
                    egretDiv.style.cursor = "n-resize";
                    feng3d.shortcut.activityState("splitGroupDraging");
                    //
                    splitdragData.splitGroup = this;
                    splitdragData.preElement = this.getElementAt(i);
                    splitdragData.nextElement = this.getElementAt(i + 1);
                    break;
                }
            }
        }

        private onMouseDown(e: egret.MouseEvent)
        {
            if (splitdragData.splitGroupState == SplitGroupState.onSplit)
            {
                splitdragData.splitGroupState = SplitGroupState.draging;
                splitdragData.dragingMousePoint = new feng3d.Vector2(e.stageX, e.stageY);
                //
                var preElement = <eui.Group>splitdragData.preElement;
                var nextElement = <eui.Group>splitdragData.nextElement;
                var preElementRect = splitdragData.preElementRect = preElement.getTransformedBounds(this.stage);
                var nextElementRect = splitdragData.nextElementRect = nextElement.getTransformedBounds(this.stage);
                //
                var minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
                var maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
                var minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
                var maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
                splitdragData.dragRect = new egret.Rectangle(minX, minY, maxX - minX, maxY - minY);

                // 拖拽分割
                feng3d.windowEventProxy.on("mousemove", this.onDragMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onDragMouseUp, this);
            }
        }

        /**
         * 拖拽分割
         */
        private onDragMouseMove()
        {
            var preElement = splitdragData.preElement;
            var nextElement = splitdragData.nextElement;

            var stageX = feng3d.windowEventProxy.clientX;
            var stageY = feng3d.windowEventProxy.clientY;

            if (this.layouttype == SplitLayout.HorizontalLayout)
            {
                var layerX = Math.max(splitdragData.dragRect.left, Math.min(splitdragData.dragRect.right, stageX));
                var preElementWidth = splitdragData.preElementRect.width + (layerX - splitdragData.dragingMousePoint.x);
                var nextElementWidth = splitdragData.nextElementRect.width - (layerX - splitdragData.dragingMousePoint.x);

                (<eui.Component>preElement).percentWidth = preElementWidth / this.width * 100;
                (<eui.Component>nextElement).percentWidth = nextElementWidth / this.width * 100;
            } else
            {
                var layerY = Math.max(splitdragData.dragRect.top, Math.min(splitdragData.dragRect.bottom, stageY));
                var preElementHeight = splitdragData.preElementRect.height + (layerY - splitdragData.dragingMousePoint.y);
                var nextElementHeight = splitdragData.nextElementRect.height - (layerY - splitdragData.dragingMousePoint.y);

                (<eui.Component>preElement).percentHeight = preElementHeight / this.height * 100;
                (<eui.Component>nextElement).percentHeight = nextElementHeight / this.height * 100;
            }
        }

        /**
         * 停止拖拽
         */
        private onDragMouseUp()
        {
            splitdragData.splitGroupState = SplitGroupState.default;
            splitdragData.dragingMousePoint = null;

            feng3d.windowEventProxy.off("mousemove", this.onDragMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onDragMouseUp, this);
        }
    }
}