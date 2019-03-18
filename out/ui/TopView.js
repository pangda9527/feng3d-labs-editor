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
define(["require", "exports", "./components/Menu", "../configs/CommonConfig", "../global/EditorData", "../assets/EditorRS", "../feng3d/Main3D", "../caches/Editorcache"], function (require, exports, Menu_1, CommonConfig_1, EditorData_1, EditorRS_1, Main3D_1, Editorcache_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopView = /** @class */ (function (_super) {
        __extends(TopView, _super);
        function TopView() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "TopView";
            return _this;
        }
        TopView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        TopView.prototype.onAddedToStage = function () {
            this.mainButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.moveButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.rotateButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.scaleButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.worldButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.centerButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.playBtn.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.helpButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.settingButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.qrcodeButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            feng3d.dispatcher.on("editor.toolTypeChanged", this.updateview, this);
            this.updateview();
        };
        TopView.prototype.onRemovedFromStage = function () {
            this.mainButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.moveButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.rotateButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.scaleButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.worldButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.centerButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.playBtn.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.helpButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.settingButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.qrcodeButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            feng3d.dispatcher.off("editor.toolTypeChanged", this.updateview, this);
            if (runwin)
                runwin.close();
            runwin = null;
        };
        TopView.prototype.onHelpButtonClick = function () {
            window.open("http://feng3d.com");
        };
        TopView.prototype.onButtonClick = function (event) {
            switch (event.currentTarget) {
                case this.mainButton:
                    Menu_1.menu.popup(CommonConfig_1.menuConfig.getMainMenu());
                    break;
                case this.moveButton:
                    EditorData_1.editorData.toolType = EditorData_1.MRSToolType.MOVE;
                    break;
                case this.rotateButton:
                    EditorData_1.editorData.toolType = EditorData_1.MRSToolType.ROTATION;
                    break;
                case this.scaleButton:
                    EditorData_1.editorData.toolType = EditorData_1.MRSToolType.SCALE;
                    break;
                case this.worldButton:
                    EditorData_1.editorData.isWoldCoordinate = !EditorData_1.editorData.isWoldCoordinate;
                    break;
                case this.centerButton:
                    EditorData_1.editorData.isBaryCenter = !EditorData_1.editorData.isBaryCenter;
                    break;
                case this.playBtn:
                    feng3d.dispatcher.dispatch("inspector.saveShowData", function () {
                        EditorRS_1.editorRS.fs.writeObject("default.scene.json", Main3D_1.engine.scene.gameObject, function (err) {
                            if (err) {
                                feng3d.warn(err);
                                return;
                            }
                            if (EditorRS_1.editorRS.fs.type == feng3d.FSType.indexedDB) {
                                if (runwin)
                                    runwin.close();
                                runwin = window.open("run.html?fstype=" + feng3d.fs.type + "&project=" + Editorcache_1.editorcache.projectname);
                                return;
                            }
                            var path = EditorRS_1.editorRS.fs.getAbsolutePath("index.html");
                            if (runwin)
                                runwin.close();
                            runwin = window.open(path);
                        });
                    });
                    break;
                case this.qrcodeButton:
                    setTimeout(function () {
                        $('#output').show();
                    }, 10);
                    break;
            }
        };
        TopView.prototype.updateview = function () {
            this.moveButton.selected = EditorData_1.editorData.toolType == EditorData_1.MRSToolType.MOVE;
            this.rotateButton.selected = EditorData_1.editorData.toolType == EditorData_1.MRSToolType.ROTATION;
            this.scaleButton.selected = EditorData_1.editorData.toolType == EditorData_1.MRSToolType.SCALE;
            this.worldButton.selected = !EditorData_1.editorData.isWoldCoordinate;
            this.centerButton.selected = EditorData_1.editorData.isBaryCenter;
        };
        return TopView;
    }(eui.Component));
    exports.TopView = TopView;
    // 运行窗口
    var runwin;
    window.addEventListener("beforeunload", function () {
        if (runwin)
            runwin.close();
    });
});
//# sourceMappingURL=TopView.js.map