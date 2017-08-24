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
        var MainView = (function (_super) {
            __extends(MainView, _super);
            function MainView() {
                var _this = _super.call(this) || this;
                _this.watchers = [];
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "MainViewSkin";
                return _this;
            }
            MainView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            MainView.prototype.onAddedToStage = function () {
                this.moveButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.addEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.addEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.mainButton.addEventListener(editor.MouseEvent.CLICK, this.onMainButtonClick, this);
                //
                editor.createObject3DView = editor.createObject3DView || new editor.CreateObject3DView();
                this.watchers.push(eui.Watcher.watch(editor.editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this));
            };
            MainView.prototype.onRemovedFromStage = function () {
                this.moveButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.removeEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.removeEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.mainButton.removeEventListener(editor.MouseEvent.CLICK, this.onMainButtonClick, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
            };
            MainView.prototype.onMainButtonClick = function () {
                var globalPoint = this.mainButton.localToGlobal(0, 0);
                editor.createObject3DView.showView(mainMenuConfig, this.onMainMenu.bind(this), globalPoint);
            };
            MainView.prototype.onMainMenu = function (item) {
                editor.$editorEventDispatcher.dispatch(item.command);
            };
            MainView.prototype.onHelpButtonClick = function () {
                window.open("index.md");
            };
            MainView.prototype.onButtonClick = function (event) {
                switch (event.currentTarget) {
                    case this.moveButton:
                        editor.editor3DData.object3DOperationID = 0;
                        break;
                    case this.rotateButton:
                        editor.editor3DData.object3DOperationID = 1;
                        break;
                    case this.scaleButton:
                        editor.editor3DData.object3DOperationID = 2;
                        break;
                }
            };
            MainView.prototype.onObject3DOperationIDChange = function () {
                this.moveButton.selected = editor.editor3DData.object3DOperationID == 0;
                this.rotateButton.selected = editor.editor3DData.object3DOperationID == 1;
                this.scaleButton.selected = editor.editor3DData.object3DOperationID == 2;
            };
            return MainView;
        }(eui.Component));
        editor.MainView = MainView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=MainView.js.map