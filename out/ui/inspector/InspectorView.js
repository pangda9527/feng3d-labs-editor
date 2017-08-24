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
         * 巡视界面
         * @author feng     2017-03-20
         */
        var InspectorView = (function (_super) {
            __extends(InspectorView, _super);
            function InspectorView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "InspectorViewSkin";
                return _this;
            }
            InspectorView.prototype.onComplete = function () {
                this.group.percentWidth = 100;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            InspectorView.prototype.onAddedToStage = function () {
                this.inspectorViewData = editor.editor3DData.inspectorViewData;
                this.inspectorViewData.on("change", this.onDataChange, this);
                this.backButton.addEventListener(editor.MouseEvent.CLICK, this.onBackClick, this);
            };
            InspectorView.prototype.onRemovedFromStage = function () {
                this.inspectorViewData.off("change", this.onDataChange, this);
                this.backButton.removeEventListener(editor.MouseEvent.CLICK, this.onBackClick, this);
                this.inspectorViewData = null;
            };
            InspectorView.prototype.onDataChange = function () {
                this.updateView();
            };
            InspectorView.prototype.updateView = function () {
                this.backButton.visible = this.inspectorViewData.hasBackData;
                if (this.view && this.view.parent) {
                    this.view.parent.removeChild(this.view);
                }
                if (this.inspectorViewData.viewData) {
                    this.view = objectview.getObjectView(this.inspectorViewData.viewData);
                    this.view.percentWidth = 100;
                    this.group.addChild(this.view);
                }
            };
            InspectorView.prototype.onBackClick = function () {
                this.inspectorViewData.back();
            };
            return InspectorView;
        }(eui.Component));
        editor.InspectorView = InspectorView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=InspectorView.js.map