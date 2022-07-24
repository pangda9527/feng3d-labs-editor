
export class WindowView extends eui.Panel
{
    /**
     * 获取所属窗口
     * 
     * @param view 窗口中的 contenGroup
     */
    static getWindow(contenGroup: egret.DisplayObject)
    {
        var p = contenGroup.parent;
        while (p && !(p instanceof WindowView))
        {
            p = p.parent;
        }
        var windowView = <WindowView>p;
        if (windowView && windowView.contenGroup == contenGroup)
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
        this.skinName = "WindowView";

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    private onAddedToStage()
    {
        feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
    }

    private onRemoveFromStage()
    {
        feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
    }

    private boundDragInfo = { type: -1, startX: 0, startY: 0, stage: null, rect: new feng3d.Rectangle(), draging: false };
    private onMouseMove()
    {
        if (this.boundDragInfo.draging) return;

        var rect = this.getGlobalBounds();

        var stageX = this.stage.stageX;
        var stageY = this.stage.stageY;
        var size = 4;

        var leftRect = new feng3d.Rectangle(rect.x, rect.y, size, rect.height);
        var rightRect = new feng3d.Rectangle(rect.right - size, rect.y, size, rect.height);
        var bottomRect = new feng3d.Rectangle(rect.x, rect.bottom - size, rect.width, size);
        this.boundDragInfo.type = -1;
        if (leftRect.contains(stageX, stageY))
        {
            this.boundDragInfo.type = 4;
        } else if (rightRect.contains(stageX, stageY))
        {
            this.boundDragInfo.type = 6;
        } else if (bottomRect.contains(stageX, stageY))
        {
            this.boundDragInfo.type = 2;
        }
        if (this.boundDragInfo.type != -1)
        {
            this.stage.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            cursor.add(this, this.boundDragInfo.type == 2 ? "n-resize" : "e-resize");
        } else
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
        this.boundDragInfo.rect = new feng3d.Rectangle(this.x, this.y, this.width, this.height);

        feng3d.windowEventProxy.on("mousemove", this.onBoundDrag, this);
        feng3d.windowEventProxy.on("mouseup", this.onBoundDragEnd, this);
    }

    private onBoundDrag()
    {
        var offsetX = this.boundDragInfo.stage.stageX - this.boundDragInfo.startX;
        var offsetY = this.boundDragInfo.stage.stageY - this.boundDragInfo.startY;

        if (this.boundDragInfo.type == 4)
        {
            if (offsetX < this.boundDragInfo.rect.width)
            {
                this.x = this.boundDragInfo.rect.x + offsetX;
                this.width = this.boundDragInfo.rect.width - offsetX;
            }
        } else if (this.boundDragInfo.type == 6)
        {
            if (-offsetX < this.boundDragInfo.rect.width)
            {
                this.width = this.boundDragInfo.rect.width + offsetX;
            }
        } else if (this.boundDragInfo.type == 2)
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
        feng3d.windowEventProxy.off("mousemove", this.onBoundDrag, this);
        feng3d.windowEventProxy.off("mouseup", this.onBoundDragEnd, this);
    }
}
