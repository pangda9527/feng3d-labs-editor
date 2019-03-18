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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerrainView = /** @class */ (function (_super) {
        __extends(TerrainView, _super);
        function TerrainView() {
            var _this = _super.call(this) || this;
            _this.skinName = "TerrainView";
            return _this;
        }
        TerrainView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.updateView();
        };
        TerrainView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
        };
        TerrainView.prototype.updateView = function () {
            if (!this.stage)
                return;
        };
        return TerrainView;
    }(eui.Component));
    exports.TerrainView = TerrainView;
});
//# sourceMappingURL=TerrainView.js.map