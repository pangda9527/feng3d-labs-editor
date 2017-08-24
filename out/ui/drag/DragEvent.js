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
        /**
         * 拖拽事件
         * @author feng		2017-01-22
         */
        var DragEvent = (function (_super) {
            __extends(DragEvent, _super);
            /**
             * 构建拖拽事件
             * @param type						事件类型
             * @param dragInitiator				拖拽发起对象
             * @param dragSource				拖拽源
             * @param bubbles					是否冒泡
             * @param cancelable				能否取消事件传播
             */
            function DragEvent(type, dragInitiator, dragSource, bubbles, cancelable) {
                if (dragInitiator === void 0) { dragInitiator = null; }
                if (dragSource === void 0) { dragSource = null; }
                if (bubbles === void 0) { bubbles = false; }
                if (cancelable === void 0) { cancelable = false; }
                var _this = _super.call(this, type, bubbles) || this;
                _this.dragInitiator = dragInitiator;
                _this.dragSource = dragSource;
                return _this;
            }
            /**
             * 拖拽放下事件
             */
            DragEvent.DRAG_DROP = "dragDrop";
            /**
             * 拖入事件
             */
            DragEvent.DRAG_ENTER = "dragEnter";
            /**
             * 拖出事件
             */
            DragEvent.DRAG_EXIT = "dragExit";
            return DragEvent;
        }(egret.Event));
        editor.DragEvent = DragEvent;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=DragEvent.js.map