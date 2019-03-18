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
    /**
     * 默认对象属性界面
     */
    var OAVMultiText = /** @class */ (function (_super) {
        __extends(OAVMultiText, _super);
        function OAVMultiText(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMultiText";
            return _this;
        }
        OAVMultiText.prototype.initView = function () {
            if (this._attributeViewInfo.editable)
                feng3d.watcher.watch(this.space, this._attributeName, this.updateView, this);
        };
        OAVMultiText.prototype.dispose = function () {
            feng3d.watcher.unwatch(this.space, this._attributeName, this.updateView, this);
        };
        OAVMultiText.prototype.updateView = function () {
            this.txtLab.text = this.attributeValue;
        };
        OAVMultiText = __decorate([
            feng3d.OAVComponent()
        ], OAVMultiText);
        return OAVMultiText;
    }(OAVBase));
    editor.OAVMultiText = OAVMultiText;
})(editor || (editor = {}));
//# sourceMappingURL=OAVMultiText.js.map