import { globalEmitter, Rectangle, shortcut, Vector2, windowEventProxy } from 'feng3d';
import { editorui } from '../../global/editorui';
import { shortCutStates } from '../../polyfill/feng3d/ShortCut';
import { cursor } from '../drag/Cursor';
import { SplitGroup } from './SplitGroup';

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
    rect: Rectangle;
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
    preElementRect: Rectangle;
    nextElementRect: Rectangle;
    dragRect: Rectangle;
    dragingMousePoint: Vector2;
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
        const index = this.splitGroups.indexOf(splitGroup);
        if (index !== -1) this.splitGroups.splice(index, 1);
        if (this.splitGroups.length === 0)
        {
            editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onPick, this);
        }
    }

    private onPick(e: egret.MouseEvent)
    {
        if (this.state === SplitGroupState.draging) return;
        if (shortcut.getState(shortCutStates.draging)) return;
        if (shortcut.getState('inModal')) return;

        //
        const checkItems = this.getAllCheckItems();

        if (this.isdebug)
        {
            const s: egret.Sprite = this['a'] = this['a'] || new egret.Sprite();
            editorui.tooltipLayer.addChild(s);
            s.graphics.clear();
            s.graphics.beginFill(0xff0000);
            checkItems.forEach((v) =>
            {
                s.graphics.drawRect(v.rect.x, v.rect.y, v.rect.width, v.rect.height);
            });
            s.graphics.endFill();
        }
        else
        {
            const s: egret.Sprite = this['a'];
            if (s && s.parent) s.parent.removeChild(s);
        }

        checkItems.reverse();
        const result = checkItems.filter((v) => v.rect.contains(e.stageX, e.stageY));
        const checkItem = result[0];
        if (checkItem)
        {
            this.state = SplitGroupState.onSplit;
            shortcut.activityState('splitGroupDraging');
            //
            this.preElement = checkItem.splitGroup.getElementAt(checkItem.index);
            this.nextElement = checkItem.splitGroup.getElementAt(checkItem.index + 1);
            cursor.add(this, checkItem.splitGroup.layout instanceof eui.HorizontalLayout ? 'e-resize' : 'n-resize');

            //
            editorui.stage.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }
        else
        {
            splitManager.state = SplitGroupState.default;
            shortcut.deactivityState('splitGroupDraging');
            document.body.style.cursor = 'auto';
            cursor.clear(this);
            //
            editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }
        this.checkItem = checkItem;
    }

    private getAllCheckItems()
    {
        const checkItems: CheckItem[] = this.splitGroups.reduce((pv, cv) =>
        {
            cv.$children.reduce((pv0, cv0, ci) =>
            {
                if (ci === 0) return pv0;
                const item: CheckItem = { splitGroup: cv, index: ci - 1, rect: null };
                const elementRect = cv.$children[ci - 1].getGlobalBounds();
                if (cv.layout instanceof eui.HorizontalLayout)
                {
                    item.rect = new Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                }
                else
                {
                    item.rect = new Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
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
        windowEventProxy.on('mousemove', this.onDragMouseMove, this);
        windowEventProxy.on('mouseup', this.onDragMouseUp, this);

        const checkItem = this.checkItem;
        if (!checkItem) return;

        this.dragingMousePoint = new Vector2(e.stageX, e.stageY);
        //
        const preElement = this.preElement as eui.Group;
        const nextElement = this.nextElement as eui.Group;
        const preElementRect = this.preElementRect = preElement.getGlobalBounds();
        const nextElementRect = this.nextElementRect = nextElement.getGlobalBounds();
        //
        //
        const minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
        const maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
        const minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
        const maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
        this.dragRect = new Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

    /**
     * 拖拽分割
     */
    private onDragMouseMove()
    {
        const preElement = this.preElement;
        const nextElement = this.nextElement;

        const stageX = windowEventProxy.clientX;
        const stageY = windowEventProxy.clientY;

        const checkItem = this.checkItem;

        if (checkItem.splitGroup.layout instanceof eui.HorizontalLayout)
        {
            const layerX = Math.max(this.dragRect.left, Math.min(this.dragRect.right, stageX));
            const preElementWidth = this.preElementRect.width + (layerX - this.dragingMousePoint.x);
            const nextElementWidth = this.nextElementRect.width - (layerX - this.dragingMousePoint.x);

            (<eui.Component>preElement).percentWidth = preElementWidth / checkItem.splitGroup.width * 100;
            (<eui.Component>nextElement).percentWidth = nextElementWidth / checkItem.splitGroup.width * 100;
        }
        else if (checkItem.splitGroup.layout instanceof eui.VerticalLayout)
        {
            const layerY = Math.max(this.dragRect.top, Math.min(this.dragRect.bottom, stageY));
            const preElementHeight = this.preElementRect.height + (layerY - this.dragingMousePoint.y);
            const nextElementHeight = this.nextElementRect.height - (layerY - this.dragingMousePoint.y);

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

        windowEventProxy.off('mousemove', this.onDragMouseMove, this);
        windowEventProxy.off('mouseup', this.onDragMouseUp, this);

        globalEmitter.emit('viewLayout.changed');
    }
}

const splitManager = new SplitManager();
