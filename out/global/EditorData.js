define(["require", "exports", "../ui/assets/AssetNode"], function (require, exports, AssetNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 游戏对象控制器类型
     */
    var MRSToolType;
    (function (MRSToolType) {
        /**
         * 移动
         */
        MRSToolType[MRSToolType["MOVE"] = 0] = "MOVE";
        /**
         * 旋转
         */
        MRSToolType[MRSToolType["ROTATION"] = 1] = "ROTATION";
        /**
         * 缩放
         */
        MRSToolType[MRSToolType["SCALE"] = 2] = "SCALE";
    })(MRSToolType = exports.MRSToolType || (exports.MRSToolType = {}));
    /**
     * 编辑器数据
     */
    var EditorData = /** @class */ (function () {
        function EditorData() {
            this._selectedObjects = [];
            this._toolType = MRSToolType.MOVE;
            this._selectedGameObjects = [];
            this._selectedGameObjectsInvalid = true;
            this._isBaryCenter = true;
            this._isWoldCoordinate = false;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._selectedAssetNodes = [];
        }
        Object.defineProperty(EditorData.prototype, "selectedObjects", {
            /**
             * 选中对象，游戏对象与资源文件列表
             * 选中对象时尽量使用 selectObject 方法设置选中对象
             */
            get: function () {
                return this._selectedObjects;
            },
            enumerable: true,
            configurable: true
        });
        EditorData.prototype.clearSelectedObjects = function () {
            this._selectedObjects.length = 0;
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.dispatcher.dispatch("editor.selectedObjectsChanged");
        };
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        EditorData.prototype.selectObject = function (object) {
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd)
                this._selectedObjects.length = 0;
            //
            var index = this._selectedObjects.indexOf(object);
            if (index == -1)
                this._selectedObjects.push(object);
            else
                this._selectedObjects.splice(index, 1);
            //
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.dispatcher.dispatch("editor.selectedObjectsChanged");
        };
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        EditorData.prototype.selectMultiObject = function (objs) {
            var _this = this;
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd)
                this._selectedObjects.length = 0;
            objs.forEach(function (v) {
                var index = _this._selectedObjects.indexOf(v);
                if (index == -1)
                    _this._selectedObjects.push(v);
                else
                    _this._selectedObjects.splice(index, 1);
            });
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.dispatcher.dispatch("editor.selectedObjectsChanged");
        };
        Object.defineProperty(EditorData.prototype, "toolType", {
            /**
             * 使用的控制工具类型
             */
            get: function () {
                return this._toolType;
            },
            set: function (v) {
                if (this._toolType == v)
                    return;
                this._toolType = v;
                feng3d.dispatcher.dispatch("editor.toolTypeChanged");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "selectedGameObjects", {
            /**
             * 选中游戏对象列表
             */
            get: function () {
                var _this = this;
                if (this._selectedGameObjectsInvalid) {
                    this._selectedGameObjects.length = 0;
                    this._selectedObjects.forEach(function (v) {
                        if (v instanceof feng3d.GameObject)
                            _this._selectedGameObjects.push(v);
                    });
                    this._selectedGameObjectsInvalid = false;
                }
                return this._selectedGameObjects;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "isBaryCenter", {
            /**
             * 坐标原点是否在质心
             */
            get: function () {
                return this._isBaryCenter;
            },
            set: function (v) {
                if (this._isBaryCenter == v)
                    return;
                this._isBaryCenter = v;
                this._transformBoxInvalid = true;
                feng3d.dispatcher.dispatch("editor.isBaryCenterChanged");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "isWoldCoordinate", {
            /**
             * 是否使用世界坐标
             */
            get: function () {
                return this._isWoldCoordinate;
            },
            set: function (v) {
                if (this._isWoldCoordinate == v)
                    return;
                this._isWoldCoordinate = v;
                feng3d.dispatcher.dispatch("editor.isWoldCoordinateChanged");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "transformGameObject", {
            /**
             * 变换对象
             */
            get: function () {
                if (this._transformGameObjectInvalid) {
                    var length = this.selectedGameObjects.length;
                    if (length > 0)
                        this._transformGameObject = this.selectedGameObjects[length - 1];
                    else
                        this._transformGameObject = null;
                    this._transformGameObjectInvalid = false;
                }
                return this._transformGameObject;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "transformBox", {
            get: function () {
                var _this = this;
                if (this._transformBoxInvalid) {
                    var length = this.selectedGameObjects.length;
                    if (length > 0) {
                        this._transformBox = null;
                        this.selectedGameObjects.forEach(function (cv) {
                            var box = cv.worldBounds;
                            if (exports.editorData.isBaryCenter || _this._transformBox == null) {
                                _this._transformBox = box.clone();
                            }
                            else {
                                _this._transformBox.union(box);
                            }
                        });
                    }
                    else {
                        this._transformBox = null;
                    }
                    this._transformBoxInvalid = false;
                }
                return this._transformBox;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "selectedAssetNodes", {
            /**
             * 选中游戏对象列表
             */
            get: function () {
                var _this = this;
                if (this._selectedAssetFileInvalid) {
                    this._selectedAssetNodes.length = 0;
                    this._selectedObjects.forEach(function (v) {
                        if (v instanceof AssetNode_1.AssetNode)
                            _this._selectedAssetNodes.push(v);
                    });
                    this._selectedAssetFileInvalid = false;
                }
                return this._selectedAssetNodes;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        EditorData.prototype.getEditorAssetPath = function (url) {
            return document.URL.substring(0, document.URL.lastIndexOf("/") + 1) + "resource/" + url;
        };
        return EditorData;
    }());
    exports.EditorData = EditorData;
    exports.editorData = new EditorData();
});
//# sourceMappingURL=EditorData.js.map