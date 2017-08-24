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
        var CreateObject3DView = (function (_super) {
            __extends(CreateObject3DView, _super);
            function CreateObject3DView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "CreateObject3DViewSkin";
                return _this;
            }
            CreateObject3DView.prototype.showView = function (data, selectedCallBack, globalPoint) {
                if (globalPoint === void 0) { globalPoint = null; }
                this._dataProvider.replaceAll(data.concat());
                this._selectedCallBack = selectedCallBack;
                globalPoint = globalPoint || new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.x = globalPoint.x;
                this.y = globalPoint.y;
                editor.editor3DData.stage.addChild(this);
            };
            CreateObject3DView.prototype.onComplete = function () {
                this._dataProvider = new eui.ArrayCollection();
                this.object3dList.dataProvider = this._dataProvider;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            CreateObject3DView.prototype.onAddedToStage = function () {
                var gP = this.localToGlobal(0, 0);
                this.maskSprite.x = -gP.x;
                this.maskSprite.y = -gP.y;
                this.maskSprite.width = this.stage.stageWidth;
                this.maskSprite.height = this.stage.stageHeight;
                this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
                this.maskSprite.addEventListener(editor.MouseEvent.CLICK, this.maskMouseDown, this);
            };
            CreateObject3DView.prototype.onRemovedFromStage = function () {
                this.object3dList.removeEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
                this.maskSprite.removeEventListener(editor.MouseEvent.CLICK, this.maskMouseDown, this);
            };
            CreateObject3DView.prototype.onObject3dListChange = function () {
                this._selectedCallBack(this.object3dList.selectedItem);
                this.object3dList.selectedIndex = -1;
                this.parent && this.parent.removeChild(this);
            };
            CreateObject3DView.prototype.maskMouseDown = function () {
                this.parent && this.parent.removeChild(this);
            };
            return CreateObject3DView;
        }(eui.Component));
        editor.CreateObject3DView = CreateObject3DView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=CreateObject3DView.js.map