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
        var Editor3DEvent = (function (_super) {
            __extends(Editor3DEvent, _super);
            function Editor3DEvent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Editor3DEvent;
        }(feng3d.Event));
        editor.Editor3DEvent = Editor3DEvent;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Editor3DEvent.js.map