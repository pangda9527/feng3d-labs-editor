namespace egret
{
    (() =>
    {
        document.body.oncontextmenu = function () { return false; }

        //给反射添加查找的空间
        feng3d.classUtils.addClassNameSpace("editor");
        feng3d.classUtils.addClassNameSpace("egret");
    })();

    //-----------------------------------------------------------

    (() =>
    {
        //调整默认字体大小
        egret.TextField.default_size = 12;

        // 扩展焦点在文本中时 禁止出发快捷键
        var oldfocusHandler = egret.InputController.prototype["focusHandler"];
        egret.InputController.prototype["focusHandler"] = function (event)
        {
            oldfocusHandler.call(this, event);
            feng3d.shortcut.enable = !this._isFocus;
        }

        var oldblurHandler = egret.InputController.prototype["blurHandler"];
        egret.InputController.prototype["blurHandler"] = function (event)
        {
            oldblurHandler.call(this, event);
            feng3d.shortcut.enable = !this._isFocus;
        }
    })();


    // (() =>
    // {
    //     // 扩展 TextInput , 焦点在文本中时，延缓外部通过text属性赋值到失去焦点时生效
    //     var descriptor = Object.getOwnPropertyDescriptor(eui.TextInput.prototype, "text");
    //     var oldTextSet = descriptor.set;
    //     descriptor.set = function (value)
    //     {
    //         if (this["isFocus"])
    //         {
    //             this["__temp_value__"] = value;
    //         }
    //         else
    //         {
    //             oldTextSet.call(this, value);
    //         }
    //     }
    //     Object.defineProperty(eui.TextInput.prototype, "text", descriptor);

    //     var oldFocusOutHandler = eui.TextInput.prototype["focusOutHandler"];
    //     eui.TextInput.prototype["focusOutHandler"] = function (event)
    //     {
    //         oldFocusOutHandler.call(this, event);
    //         if (this["__temp_value__"] != undefined)
    //         {
    //             this["text"] = this["__temp_value__"];
    //             delete this["__temp_value__"];
    //         }
    //     }

    // })();


    // 扩展 Scroller 组件，添加鼠标滚轮事件
    (() =>
    {
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
                scroller.viewport.scrollV = feng3d.FMath.clamp(scroller.viewport.scrollV + event.deltaY * 0.3, 0, scroller.viewport.contentHeight - scroller.height);
            }
        }
    })();

}