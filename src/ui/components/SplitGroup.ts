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

        private _splitGroup: SplitGroup;
        public get splitGroup(): SplitGroup
        {
            return this._splitGroup;
        }
        public set splitGroup(value: SplitGroup)
        {
            if (this._splitGroup == value) return;

            if (this._splitGroup)
            {
                //
                feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            }

            this._splitGroup = value;

            if (this._splitGroup)
            {
                feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            }
        }
        preElement: egret.DisplayObject;
        nextElement: egret.DisplayObject;
        preElementRect: egret.Rectangle;
        nextElementRect: egret.Rectangle;
        dragRect: egret.Rectangle;
        dragingMousePoint: feng3d.Vector2;

        private onMouseDown(e: egret.MouseEvent)
        {
            if (this.splitGroupState == SplitGroupState.onSplit)
            {
                this.splitGroupState = SplitGroupState.draging;
                this.dragingMousePoint = new feng3d.Vector2(e.stageX, e.stageY);
                //
                var preElement = <eui.Group>this.preElement;
                var nextElement = <eui.Group>this.nextElement;
                var preElementRect = this.preElementRect = preElement.getTransformedBounds(this._splitGroup.stage);
                var nextElementRect = this.nextElementRect = nextElement.getTransformedBounds(this._splitGroup.stage);
                //
                var minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
                var maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
                var minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
                var maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
                this.dragRect = new egret.Rectangle(minX, minY, maxX - minX, maxY - minY);

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
            var preElement = this.preElement;
            var nextElement = this.nextElement;

            var stageX = feng3d.windowEventProxy.clientX;
            var stageY = feng3d.windowEventProxy.clientY;

            if (this._splitGroup.layout instanceof eui.HorizontalLayout)
            {
                var layerX = Math.max(this.dragRect.left, Math.min(this.dragRect.right, stageX));
                var preElementWidth = this.preElementRect.width + (layerX - this.dragingMousePoint.x);
                var nextElementWidth = this.nextElementRect.width - (layerX - this.dragingMousePoint.x);

                (<eui.Component>preElement).percentWidth = preElementWidth / this._splitGroup.width * 100;
                (<eui.Component>nextElement).percentWidth = nextElementWidth / this._splitGroup.width * 100;
            } else if (this._splitGroup.layout instanceof eui.VerticalLayout)
            {
                var layerY = Math.max(this.dragRect.top, Math.min(this.dragRect.bottom, stageY));
                var preElementHeight = this.preElementRect.height + (layerY - this.dragingMousePoint.y);
                var nextElementHeight = this.nextElementRect.height - (layerY - this.dragingMousePoint.y);

                (<eui.Component>preElement).percentHeight = preElementHeight / this._splitGroup.height * 100;
                (<eui.Component>nextElement).percentHeight = nextElementHeight / this._splitGroup.height * 100;
            }
        }

        /**
         * 停止拖拽
         */
        private onDragMouseUp()
        {
            this.splitGroupState = SplitGroupState.default;
            this.dragingMousePoint = null;
            this.splitGroup = null;

            feng3d.windowEventProxy.off("mousemove", this.onDragMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onDragMouseUp, this);
        }
    }

    var egretDiv = <HTMLDivElement>document.getElementsByClassName("egret-player")[0];
    var splitdragData = new SplitdragData();

    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    export class SplitGroup extends eui.Group
    {
        constructor()
        {
            super();
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
            this.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
        }

        private onRemovedFromStage()
        {
            this.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
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

            var index = -1;
            for (let i = 0; i < this.numElements - 1; i++)
            {
                var element = this.getElementAt(i);
                var elementRect = element.getTransformedBounds(this.stage);
                var elementRectRight = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                var elementRectBotton = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                if (this.layout instanceof eui.HorizontalLayout && elementRectRight.contains(stageX, stageY))
                {
                    index = i;
                    break;
                } else if (this.layout instanceof eui.VerticalLayout && elementRectBotton.contains(stageX, stageY))
                {
                    index = i;
                    break;
                }
            }
            if (index != -1)
            {
                splitdragData.splitGroupState = SplitGroupState.onSplit;
                feng3d.shortcut.activityState("splitGroupDraging");
                //
                splitdragData.splitGroup = this;
                splitdragData.preElement = this.getElementAt(index);
                splitdragData.nextElement = this.getElementAt(index + 1);
                //
                egretDiv.style.cursor = this.layout instanceof eui.HorizontalLayout ? "e-resize" : "n-resize";
            } else
            {
                splitdragData.splitGroup = null;
                //
                egretDiv.style.cursor = "auto";
            }
        }
    }
}