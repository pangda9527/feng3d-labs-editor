define(["require", "exports", "../assets/AssetNode"], function (require, exports, AssetNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 检查器多对象
     *
     * 处理多个对象在检查器中显示问题
     */
    var InspectorMultiObject = /** @class */ (function () {
        function InspectorMultiObject() {
        }
        InspectorMultiObject.prototype.convertInspectorObject = function (objects) {
            if (objects.length == 0)
                return 0;
            if (objects.length == 1)
                return objects[0];
            var data = {};
            objects.forEach(function (element) {
                if (element instanceof AssetNode_1.AssetNode) {
                    element = element.asset;
                }
                var type = feng3d.classUtils.getQualifiedClassName(element);
                var list = data[type] = data[type] || [];
                list.push(element);
            });
            var l = [];
            for (var type in data) {
                var element = data[type];
                l.push(element.length + " " + type);
            }
            l.unshift(objects.length + " Objects\n");
            return l.join("\n\t");
        };
        return InspectorMultiObject;
    }());
    exports.InspectorMultiObject = InspectorMultiObject;
    exports.inspectorMultiObject = new InspectorMultiObject();
});
//# sourceMappingURL=InspectorMultiObject.js.map