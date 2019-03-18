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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var editor;
(function (editor) {
    var OAVObjectView = /** @class */ (function (_super) {
        __extends(OAVObjectView, _super);
        function OAVObjectView(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OVDefault";
            return _this;
        }
        OAVObjectView.prototype.initView = function () {
            var _this = this;
            var arr = [];
            if (this.attributeValue instanceof Array)
                arr = this.attributeValue;
            else
                arr.push(this.attributeValue);
            this.views = [];
            arr.forEach(function (element) {
                var editable = _this._attributeViewInfo.editable;
                if (element instanceof feng3d.Feng3dObject)
                    editable = editable && !Boolean(element.hideFlags & feng3d.HideFlags.NotEditable);
                var view = feng3d.objectview.getObjectView(element, { editable: editable });
                view.percentWidth = 100;
                _this.group.addChild(view);
                _this.views.push(view);
                if (element instanceof feng3d.EventDispatcher) {
                    element.on("refreshView", _this.onRefreshView, _this);
                }
            });
        };
        OAVObjectView.prototype.updateView = function () {
        };
        /**
         * 销毁
         */
        OAVObjectView.prototype.dispose = function () {
            var _this = this;
            this.views.forEach(function (element) {
                _this.group.removeChild(element);
                if (element.space instanceof feng3d.EventDispatcher) {
                    element.space.on("refreshView", _this.onRefreshView, _this);
                }
            });
            this.views.length = 0;
        };
        OAVObjectView.prototype.onRefreshView = function (event) {
            this.dispose();
            this.initView();
        };
        OAVObjectView = __decorate([
            feng3d.OAVComponent()
        ], OAVObjectView);
        return OAVObjectView;
    }(OAVBase));
    editor.OAVObjectView = OAVObjectView;
})(editor || (editor = {}));
//# sourceMappingURL=OAVObjectView.js.map