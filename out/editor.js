var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 编辑器
         * @author feng 2016-10-29
         */
        var Editor = (function (_super) {
            __extends(Editor, _super);
            function Editor() {
                var _this = _super.call(this) || this;
                //
                editor.editor3DData = new editor.Editor3DData();
                editor.editor3DData.projectRoot = "editorproject";
                //初始化配置
                editor.objectViewConfig();
                //
                new editor.EditorEnvironment();
                //初始化feng3d
                new editor.Main3D();
                feng3d.shortcut.addShortCuts(shortcutConfig);
                _this.addChild(new editor.MainUI());
                _this.once(egret.Event.ENTER_FRAME, function () {
                    //
                    editor.mouseEventEnvironment = new editor.MouseEventEnvironment();
                }, _this);
                _this.once(egret.Event.ADDED_TO_STAGE, _this._onAddToStage, _this);
                return _this;
                //             new FileObject("editor");
            }
            Editor.prototype._onAddToStage = function () {
                editor.editor3DData.stage = this.stage;
            };
            return Editor;
        }(eui.UILayer));
        editor.Editor = Editor;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Editor.js.map