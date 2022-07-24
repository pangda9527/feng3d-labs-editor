import { SplitUIComponent } from './SplitUIComponent';

/**
 * 分割组，提供鼠标拖拽改变组内对象分割尺寸
 * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
 */
export class SplitGroup extends eui.Group
{
    constructor()
    {
        super();
        new SplitUIComponent().init(this);
    }
}
