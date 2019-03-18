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
var TabView = /** @class */ (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        return _super.call(this) || this;
    }
    TabView.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    TabView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return TabView;
}(eui.Component));
//# sourceMappingURL=TabView.js.map