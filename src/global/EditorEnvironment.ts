namespace feng3d.editor
{

    export class EditorEnvironment
    {
        constructor()
        {
            this.init();
        }

        private init()
        {
            document.body.oncontextmenu = function () { return false; }

            //给反射添加查找的空间
            ClassUtils.addClassNameSpace("feng3d.editor");
            ClassUtils.addClassNameSpace("egret");

            //调整默认字体大小
            egret.TextField.default_size = 12;

            var oldfocusHandler = egret.InputController.prototype["focusHandler"];
            egret.InputController.prototype["focusHandler"] = function (event)
            {
                oldfocusHandler.call(this, event);
                shortcut.enable = !this._isFocus;
            }
            
            var oldblurHandler = egret.InputController.prototype["blurHandler"];
            egret.InputController.prototype["blurHandler"] = function (event)
            {
                oldblurHandler.call(this, event);
                shortcut.enable = !this._isFocus;
            }
        }
    }
}