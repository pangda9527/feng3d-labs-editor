import { windowEventProxy, shortcut, IEvent, mathUtil } from 'feng3d';

export { };

// 扩展 Scroller 组件，添加鼠标滚轮事件
const oldOnAddToStage = eui.Scroller.prototype.$onAddToStage;
eui.Scroller.prototype.$onAddToStage = function (stage: egret.Stage, nestLevel: number): void
{
    oldOnAddToStage.call(this, stage, nestLevel);
    windowEventProxy.on('wheel', onMouseWheel, this);
};
const oldOnRemoveFromStage = eui.Scroller.prototype.$onRemoveFromStage;
eui.Scroller.prototype.$onRemoveFromStage = function (): void
{
    oldOnRemoveFromStage.call(this);
    windowEventProxy.off('wheel', onMouseWheel, this);
};

// 阻止拖拽滚动界面
const oldonTouchMove = eui.Scroller.prototype['onTouchMove'];
eui.Scroller.prototype['onTouchMove'] = function (event)
{
    if (shortcut.getState('disableScroll'))
        { return; }
    oldonTouchMove.call(this, event);
};

function onMouseWheel(event: IEvent<WheelEvent>)
{
    const scroller: eui.Scroller = this as any;
    if (scroller.hitTestPoint(windowEventProxy.clientX, windowEventProxy.clientY))
    {
        scroller.viewport.scrollV = mathUtil.clamp(scroller.viewport.scrollV + event.data.deltaY * 0.3, 0, Math.max(0, scroller.viewport.contentHeight - scroller.height));
    }
}
