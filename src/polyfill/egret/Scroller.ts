namespace egret
{
    // 扩展 Scroller 组件，添加鼠标滚轮事件
    var oldOnAddToStage = eui.Scroller.prototype.$onAddToStage;
    eui.Scroller.prototype.$onAddToStage = function (stage: egret.Stage, nestLevel: number): void
    {
        oldOnAddToStage.call(this, stage, nestLevel);
        feng3d.windowEventProxy.on("wheel", onMouseWheel, this);
    }
    var oldOnRemoveFromStage = eui.Scroller.prototype.$onRemoveFromStage;
    eui.Scroller.prototype.$onRemoveFromStage = function (): void
    {
        oldOnRemoveFromStage.call(this);
        feng3d.windowEventProxy.off("wheel", onMouseWheel, this);
    }

    // 阻止拖拽滚动面板
    var oldonTouchMove = eui.Scroller.prototype["onTouchMove"];
    eui.Scroller.prototype["onTouchMove"] = function (event)
    {
        if (feng3d.shortcut.getState("disableScroll"))
            return;
        oldonTouchMove.call(this, event);
    }

    function onMouseWheel(event: WheelEvent)
    {
        var scroller: eui.Scroller = this;
        if (scroller.hitTestPoint(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
        {
            scroller.viewport.scrollV = Math.clamp(scroller.viewport.scrollV + event.deltaY * 0.3, 0, Math.max(0, scroller.viewport.contentHeight - scroller.height));
        }
    }

}