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
        get splitGroupState()
        {
            return this._splitGroupState;
        }
        set splitGroupState(value)
        {
            this._splitGroupState = value;
            this.updatecursor();
        }
        private _splitGroupState = SplitGroupState.default;

        get layouttype()
        {
            return this._layouttype;
        }
        set layouttype(value)
        {
            this._layouttype = value;
            this.updatecursor();
        }
        private _layouttype = 0;

        private updatecursor()
        {
            if (this._splitGroupState == SplitGroupState.default)
            {
                egretDiv.style.cursor = "auto";
                feng3d.shortcut.deactivityState("splitGroupDraging");
            } else
            {
                if (this._layouttype == 1)
                {
                    egretDiv.style.cursor = "e-resize";
                } else if (this._layouttype == 2)
                {
                    egretDiv.style.cursor = "n-resize";
                }
                feng3d.shortcut.activityState("splitGroupDraging");
            }
        }

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

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.addEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()

            this.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
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
            } else if (splitdragData.splitGroupState == SplitGroupState.draging)
            {
                var preElement = splitdragData.preElement;
                var nextElement = splitdragData.nextElement;
                if (splitdragData.layouttype == 1)
                {
                    var layerX = Math.max(splitdragData.dragRect.left, Math.min(splitdragData.dragRect.right, e.stageX));
                    var preElementWidth = splitdragData.preElementRect.width + (layerX - splitdragData.dragingMousePoint.x);
                    var nextElementWidth = splitdragData.nextElementRect.width - (layerX - splitdragData.dragingMousePoint.x);
                    if (preElement instanceof eui.Group)
                    {
                        // preElement.setContentSize(preElementWidth, splitdragData.preElementRect.height);
                        preElement.width = preElementWidth;
                    } else
                    {
                        preElement.width = preElementWidth;
                    }
                    if (nextElement instanceof eui.Group)
                    {
                        // nextElement.setContentSize(nextElementWidth, nextElement.contentHeight);
                        nextElement.width = nextElementWidth;
                    } else
                    {
                        nextElement.width = nextElementWidth;
                    }
                } else
                {
                    var layerY = Math.max(splitdragData.dragRect.top, Math.min(splitdragData.dragRect.bottom, e.stageY));
                    var preElementHeight = splitdragData.preElementRect.height + (layerY - splitdragData.dragingMousePoint.y);
                    var nextElementHeight = splitdragData.nextElementRect.height - (layerY - splitdragData.dragingMousePoint.y);
                    if (preElement instanceof eui.Group)
                    {
                        // preElement.setContentSize(splitdragData.preElementRect.width, preElementHeight);
                        preElement.height = preElementHeight;
                    } else
                    {
                        preElement.height = preElementHeight;
                    }
                    if (nextElement instanceof eui.Group)
                    {
                        // nextElement.setContentSize(splitdragData.nextElementRect.width, nextElementHeight);
                        nextElement.height = nextElementHeight;
                    } else
                    {
                        nextElement.height = nextElementHeight;
                    }
                }
            }
        }

        private _findSplit(stageX: number, stageY: number)
        {
            splitdragData.splitGroupState = SplitGroupState.default;

            if (this.numElements < 2)
                return;
            var layouttype = 0;

            if (this.layout instanceof eui.HorizontalLayout)
            {
                layouttype = 1;
            } else if (this.layout instanceof eui.VerticalLayout)
            {
                layouttype = 2;
            }
            if (layouttype == 0)
                return;
            for (let i = 0; i < this.numElements - 1; i++)
            {
                var element = this.getElementAt(i);
                var elementRect = element.getTransformedBounds(this.stage);
                var elementRectRight = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                var elementRectBotton = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                if (layouttype == 1 && elementRectRight.contains(stageX, stageY))
                {
                    splitdragData.splitGroupState = SplitGroupState.onSplit;
                    splitdragData.layouttype = 1;

                    splitdragData.splitGroup = this;
                    splitdragData.preElement = this.getElementAt(i);
                    splitdragData.nextElement = this.getElementAt(i + 1);
                    break;
                } else if (layouttype == 2 && elementRectBotton.contains(stageX, stageY))
                {
                    splitdragData.splitGroupState = SplitGroupState.onSplit;
                    splitdragData.layouttype = 2;

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
            }
        }

        private onMouseUp(e: egret.MouseEvent)
        {
            if (splitdragData.splitGroupState == SplitGroupState.draging)
            {
                splitdragData.splitGroupState = SplitGroupState.default;
                splitdragData.dragingMousePoint = null;
            }
        }
    }
}