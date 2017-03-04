module feng3d.editor
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

            //解决TextInput.text绑定Number是不显示0的bug
            var p = eui.TextInput.prototype;
            var old = p["textDisplayAdded"];
            p["textDisplayAdded"] = function ()
            {
                old.call(this);
                var values = this.$TextInput;
                this.textDisplay.text = String(values[6 /* text */]);
            };
        }
    }
}