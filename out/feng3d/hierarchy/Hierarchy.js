var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./HierarchyNode", "../../global/EditorData"], function (require, exports, HierarchyNode_1, EditorData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Hierarchy = /** @class */ (function () {
        function Hierarchy() {
            this._selectedGameObjects = [];
            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
        }
        /**
         * 获取选中结点
         */
        Hierarchy.prototype.getSelectedNode = function () {
            var _this = this;
            var node = EditorData_1.editorData.selectedGameObjects.reduce(function (pv, cv) { pv = pv || _this.getNode(cv); return pv; }, null);
            return node;
        };
        /**
         * 获取结点
         */
        Hierarchy.prototype.getNode = function (gameObject) {
            var node = nodeMap.get(gameObject);
            return node;
        };
        Hierarchy.prototype.delete = function (gameobject) {
            var node = nodeMap.get(gameobject);
            if (node) {
                node.destroy();
                nodeMap.delete(gameobject);
            }
        };
        /**
         * 添加游戏对象到层级树
         *
         * @param gameobject 游戏对象
         */
        Hierarchy.prototype.addGameObject = function (gameobject) {
            var selectedNode = this.getSelectedNode();
            if (selectedNode)
                selectedNode.gameobject.addChild(gameobject);
            else
                this.rootnode.gameobject.addChild(gameobject);
            EditorData_1.editorData.selectObject(gameobject);
        };
        Hierarchy.prototype.addGameoObjectFromAsset = function (gameobject, parent) {
            gameobject = feng3d.serialization.clone(gameobject);
            if (parent)
                parent.addChild(gameobject);
            else
                this.rootnode.gameobject.addChild(gameobject);
            EditorData_1.editorData.selectObject(gameobject);
        };
        Hierarchy.prototype.rootGameObjectChanged = function (property, oldValue, newValue) {
            if (oldValue) {
                oldValue.off("addChild", this.ongameobjectadded, this);
                oldValue.off("removeChild", this.ongameobjectremoved, this);
            }
            if (newValue) {
                this.init(newValue);
                newValue.on("addChild", this.ongameobjectadded, this);
                newValue.on("removeChild", this.ongameobjectremoved, this);
            }
        };
        Hierarchy.prototype.onSelectedGameObjectChanged = function () {
            var _this = this;
            this._selectedGameObjects.forEach(function (element) {
                var node = _this.getNode(element);
                if (node)
                    node.selected = false;
                else
                    debugger; // 为什么为空，是否被允许？
            });
            this._selectedGameObjects = EditorData_1.editorData.selectedGameObjects.concat();
            this._selectedGameObjects.forEach(function (element) {
                var node = _this.getNode(element);
                node.selected = true;
                node.openParents();
            });
        };
        Hierarchy.prototype.ongameobjectadded = function (event) {
            this.add(event.data);
        };
        Hierarchy.prototype.ongameobjectremoved = function (event) {
            var node = nodeMap.get(event.data);
            this.remove(node);
        };
        Hierarchy.prototype.init = function (gameobject) {
            var _this = this;
            if (this.rootnode)
                this.rootnode.destroy();
            nodeMap.clear();
            var node = new HierarchyNode_1.HierarchyNode({ gameobject: gameobject });
            nodeMap.set(gameobject, node);
            node.isOpen = true;
            this.rootnode = node;
            gameobject.children.forEach(function (element) {
                _this.add(element);
            });
        };
        Hierarchy.prototype.add = function (gameobject) {
            var _this = this;
            if (gameobject.hideFlags & feng3d.HideFlags.HideInHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node) {
                node.remove();
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode) {
                if (!node) {
                    node = new HierarchyNode_1.HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                parentnode.addChild(node);
            }
            gameobject.children.forEach(function (element) {
                _this.add(element);
            });
            return node;
        };
        Hierarchy.prototype.remove = function (node) {
            var _this = this;
            if (!node)
                return;
            node.children.forEach(function (element) {
                _this.remove(element);
            });
            node.remove();
        };
        __decorate([
            feng3d.watch("rootGameObjectChanged")
        ], Hierarchy.prototype, "rootGameObject", void 0);
        return Hierarchy;
    }());
    exports.Hierarchy = Hierarchy;
    var nodeMap = new Map();
    exports.hierarchy = new Hierarchy();
});
//# sourceMappingURL=Hierarchy.js.map