import { windowEventProxy, Rectangle } from 'feng3d';
import { cursor } from '../drag/Cursor';

export class WindowView extends eui.Panel
{
    /**
     * 获取所属窗口
     *
     * @param view 窗口中的 contenGroup
     */
    static getWindow(contenGroup: egret.DisplayObject)
    {
        let p = contenGroup.parent;
        while (p && !(p instanceof WindowView))
        {
            p = p.parent;
        }
        const windowView = <WindowView>p;
        if (windowView && windowView.contenGroup === contenGroup)
        {
            return windowView;
        }

        return null;
    }

    public moveArea: eui.Group;
    public titleDisplay: eui.Label;
    public closeButton: eui.Button;
    public contenGroup: eui.Group;

    constructor()
    {
        super();
        this.skinName = 'WindowView';

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    private onAddedToStage()
    {
        windowEventProxy.on('mousemove', this.onMouseMove, this);
    }

    private onRemoveFromStage()
    {
        windowEventProxy.off('mousemove', this.onMouseMove, this);
    }

    private boundDragInfo = { type: -1, startX: 0, startY: 0, stage: null, rect: new Rectangle(), draging: false };
    private onMouseMove()
    {
        if (this.boundDragInfo.draging) return;

        const rect = this.getGlobalBounds();

        const stageX = this.stage.stageX;
        const stageY = this.stage.stageY;
        const size = 4;

        const leftRect = new Rectangle(rect.x, rect.y, size, rect.height);
        const rightRect = new Rectangle(rect.right - size, rect.y, size, rect.height);
        const bottomRect = new Rectangle(rect.x, rect.bottom - size, rect.width, size);
        this.boundDragInfo.type = -1;
        if (leftRect.contains(stageX, stageY))
        {
            this.boundDragInfo.type = 4;
        }
        else if (rightRect.contains(stageX, stageY))
        {
            this.boundDragInfo.type = 6;
        }
        else if (bottomRect.contains(stageX, stageY))
        {
            this.boundDragInfo.type = 2;
        }
        if (this.boundDragInfo.type !== -1)
        {
            this.stage.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            cursor.add(this, this.boundDragInfo.type === 2 ? 'n-resize' : 'e-resize');
        }
        else
        {
            cursor.clear(this);
            this.stage.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        }
    }

    private onMouseDown(e: egret.MouseEvent)
    {
        this.boundDragInfo.draging = true;
        this.boundDragInfo.startX = e.stageX;
        this.boundDragInfo.startY = e.stageY;
        this.boundDragInfo.stage = this.stage;
        this.boundDragInfo.rect = new Rectangle(this.x, this.y, this.width, this.height);

        windowEventProxy.on('mousemove', this.onBoundDrag, this);
        windowEventProxy.on('mouseup', this.onBoundDragEnd, this);
    }

    private onBoundDrag()
    {
        const offsetX = this.boundDragInfo.stage.stageX - this.boundDragInfo.startX;
        const offsetY = this.boundDragInfo.stage.stageY - this.boundDragInfo.startY;

        if (this.boundDragInfo.type === 4)
        {
            if (offsetX < this.boundDragInfo.rect.width)
            {
                this.x = this.boundDragInfo.rect.x + offsetX;
                this.width = this.boundDragInfo.rect.width - offsetX;
            }
        }
        else if (this.boundDragInfo.type === 6)
        {
            if (-offsetX < this.boundDragInfo.rect.width)
            {
                this.width = this.boundDragInfo.rect.width + offsetX;
            }
        }
        else if (this.boundDragInfo.type === 2)
        {
            if (-offsetY + 20 < this.boundDragInfo.rect.height)
            {
                this.height = this.boundDragInfo.rect.height + offsetY;
            }
        }
    }

    private onBoundDragEnd()
    {
        this.boundDragInfo.draging = false;
        windowEventProxy.off('mousemove', this.onBoundDrag, this);
        windowEventProxy.off('mouseup', this.onBoundDragEnd, this);
    }
}
