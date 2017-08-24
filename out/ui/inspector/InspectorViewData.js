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
         * 巡视界面数据
         * @author feng     2017-03-20
         */
        var InspectorViewData = (function (_super) {
            __extends(InspectorViewData, _super);
            function InspectorViewData(editor3DData) {
                var _this = _super.call(this) || this;
                _this.hasBackData = false;
                _this.viewDataList = [];
                eui.Watcher.watch(editor3DData, ["selectedObject"], _this.updateView, _this);
                return _this;
            }
            InspectorViewData.prototype.showData = function (data, removeBack) {
                if (removeBack === void 0) { removeBack = false; }
                if (this.viewData) {
                    this.viewDataList.push(this.viewData);
                }
                if (removeBack) {
                    this.viewDataList.length = 0;
                }
                this.hasBackData = this.viewDataList.length > 0;
                //
                this.viewData = data;
                this.dispatch("change");
            };
            InspectorViewData.prototype.back = function () {
                this.viewData = this.viewDataList.pop();
                this.hasBackData = this.viewDataList.length > 0;
                this.dispatch("change");
            };
            InspectorViewData.prototype.updateView = function () {
                this.showData(editor.editor3DData.selectedObject, true);
            };
            return InspectorViewData;
        }(feng3d.Event));
        editor.InspectorViewData = InspectorViewData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=InspectorViewData.js.map