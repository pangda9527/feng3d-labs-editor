define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    eui.Component.prototype["addBinder"] = function () {
        var _this = this;
        var binders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            binders[_i] = arguments[_i];
        }
        this._binders = this._binders || [];
        binders.forEach(function (v) {
            _this._binders.push(v);
        });
    };
    var old$onRemoveFromStage = eui.Component.prototype.$onRemoveFromStage;
    eui.Component.prototype["$onRemoveFromStage"] = function () {
        if (this._binders) {
            this._binders.forEach(function (v) { return v.dispose(); });
            this._binders.length = 0;
        }
        old$onRemoveFromStage.call(this);
    };
});
//# sourceMappingURL=Component.js.map