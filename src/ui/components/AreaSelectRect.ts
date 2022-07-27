import { editorui } from '../../global/editorui';

/**
 * 区域选择框
 */
export class AreaSelectRect extends eui.Rect
{
    fillAlpha = 0.5;
    fillColor = 0x8888ff;

    /**
     * 显示
     * @param start 起始位置
     * @param end 结束位置
     */
    show(start: { x: number, y: number }, end: { x: number, y: number })
    {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        editorui.popupLayer.addChild(this);
    }

    /**
     * 隐藏
     */
    hide()
    {
        this.parent && this.parent.removeChild(this);
    }
}
