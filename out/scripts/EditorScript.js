"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 编辑器脚本
 */
var EditorScript = /** @class */ (function (_super) {
    __extends(EditorScript, _super);
    function EditorScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.flag = feng3d.RunEnvironment.editor;
        return _this;
    }
    return EditorScript;
}(feng3d.Behaviour));
exports.EditorScript = EditorScript;
//# sourceMappingURL=EditorScript.js.map