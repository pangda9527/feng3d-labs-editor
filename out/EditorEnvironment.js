var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var EditorEnvironment = (function () {
            function EditorEnvironment() {
                this.init();
            }
            EditorEnvironment.prototype.init = function () {
                document.body.oncontextmenu = function () { return false; };
                //给反射添加查找的空间
                feng3d.ClassUtils.addClassNameSpace("feng3d.editor");
                feng3d.ClassUtils.addClassNameSpace("egret");
                //调整默认字体大小
                egret.TextField.default_size = 12;
                //解决TextInput.text绑定Number是不显示0的bug
                var p = eui.TextInput.prototype;
                var old = p["textDisplayAdded"];
                p["textDisplayAdded"] = function () {
                    old.call(this);
                    var values = this.$TextInput;
                    this.textDisplay.text = String(values[6 /* text */]);
                };
            };
            return EditorEnvironment;
        }());
        editor.EditorEnvironment = EditorEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=EditorEnvironment.js.map