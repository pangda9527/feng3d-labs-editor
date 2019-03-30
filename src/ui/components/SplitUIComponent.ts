namespace editor
{
    /**
     * 可拆分UI组件
     */
    export class SplitUIComponent
    {
        private splitGroup: SplitGroup;

        init(splitGroup: SplitGroup)
        {
            this.splitGroup = splitGroup;

            this.splitGroup.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.splitGroup.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.splitGroup.stage)
            {
                this.onAddedToStage();
            }
        }

        /**
         * 销毁
         */
        dispose()
        {
            if (this.splitGroup.stage)
            {
                this.onRemovedFromStage();
            }
            this.splitGroup = null;
        }

        private onAddedToStage()
        {
            splitManager.addSplitGroup(this.splitGroup);
        }

        private onRemovedFromStage()
        {
            splitManager.removeSplitGroup(this.splitGroup);
        }
    }

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

    interface CheckItem
    {
        splitGroup: SplitGroup;
        index: number;
        rect: feng3d.Rectangle;
    }

    /**
     * 可拆分UI组件管理器
     */
    class SplitManager
    {
        isdebug = false;

        /**
         * 状态
         */
        state = SplitGroupState.default;

        checkItem: CheckItem;
        preElement: egret.DisplayObject;
        nextElement: egret.DisplayObject;
        preElementRect: egret.Rectangle;
        nextElementRect: egret.Rectangle;
        dragRect: egret.Rectangle;
        dragingMousePoint: feng3d.Vector2;
        //
        private splitGroups: SplitGroup[] = [];

        addSplitGroup(splitGroup: SplitGroup)
        {
            this.splitGroups.push(splitGroup);
            if (this.splitGroups.length > 0)
            {
                editorui.stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onPick, this);
            }
        }

        removeSplitGroup(splitGroup: SplitGroup)
        {
            var index = this.splitGroups.indexOf(splitGroup);
            if (index != -1) this.splitGroups.splice(index, 1);
            if (this.splitGroups.length == 0)
            {
                editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onPick, this);
            }
        }

        private onPick(e: egret.MouseEvent)
        {
            if (this.state == SplitGroupState.draging) return;
            if (feng3d.shortcut.getState(feng3d.shortCutStates.draging)) return;

            //
            let checkItems = this.getAllCheckItems();

            if (this.isdebug)
            {
                let s: egret.Sprite = this["a"] = this["a"] || new egret.Sprite();
                editorui.tooltipLayer.addChild(s);
                s.graphics.clear();
                s.graphics.beginFill(0xff0000);
                checkItems.forEach(v =>
                {
                    s.graphics.drawRect(v.rect.x, v.rect.y, v.rect.width, v.rect.height);
                });
                s.graphics.endFill();
            } else
            {
                let s: egret.Sprite = this["a"];
                if (s && s.parent) s.parent.removeChild(s);
            }

            checkItems.reverse();
            let result = checkItems.filter(v => { return v.rect.contains(e.stageX, e.stageY); });
            var checkItem = result[0];
            if (checkItem)
            {
                this.state = SplitGroupState.onSplit;
                feng3d.shortcut.activityState("splitGroupDraging");
                //
                this.preElement = checkItem.splitGroup.getElementAt(checkItem.index);
                this.nextElement = checkItem.splitGroup.getElementAt(checkItem.index + 1);
                document.body.style.cursor = checkItem.splitGroup.layout instanceof eui.HorizontalLayout ? "e-resize" : "n-resize";
                //
                editorui.stage.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            } else
            {
                splitManager.state = SplitGroupState.default;
                feng3d.shortcut.deactivityState("splitGroupDraging");
                document.body.style.cursor = "auto";
                //
                editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            }
            this.checkItem = checkItem;
        }

        private getAllCheckItems()
        {
            var checkItems: CheckItem[] = this.splitGroups.reduce((pv, cv) =>
            {
                cv.$children.reduce((pv0, cv0, ci) =>
                {
                    if (ci == 0) return pv0;
                    var item: CheckItem = { splitGroup: cv, index: ci - 1, rect: null };
                    var elementRect = getGlobalBounds(cv.$children[ci - 1]);
                    if (cv.layout instanceof eui.HorizontalLayout)
                    {
                        item.rect = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                    } else
                    {
                        item.rect = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                    }
                    pv0.push(item);
                    return pv0;
                }, pv);
                return pv;
            }, []);
            return checkItems;
        }

        private onMouseDown(e: egret.MouseEvent)
        {
            this.state = SplitGroupState.draging;

            // 拖拽分割
            feng3d.windowEventProxy.on("mousemove", this.onDragMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onDragMouseUp, this);

            var checkItem = this.checkItem;
            if (!checkItem) return;

            this.dragingMousePoint = new feng3d.Vector2(e.stageX, e.stageY);
            //
            var preElement = <eui.Group>this.preElement;
            var nextElement = <eui.Group>this.nextElement;
            var preElementRect = this.preElementRect = getGlobalBounds(preElement);
            var nextElementRect = this.nextElementRect = getGlobalBounds(nextElement);
            //
            //
            var minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
            var maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
            var minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
            var maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
            this.dragRect = new egret.Rectangle(minX, minY, maxX - minX, maxY - minY);
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

            var checkItem = this.checkItem;

            if (checkItem.splitGroup.layout instanceof eui.HorizontalLayout)
            {
                var layerX = Math.max(this.dragRect.left, Math.min(this.dragRect.right, stageX));
                var preElementWidth = this.preElementRect.width + (layerX - this.dragingMousePoint.x);
                var nextElementWidth = this.nextElementRect.width - (layerX - this.dragingMousePoint.x);

                (<eui.Component>preElement).percentWidth = preElementWidth / checkItem.splitGroup.width * 100;
                (<eui.Component>nextElement).percentWidth = nextElementWidth / checkItem.splitGroup.width * 100;
            } else if (checkItem.splitGroup.layout instanceof eui.VerticalLayout)
            {
                var layerY = Math.max(this.dragRect.top, Math.min(this.dragRect.bottom, stageY));
                var preElementHeight = this.preElementRect.height + (layerY - this.dragingMousePoint.y);
                var nextElementHeight = this.nextElementRect.height - (layerY - this.dragingMousePoint.y);

                (<eui.Component>preElement).percentHeight = preElementHeight / checkItem.splitGroup.height * 100;
                (<eui.Component>nextElement).percentHeight = nextElementHeight / checkItem.splitGroup.height * 100;
            }
        }

        /**
         * 停止拖拽
         */
        private onDragMouseUp()
        {
            this.state = SplitGroupState.default;
            this.dragingMousePoint = null;
            this.checkItem = null;

            feng3d.windowEventProxy.off("mousemove", this.onDragMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onDragMouseUp, this);

            feng3d.dispatcher.dispatch("viewLayout.changed");
        }
    }

    function getGlobalBounds(displayObject: egret.DisplayObject)
    {
        var min = displayObject.localToGlobal();
        var max = displayObject.localToGlobal(displayObject.width, displayObject.height);
        return new egret.Rectangle(min.x, min.y, max.x - min.x, max.y - min.y);
    }

    var splitManager = new SplitManager();
}