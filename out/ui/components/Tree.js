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
        function treeMap(treeNode, callback) {
            if (treeNode.children) {
                treeNode.children.forEach(function (element) {
                    callback(element, treeNode);
                    treeMap(element, callback);
                });
            }
        }
        var TreeCollection = (function (_super) {
            __extends(TreeCollection, _super);
            function TreeCollection(rootNode) {
                var _this = _super.call(this) || this;
                _this._rootNode = rootNode;
                return _this;
            }
            Object.defineProperty(TreeCollection.prototype, "length", {
                get: function () {
                    if (!this._rootNode || !this._rootNode.children)
                        return 0;
                    var len = 0;
                    treeMap(this._rootNode, function () {
                        len++;
                    });
                    return len;
                },
                enumerable: true,
                configurable: true
            });
            TreeCollection.prototype.getItemAt = function (index) {
                var currentIndex = 0;
                var item = null;
                treeMap(this._rootNode, function (node) {
                    if (currentIndex == index)
                        item = node;
                    currentIndex++;
                });
                return item;
            };
            TreeCollection.prototype.getItemIndex = function (item) {
                var itemIndex = -1;
                var currentIndex = 0;
                treeMap(this._rootNode, function (node) {
                    if (item == node)
                        itemIndex = currentIndex;
                    currentIndex++;
                });
                return itemIndex;
            };
            return TreeCollection;
        }(egret.EventDispatcher));
        editor.TreeCollection = TreeCollection;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Tree.js.map