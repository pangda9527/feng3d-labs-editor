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
            } else
            {
                if (this._layouttype == 1)
                {
                    egretDiv.style.cursor = "e-resize";
                } else if (this._layouttype == 2)
                {
                    egretDiv.style.cursor = "n-resize";
                }
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
        private _onMouseMovethis: (e: MouseEvent) => void;
        private _onMouseDownthis: (e: MouseEvent) => void;
        private _onMouseUpthis: (e: MouseEvent) => void;

        constructor()
        {
            super();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this._onMouseMovethis = this.onMouseMove.bind(this);
            this._onMouseDownthis = this.onMouseDown.bind(this);
            this._onMouseUpthis = this.onMouseUp.bind(this);

            egretDiv.addEventListener("mousemove", this._onMouseMovethis);
            egretDiv.addEventListener("mousedown", this._onMouseDownthis);
            egretDiv.addEventListener("mouseup", this._onMouseUpthis);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()

            egretDiv.removeEventListener("mousemove", this._onMouseMovethis);
            egretDiv.removeEventListener("mousedown", this._onMouseDownthis);
            egretDiv.removeEventListener("mouseup", this._onMouseUpthis);

            this._onMouseMovethis = null;
            this._onMouseDownthis = null;
            this._onMouseUpthis = null;
        }

        private onMouseMove(e: MouseEvent)
        {
            if (splitdragData.splitGroupState == SplitGroupState.default)
            {
                this._findSplit(e.layerX, e.layerY);
                return;
            }
            if (splitdragData.splitGroup != this)
                return;
            if (splitdragData.splitGroupState == SplitGroupState.onSplit)
            {
                this._findSplit(e.layerX, e.layerY);
            } else if (splitdragData.splitGroupState == SplitGroupState.draging)
            {
                var preElement = splitdragData.preElement;
                var nextElement = splitdragData.nextElement;
                if (splitdragData.layouttype == 1)
                {
                    var layerX = Math.max(splitdragData.dragRect.left, Math.min(splitdragData.dragRect.right, e.layerX));
                    var preElementWidth = splitdragData.preElementRect.width + (layerX - splitdragData.dragingMousePoint.x);
                    var nextElementWidth = splitdragData.nextElementRect.width - (layerX - splitdragData.dragingMousePoint.x);
                    if (preElement instanceof eui.Group)
                    {
                        preElement.setContentSize(preElementWidth, splitdragData.preElementRect.height);
                    } else
                    {
                        preElement.width = preElementWidth;
                    }
                    if (nextElement instanceof eui.Group)
                    {
                        nextElement.setContentSize(nextElementWidth, nextElement.contentHeight);
                    } else
                    {
                        nextElement.width = nextElementWidth;
                    }
                } else
                {
                    var layerY = Math.max(splitdragData.dragRect.top, Math.min(splitdragData.dragRect.bottom, e.layerY));
                    var preElementHeight = splitdragData.preElementRect.height + (layerY - splitdragData.dragingMousePoint.y);
                    var nextElementHeight = splitdragData.nextElementRect.height - (layerY - splitdragData.dragingMousePoint.y);
                    if (preElement instanceof eui.Group)
                    {
                        preElement.setContentSize(splitdragData.preElementRect.width, preElementHeight);
                    } else
                    {
                        preElement.height = preElementHeight;
                    }
                    if (nextElement instanceof eui.Group)
                    {
                        nextElement.setContentSize(splitdragData.nextElementRect.width, nextElementHeight);
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

        private onMouseDown(e: MouseEvent)
        {
            if (splitdragData.splitGroupState == SplitGroupState.onSplit)
            {
                splitdragData.splitGroupState = SplitGroupState.draging;
                splitdragData.dragingMousePoint = new feng3d.Vector2(e.layerX, e.layerY);
                //
                var preElement = splitdragData.preElement;
                var nextElement = splitdragData.nextElement;
                var preElementRect = splitdragData.preElementRect = preElement.getTransformedBounds(this.stage);
                var nextElementRect = splitdragData.nextElementRect = nextElement.getTransformedBounds(this.stage);
                //
                var minX = preElementRect.left + ((<any>preElement).minWidth ? (<any>preElement).minWidth : 10);
                var maxX = nextElementRect.right - ((<any>nextElement).minWidth ? (<any>nextElement).minWidth : 10);
                var minY = preElementRect.top + ((<any>preElement).minHeight ? (<any>preElement).minHeight : 10);
                var maxY = nextElementRect.bottom - ((<any>nextElement).minHeight ? (<any>nextElement).minHeight : 10);
                splitdragData.dragRect = new egret.Rectangle(minX, minY, maxX - minX, maxY - minY);
            }
        }

        private onMouseUp(e: MouseEvent)
        {
            if (splitdragData.splitGroupState == SplitGroupState.draging)
            {
                splitdragData.splitGroupState = SplitGroupState.default;
                splitdragData.dragingMousePoint = null;
            }
        }
    }
}