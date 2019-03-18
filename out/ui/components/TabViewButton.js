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
var TabViewButton = /** @class */ (function (_super) {
    __extends(TabViewButton, _super);
    function TabViewButton() {
        var _this = _super.call(this) || this;
        _this.skinName = "TabViewButtonSkin";
        return _this;
    }
    TabViewButton.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    TabViewButton.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return TabViewButton;
}(eui.Button));
//# sourceMappingURL=TabViewButton.js.map