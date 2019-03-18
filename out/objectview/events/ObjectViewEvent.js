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
var feng3d;
(function (feng3d) {
    var ObjectViewEvent = /** @class */ (function (_super) {
        __extends(ObjectViewEvent, _super);
        function ObjectViewEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObjectViewEvent.VALUE_CHANGE = "valuechange";
        return ObjectViewEvent;
    }(egret.Event));
    feng3d.ObjectViewEvent = ObjectViewEvent;
})(feng3d || (feng3d = {}));
//# sourceMappingURL=ObjectViewEvent.js.map