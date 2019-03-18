var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./ui/MainUI", "./global/editorui", "./ui/MainView", "./caches/Editorcache", "./assets/EditorRS", "./feng3d/Main3D", "./shortcut/Editorshortcut", "./global/EditorData"], function (require, exports, MainUI_1, editorui_1, MainView_1, Editorcache_1, EditorRS_1, Main3D_1, Editorshortcut_1, EditorData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * feng3d的版本号
     */
    exports.revision = "2018.08.22";
    feng3d.log("editor version " + exports.revision);
    /**
     * 编辑器
     */
    var Editor = /** @class */ (function (_super) {
        __extends(Editor, _super);
        function Editor() {
            var _this = _super.call(this) || this;
            // giteeOauth.oauth();
            var mainui = new MainUI_1.MainUI(function () {
                editorui_1.editorui.stage = _this.stage;
                //
                var tooltipLayer = new eui.UILayer();
                tooltipLayer.touchEnabled = false;
                _this.stage.addChild(tooltipLayer);
                editorui_1.editorui.tooltipLayer = tooltipLayer;
                //
                var popupLayer = new eui.UILayer();
                popupLayer.touchEnabled = false;
                _this.stage.addChild(popupLayer);
                editorui_1.editorui.popupLayer = popupLayer;
                Editorcache_1.editorcache.projectname = Editorcache_1.editorcache.projectname || "newproject";
                EditorRS_1.editorRS.initproject(function () {
                    setTimeout(function () {
                        _this.init();
                    }, 1);
                });
                _this.removeChild(mainui);
            });
            _this.addChild(mainui);
            return _this;
        }
        Editor.prototype.init = function () {
            document.head.getElementsByTagName("title")[0].innerText = "feng3d-editor -- " + Editorcache_1.editorcache.projectname;
            Editorcache_1.editorcache.setLastProject(Editorcache_1.editorcache.projectname);
            this.initMainView();
            //初始化feng3d
            new Main3D_1.Main3D();
            feng3d.shortcut.addShortCuts(shortcutConfig);
            new Editorshortcut_1.Editorshortcut();
            this.once(egret.Event.ENTER_FRAME, function () {
                //
                egret.mouseEventEnvironment();
            }, this);
            this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        };
        Editor.prototype.initMainView = function () {
            //
            this.mainView = new MainView_1.MainView();
            this.stage.addChildAt(this.mainView, 1);
            this.onresize();
            window.onresize = this.onresize.bind(this);
            editorui_1.editorui.mainview = this.mainView;
        };
        Editor.prototype.onresize = function () {
            this.stage.setContentSize(window.innerWidth, window.innerHeight);
            this.mainView.width = this.stage.stageWidth;
            this.mainView.height = this.stage.stageHeight;
        };
        Editor.prototype._onAddToStage = function () {
            EditorData_1.editorData.stage = this.stage;
        };
        return Editor;
    }(eui.UILayer));
    exports.Editor = Editor;
    window["Editor"] = Editor;
});
//# sourceMappingURL=Editor.js.map