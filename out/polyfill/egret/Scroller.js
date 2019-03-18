var egret;
(function (egret) {
    // 扩展 Scroller 组件，添加鼠标滚轮事件
    var oldOnAddToStage = eui.Scroller.prototype.$onAddToStage;
    eui.Scroller.prototype.$onAddToStage = function (stage, nestLevel) {
        oldOnAddToStage.call(this, stage, nestLevel);
        feng3d.windowEventProxy.on("wheel", onMouseWheel, this);
    };
    var oldOnRemoveFromStage = eui.Scroller.prototype.$onRemoveFromStage;
    eui.Scroller.prototype.$onRemoveFromStage = function () {
        oldOnRemoveFromStage.call(this);
        feng3d.windowEventProxy.off("wheel", onMouseWheel, this);
    };
    // 阻止拖拽滚动面板
    var oldonTouchMove = eui.Scroller.prototype["onTouchMove"];
    eui.Scroller.prototype["onTouchMove"] = function (event) {
        if (feng3d.shortcut.getState("disableScroll"))
            return;
        oldonTouchMove.call(this, event);
    };
    function onMouseWheel(event) {
        var scroller = this;
        if (scroller.hitTestPoint(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
            scroller.viewport.scrollV = feng3d.FMath.clamp(scroller.viewport.scrollV + event.deltaY * 0.3, 0, Math.max(0, scroller.viewport.contentHeight - scroller.height));
        }
    }
})(egret || (egret = {}));
//# sourceMappingURL=Scroller.js.map