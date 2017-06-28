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
        var DragType;
        (function (DragType) {
            DragType[DragType["HierarchyNode"] = 0] = "HierarchyNode";
        })(DragType = editor.DragType || (editor.DragType = {}));
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 拖拽源
         * @author feng		2017-01-22
         */
        var DragSource = (function () {
            function DragSource() {
                /**
                 * 数据拥有者
                 */
                this.dataHolder = {};
                /**
                 * 格式处理函数列表
                 */
                this.formatHandlers = {};
                /**
                 * 格式列表
                 */
                this._formats = [];
            }
            Object.defineProperty(DragSource.prototype, "formats", {
                /**
                 * 格式列表
                 */
                get: function () {
                    return this._formats;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 添加数据
             * @param data			数据
             * @param format		数据格式
             */
            DragSource.prototype.addData = function (data, format) {
                this._formats.push(data);
                this.dataHolder[format] = data;
            };
            /**
             * 添加处理函数
             * @param handler
             * @param format
             */
            DragSource.prototype.addHandler = function (handler, format) {
                this._formats.push(format);
                this.formatHandlers[format] = handler;
            };
            /**
             * 根据格式获取数据
             * @param format		格式
             * @return 				拥有的数据或者处理回调函数
             */
            DragSource.prototype.dataForFormat = function (format) {
                var data = this.dataHolder[format];
                if (data)
                    return data;
                if (this.formatHandlers[format])
                    return this.formatHandlers[format]();
                return null;
            };
            /**
             * 判断是否支持指定格式
             * @param format			格式
             * @return
             */
            DragSource.prototype.hasFormat = function (format) {
                var n = this._formats.length;
                for (var i = 0; i < n; i++) {
                    if (this._formats[i] == format)
                        return true;
                }
                return false;
            };
            return DragSource;
        }());
        editor.DragSource = DragSource;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
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
            return DragEvent;
        }(egret.Event));
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
        editor.DragEvent = DragEvent;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 拖拽管理者
         * @author feng 2017-01-22
         *
         */
        var DragManager = (function () {
            function DragManager() {
            }
            Object.defineProperty(DragManager, "instance", {
                /**
                 * 拖拽管理者
                 */
                get: function () {
                    return this._instance = this._instance || new DragManager();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DragManager, "isDragging", {
                /**
                 * 是否正在拖拽
                 */
                get: function () {
                    return this.instance.isDragging;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DragManager, "isSuccess", {
                /**
                 * 是否被接受
                 */
                get: function () {
                    return this.instance.isSuccess;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 执行拖拽
             * @param dragInitiator		拖拽发起对象
             * @param dragSource		拖拽源
             * @param mouseEvent		鼠标事件
             * @param dragImagge		拖拽图片
             * @param xOffset			X偏移
             * @param yOffset			Y偏移
             * @param imageAlpha		图片透明度
             * @param allowMove			是否允许移动
             */
            DragManager.doDrag = function (dragInitiator, dragSource, dragImagge, xOffset, yOffset, imageAlpha, allowMove) {
                if (dragImagge === void 0) { dragImagge = null; }
                if (xOffset === void 0) { xOffset = 0; }
                if (yOffset === void 0) { yOffset = 0; }
                if (imageAlpha === void 0) { imageAlpha = 0.5; }
                if (allowMove === void 0) { allowMove = true; }
                this.instance.doDrag(dragInitiator, dragSource, dragImagge, xOffset, yOffset, imageAlpha, allowMove);
            };
            /**
             * 接受拖入
             * @param target		接受拖入的对象
             */
            DragManager.acceptDragDrop = function (target) {
                this.instance.acceptDragDrop(target);
            };
            /**
             * 是否接受拖入
             */
            DragManager.isAcceptDragDrop = function (target) {
                return this.instance.accepter == target;
            };
            /**
             * 执行拖拽
             * @param dragInitiator		拖拽发起对象
             * @param dragSource		拖拽源
             * @param dragImagge		拖拽图片
             * @param xOffset			X偏移
             * @param yOffset			Y偏移
             * @param imageAlpha		图片透明度
             * @param allowMove			是否允许移动
             */
            DragManager.prototype.doDrag = function (dragInitiator, dragSource, dragImage, xOffset, yOffset, imageAlpha, allowMove) {
                if (dragImage === void 0) { dragImage = null; }
                if (xOffset === void 0) { xOffset = 0; }
                if (yOffset === void 0) { yOffset = 0; }
                if (imageAlpha === void 0) { imageAlpha = 0.5; }
                if (allowMove === void 0) { allowMove = true; }
                this.isSuccess = false;
                this.dragInitiator = dragInitiator;
                this.dragSource = dragSource;
                this.dragImage = dragImage;
                this.xOffset = xOffset;
                this.yOffset = yOffset;
                this.imageAlpha = imageAlpha;
                this.allowMove = allowMove;
                this.stage = dragInitiator.stage;
                this.startDrag();
            };
            /**
             * 接受拖入
             * @param target		接受拖入的对象
             */
            DragManager.prototype.acceptDragDrop = function (target) {
                this.accepter = target;
            };
            Object.defineProperty(DragManager.prototype, "accepter", {
                /**
                 * 接受对象
                 */
                get: function () {
                    return this._accepter;
                },
                set: function (value) {
                    if (this._accepter) {
                        this._accepter.removeEventListener(editor.MouseEvent.MOUSE_OUT, this.onAccepterMouseOut, this);
                    }
                    this._accepter = value;
                    if (this._accepter) {
                        this._accepter.addEventListener(editor.MouseEvent.MOUSE_OUT, this.onAccepterMouseOut, this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 开始拖拽
             */
            DragManager.prototype.startDrag = function () {
                this.isDragging = true;
                this.accepter = null;
                this.addListeners();
                // this.dragImage = this.dragImage || this.createDragImage();
                // this.stage.addChild(this.dragImage);
                // this.updateDragImage();
            };
            DragManager.prototype.updateDragImage = function () {
                this.dragImage.x = feng3d.input.clientX + this.xOffset;
                this.dragImage.y = feng3d.input.clientY + this.yOffset;
                this.dragImage.alpha = this.imageAlpha;
            };
            // private createDragImage(): egret.DisplayObject
            // {
            // 	var bound: Rectangle = this.dragInitiator.getBounds();
            // 	this.xOffset = bound.x - this.dragInitiator.mouseX;
            // 	this.yOffset = bound.y - this.dragInitiator.mouseY;
            // 	var bitmap = new Bitmap(new BitmapData(dragInitiator.width, dragInitiator.height, true, 0));
            // 	var matrix = new Matrix(1, 0, 0, 1, -bound.x, -bound.y);
            // 	bitmap.bitmapData.draw(this.dragInitiator, matrix);
            // 	return bitmap;
            // }
            DragManager.prototype.endDrag = function () {
                this.isDragging = false;
                this.removeListeners();
                this.accepter = null;
                this.dragImage && this.stage.removeChild(this.dragImage);
                this.dragImage = null;
            };
            /**
             * 处理接受对象鼠标移出事件
             */
            DragManager.prototype.onAccepterMouseOut = function (event) {
                this.accepter.dispatchEvent(new editor.DragEvent(editor.DragEvent.DRAG_EXIT, this.dragInitiator, this.dragSource, true));
                this.accepter = null;
            };
            /**
             * 处理舞台鼠标移入事件
             */
            DragManager.prototype.onStageMouseOver = function (event) {
                var target = event.target;
                target.dispatchEvent(new editor.DragEvent(editor.DragEvent.DRAG_ENTER, this.dragInitiator, this.dragSource, true));
            };
            DragManager.prototype.onStageMouseUp = function (event) {
                if (this.accepter != null) {
                    this.isSuccess = true;
                    this.accepter.dispatchEvent(new editor.DragEvent(editor.DragEvent.DRAG_DROP, this.dragInitiator, this.dragSource, true));
                }
                this.endDrag();
            };
            DragManager.prototype.onStageMouseMove = function (event) {
                // this.updateDragImage();
            };
            DragManager.prototype.addListeners = function () {
                this.stage.addEventListener(editor.MouseEvent.MOUSE_OVER, this.onStageMouseOver, this);
                this.stage.addEventListener(editor.MouseEvent.MOUSE_UP, this.onStageMouseUp, this);
                this.stage.addEventListener(editor.MouseEvent.MOUSE_MOVE, this.onStageMouseMove, this);
            };
            DragManager.prototype.removeListeners = function () {
                this.stage.removeEventListener(editor.MouseEvent.MOUSE_OVER, this.onStageMouseOver, this);
                this.stage.removeEventListener(editor.MouseEvent.MOUSE_UP, this.onStageMouseUp, this);
                this.stage.removeEventListener(editor.MouseEvent.MOUSE_MOVE, this.onStageMouseMove, this);
            };
            return DragManager;
        }());
        editor.DragManager = DragManager;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Feng3dView = (function (_super) {
            __extends(Feng3dView, _super);
            function Feng3dView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Feng3dViewSkin";
                return _this;
            }
            Feng3dView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Feng3dView.prototype.onAddedToStage = function () {
                this.canvas = document.getElementById("glcanvas");
                this.addEventListener(egret.Event.RESIZE, this.onResize, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                this.onResize();
            };
            Feng3dView.prototype.onRemovedFromStage = function () {
                this.canvas = null;
                this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            };
            Feng3dView.prototype.onResize = function () {
                if (!this.stage)
                    return;
                var lt = this.localToGlobal(0, 0);
                var rb = this.localToGlobal(this.width, this.height);
                var bound1 = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
                // var bound2 = this.getTransformedBounds(this.stage);
                var bound = bound1;
                var style = this.canvas.style;
                style.position = "absolute";
                style.left = bound.x + "px";
                style.top = bound.y + "px";
                style.width = bound.width + "px";
                style.height = bound.height + "px";
                if (bound.contains(feng3d.input.clientX, feng3d.input.clientY)) {
                    feng3d.shortcut.activityState("mouseInView3D");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInView3D");
                }
            };
            return Feng3dView;
        }(eui.Component));
        editor.Feng3dView = Feng3dView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Accordion = (function (_super) {
            __extends(Accordion, _super);
            function Accordion() {
                var _this = _super.call(this) || this;
                _this.components = [];
                _this.titleName = "";
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "AccordionSkin";
                return _this;
            }
            Accordion.prototype.addContent = function (component) {
                if (!this.contentGroup)
                    this.components.push(component);
                else
                    this.contentGroup.addChild(component);
            };
            Accordion.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Accordion.prototype.onAddedToStage = function () {
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                if (this.components) {
                    for (var i = 0; i < this.components.length; i++) {
                        this.contentGroup.addChild(this.components[i]);
                    }
                    this.components = null;
                    delete this.components;
                }
            };
            Accordion.prototype.onRemovedFromStage = function () {
                this.titleButton.removeEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
            };
            Accordion.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            return Accordion;
        }(eui.Component));
        editor.Accordion = Accordion;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var TreeItemRenderer = (function (_super) {
            __extends(TreeItemRenderer, _super);
            function TreeItemRenderer() {
                var _this = _super.call(this) || this;
                /**
                 * 子节点相对父节点的缩进值，以像素为单位。默认17。
                 */
                _this.indentation = 17;
                _this.watchers = [];
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "TreeItemRendererSkin";
                return _this;
            }
            TreeItemRenderer.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            TreeItemRenderer.prototype.onAddedToStage = function () {
                this.addEventListener(editor.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false, 1000);
                this.addEventListener(editor.DragEvent.DRAG_ENTER, this.onDragEnter, this);
                this.addEventListener(editor.DragEvent.DRAG_EXIT, this.onDragExit, this);
                this.addEventListener(editor.DragEvent.DRAG_DROP, this.onDragDrop, this);
                //
                this.disclosureButton.addEventListener(editor.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
                this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
                this.updateView();
            };
            TreeItemRenderer.prototype.onRemovedFromStage = function () {
                this.removeEventListener(editor.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false);
                this.removeEventListener(editor.DragEvent.DRAG_ENTER, this.onDragEnter, this);
                this.removeEventListener(editor.DragEvent.DRAG_EXIT, this.onDragExit, this);
                this.removeEventListener(editor.DragEvent.DRAG_DROP, this.onDragDrop, this);
                eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
                eui.Watcher.watch(this, ["indentation"], this.updateView, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
                //
                this.disclosureButton.removeEventListener(editor.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            };
            TreeItemRenderer.prototype.onDisclosureButtonClick = function () {
                if (this.data)
                    this.data.isOpen = !this.data.isOpen;
            };
            TreeItemRenderer.prototype.updateView = function () {
                this.disclosureButton.visible = this.data ? this.data.hasChildren : false;
                this.contentGroup.x = (this.data ? this.data.depth : 0) * this.indentation;
                this.disclosureButton.selected = this.data ? this.data.isOpen : false;
            };
            TreeItemRenderer.prototype.onItemMouseDown = function (event) {
                if (event.target == this.disclosureButton) {
                    event.stopImmediatePropagation();
                    return;
                }
                this.stage.once(editor.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
                this.stage.once(editor.MouseEvent.MOUSE_UP, this.onMouseUp, this);
            };
            TreeItemRenderer.prototype.onMouseUp = function (event) {
                this.stage.removeEventListener(editor.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            };
            TreeItemRenderer.prototype.onMouseMove = function (event) {
                var dragSource = new editor.DragSource();
                dragSource.addData(this.data, editor.DragType.HierarchyNode);
                editor.DragManager.doDrag(this, dragSource);
            };
            TreeItemRenderer.prototype.onDragEnter = function (event) {
                var node = event.dragSource.dataForFormat(editor.DragType.HierarchyNode);
                if (node && this.data != node) {
                    editor.DragManager.acceptDragDrop(this);
                }
            };
            TreeItemRenderer.prototype.onDragExit = function (event) {
            };
            TreeItemRenderer.prototype.onDragDrop = function (event) {
                var node = event.dragSource.dataForFormat(editor.DragType.HierarchyNode);
                var iscontain = node.contain(this.data);
                if (iscontain) {
                    alert("无法添加到自身节点中!");
                    return;
                }
                if (node.parent) {
                    node.parent.removeNode(node);
                }
                this.data.addNode(node);
            };
            return TreeItemRenderer;
        }(eui.ItemRenderer));
        editor.TreeItemRenderer = TreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Tree = (function (_super) {
            __extends(Tree, _super);
            function Tree() {
                var _this = _super.call(this) || this;
                _this.itemRenderer = editor.TreeItemRenderer;
                return _this;
            }
            return Tree;
        }(eui.List));
        editor.Tree = Tree;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Vector3DView = (function (_super) {
            __extends(Vector3DView, _super);
            function Vector3DView() {
                var _this = _super.call(this) || this;
                _this.vm = new feng3d.Vector3D(1, 2, 3);
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Vector3DViewSkin";
                return _this;
            }
            Vector3DView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Vector3DView.prototype.onAddedToStage = function () {
                this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            Vector3DView.prototype.onRemovedFromStage = function () {
                this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            Vector3DView.prototype.onTextChange = function (event) {
                switch (event.currentTarget) {
                    case this.xTextInput:
                        this.vm.x = Number(this.xTextInput.text);
                        break;
                    case this.yTextInput:
                        this.vm.y = Number(this.yTextInput.text);
                        break;
                    case this.zTextInput:
                        this.vm.z = Number(this.zTextInput.text);
                        break;
                }
            };
            return Vector3DView;
        }(eui.Component));
        editor.Vector3DView = Vector3DView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DComponentView = (function (_super) {
            __extends(Object3DComponentView, _super);
            /**
             * 对象界面数据
             */
            function Object3DComponentView(component) {
                var _this = _super.call(this) || this;
                _this.component = component;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Object3DComponentSkin";
                return _this;
            }
            Object3DComponentView.prototype.onComplete = function () {
                var componentName = feng3d.ClassUtils.getQualifiedClassName(this.component).split(".").pop();
                this.accordion.titleName = componentName;
                var displayObject = feng3d.objectview.getObjectView(this.component);
                this.accordion.addContent(displayObject);
            };
            return Object3DComponentView;
        }(eui.Component));
        editor.Object3DComponentView = Object3DComponentView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认基础对象界面
         * @author feng 2016-3-11
         */
        var DefaultBaseObjectView = (function (_super) {
            __extends(DefaultBaseObjectView, _super);
            function DefaultBaseObjectView(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultBaseObjectView";
                return _this;
            }
            DefaultBaseObjectView.prototype.onComplete = function () {
                this.updateView();
            };
            Object.defineProperty(DefaultBaseObjectView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            DefaultBaseObjectView.prototype.getAttributeView = function (attributeName) {
                return null;
            };
            DefaultBaseObjectView.prototype.getblockView = function (blockName) {
                return null;
            };
            /**
             * 更新界面
             */
            DefaultBaseObjectView.prototype.updateView = function () {
                this.label.text = String(this._space);
            };
            return DefaultBaseObjectView;
        }(eui.Component));
        editor.DefaultBaseObjectView = DefaultBaseObjectView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认对象属性界面
         * @author feng 2016-3-10
         */
        var DefaultObjectAttributeView = (function (_super) {
            __extends(DefaultObjectAttributeView, _super);
            function DefaultObjectAttributeView(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultObjectAttributeView";
                return _this;
            }
            DefaultObjectAttributeView.prototype.onComplete = function () {
                this.text.percentWidth = 100;
                this.text.enabled = this.attributeViewInfo.writable;
                this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.updateView();
            };
            Object.defineProperty(DefaultObjectAttributeView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultObjectAttributeView.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultObjectAttributeView.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            DefaultObjectAttributeView.prototype.updateView = function () {
                this.label.text = this._attributeName;
                if (this.attributeValue === undefined) {
                    this.text.text = String(this.attributeValue);
                    this.text.enabled = false;
                }
                else if (feng3d.ClassUtils.isBaseType(this.attributeValue)) {
                    this.text.text = String(this.attributeValue);
                }
                else {
                    this.text.enabled = false;
                    this.text.text = "[" + feng3d.ClassUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + "]";
                    this.once(editor.MouseEvent.CLICK, this.onClick, this);
                }
            };
            DefaultObjectAttributeView.prototype.onClick = function () {
                editor.editor3DData.inspectorViewData.showData(this.attributeValue);
            };
            DefaultObjectAttributeView.prototype.onTextChange = function () {
                switch (this._attributeType) {
                    case "String":
                        this.attributeValue = this.text.text;
                        break;
                    case "Number":
                        this.attributeValue = Number(this.text.text);
                        break;
                    case "Boolean":
                        this.attributeValue = Boolean(this.text.text);
                        break;
                    default:
                        throw "\u65E0\u6CD5\u5904\u7406\u7C7B\u578B" + this._attributeType + "!";
                }
            };
            return DefaultObjectAttributeView;
        }(eui.Component));
        editor.DefaultObjectAttributeView = DefaultObjectAttributeView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认对象属性块界面
         * @author feng 2016-3-22
         */
        var DefaultObjectBlockView = (function (_super) {
            __extends(DefaultObjectBlockView, _super);
            /**
             * @inheritDoc
             */
            function DefaultObjectBlockView(blockViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = blockViewInfo.owner;
                _this._blockName = blockViewInfo.name;
                _this.itemList = blockViewInfo.itemList;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultObjectBlockView";
                return _this;
            }
            DefaultObjectBlockView.prototype.onComplete = function () {
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.$updateView();
            };
            DefaultObjectBlockView.prototype.initView = function () {
                var h = 0;
                if (this._blockName != null && this._blockName.length > 0) {
                    this.addChildAt(this.border, 0);
                    this.group.addChildAt(this.titleGroup, 0);
                }
                else {
                    this.removeChild(this.border);
                    this.group.removeChild(this.titleGroup);
                }
                this.attributeViews = [];
                var objectAttributeInfos = this.itemList;
                for (var i = 0; i < objectAttributeInfos.length; i++) {
                    var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
                    displayObject.percentWidth = 100;
                    this.contentGroup.addChild(displayObject);
                    this.attributeViews.push(displayObject);
                }
                this.isInitView = true;
            };
            Object.defineProperty(DefaultObjectBlockView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    for (var i = 0; i < this.attributeViews.length; i++) {
                        this.attributeViews[i].space = this._space;
                    }
                    this.$updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultObjectBlockView.prototype, "blockName", {
                get: function () {
                    return this._blockName;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新自身界面
             */
            DefaultObjectBlockView.prototype.$updateView = function () {
                if (!this.isInitView) {
                    this.initView();
                }
            };
            DefaultObjectBlockView.prototype.updateView = function () {
                this.$updateView();
                for (var i = 0; i < this.attributeViews.length; i++) {
                    this.attributeViews[i].updateView();
                }
            };
            DefaultObjectBlockView.prototype.getAttributeView = function (attributeName) {
                for (var i = 0; i < this.attributeViews.length; i++) {
                    if (this.attributeViews[i].attributeName == attributeName) {
                        return this.attributeViews[i];
                    }
                }
                return null;
            };
            DefaultObjectBlockView.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            return DefaultObjectBlockView;
        }(eui.Component));
        editor.DefaultObjectBlockView = DefaultObjectBlockView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认使用块的对象界面
         * @author feng 2016-3-22
         */
        var DefaultObjectView = (function (_super) {
            __extends(DefaultObjectView, _super);
            /**
             * 对象界面数据
             */
            function DefaultObjectView(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._objectViewInfo = objectViewInfo;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultObjectView";
                return _this;
            }
            DefaultObjectView.prototype.onComplete = function () {
                this.blockViews = [];
                var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
                for (var i = 0; i < objectBlockInfos.length; i++) {
                    var displayObject = feng3d.objectview.getBlockView(objectBlockInfos[i]);
                    displayObject.percentWidth = 100;
                    this.group.addChild(displayObject);
                    this.blockViews.push(displayObject);
                }
                this.$updateView();
            };
            Object.defineProperty(DefaultObjectView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    for (var i = 0; i < this.blockViews.length; i++) {
                        this.blockViews[i].space = this._space;
                    }
                    this.$updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            DefaultObjectView.prototype.updateView = function () {
                this.$updateView();
                for (var i = 0; i < this.blockViews.length; i++) {
                    this.blockViews[i].updateView();
                }
            };
            /**
             * 更新自身界面
             */
            DefaultObjectView.prototype.$updateView = function () {
            };
            DefaultObjectView.prototype.getblockView = function (blockName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    if (this.blockViews[i].blockName == blockName) {
                        return this.blockViews[i];
                    }
                }
                return null;
            };
            DefaultObjectView.prototype.getAttributeView = function (attributeName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    var attributeView = this.blockViews[i].getAttributeView(attributeName);
                    if (attributeView != null) {
                        return attributeView;
                    }
                }
                return null;
            };
            return DefaultObjectView;
        }(eui.Component));
        editor.DefaultObjectView = DefaultObjectView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var BooleanAttrView = (function (_super) {
            __extends(BooleanAttrView, _super);
            function BooleanAttrView(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "BooleanAttrViewSkin";
                return _this;
            }
            BooleanAttrView.prototype.onComplete = function () {
                this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.label.text = this._attributeName;
                this.updateView();
            };
            Object.defineProperty(BooleanAttrView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            BooleanAttrView.prototype.updateView = function () {
                this.checkBox["selected"] = this.attributeValue;
            };
            BooleanAttrView.prototype.onChange = function (event) {
                this.attributeValue = this.checkBox["selected"];
            };
            Object.defineProperty(BooleanAttrView.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BooleanAttrView.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                        var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                        objectViewEvent.space = this._space;
                        objectViewEvent.attributeName = this._attributeName;
                        objectViewEvent.attributeValue = this.attributeValue;
                        this.dispatchEvent(objectViewEvent);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return BooleanAttrView;
        }(eui.Component));
        editor.BooleanAttrView = BooleanAttrView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var ObjectViewEvent = (function (_super) {
        __extends(ObjectViewEvent, _super);
        function ObjectViewEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        ObjectViewEvent.prototype.toString = function () {
            return "[{0} type=\"{1}\" space=\"{2}\"  attributeName=\"{3}\" attributeValue={4}]".replace("{0}", egret.getQualifiedClassName(this).split("::").pop()).replace("{1}", this.type).replace("{2}", egret.getQualifiedClassName(this).split("::").pop()).replace("{3}", this.attributeName).replace("{4}", JSON.stringify(this.attributeValue));
        };
        return ObjectViewEvent;
    }(egret.Event));
    feng3d.ObjectViewEvent = ObjectViewEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OAVVector3D = (function (_super) {
            __extends(OAVVector3D, _super);
            function OAVVector3D(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVVector3DSkin";
                return _this;
            }
            OAVVector3D.prototype.onComplete = function () {
                this.vector3DView.vm = this.attributeValue;
                feng3d.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
                this.updateView();
            };
            Object.defineProperty(OAVVector3D.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVVector3D.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVVector3D.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            OAVVector3D.prototype.updateView = function () {
            };
            return OAVVector3D;
        }(eui.Component));
        editor.OAVVector3D = OAVVector3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OAVObject3DComponentList = (function (_super) {
            __extends(OAVObject3DComponentList, _super);
            function OAVObject3DComponentList(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this.accordions = [];
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVObject3DComponentListSkin";
                return _this;
            }
            OAVObject3DComponentList.prototype.onComplete = function () {
                this.addComponentButton.addEventListener(editor.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
                this.updateView();
            };
            OAVObject3DComponentList.prototype.onAddComponentButtonClick = function () {
                var globalPoint = this.addComponentButton.localToGlobal(0, 0);
                editor.createObject3DView.showView(createObject3DComponentConfig, this.onCreateComponent.bind(this), globalPoint);
            };
            OAVObject3DComponentList.prototype.onCreateComponent = function (item) {
                var cls = feng3d.ClassUtils.getDefinitionByName(item.className);
                this.space.addComponent(cls);
                this.updateView();
            };
            Object.defineProperty(OAVObject3DComponentList.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVObject3DComponentList.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVObject3DComponentList.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            OAVObject3DComponentList.prototype.updateView = function () {
                this.accordions.length = 0;
                this.group.layout.gap = -1;
                this.group.removeChildren();
                var components = this.attributeValue;
                for (var i = 0; i < components.length; i++) {
                    var component = components[i];
                    var displayObject = new editor.Object3DComponentView(component);
                    displayObject.percentWidth = 100;
                    this.group.addChild(displayObject);
                    //
                    displayObject.deleteButton.addEventListener(editor.MouseEvent.CLICK, this.onDeleteButton, this);
                }
            };
            OAVObject3DComponentList.prototype.onDeleteButton = function (event) {
                var displayObject = event.currentTarget.parent;
                this.group.removeChild(displayObject);
                this.space.removeComponent(displayObject.component);
            };
            return OAVObject3DComponentList;
        }(eui.Component));
        editor.OAVObject3DComponentList = OAVObject3DComponentList;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 巡视界面数据
         * @author feng     2017-03-20
         */
        var InspectorViewData = (function (_super) {
            __extends(InspectorViewData, _super);
            function InspectorViewData(editor3DData) {
                var _this = _super.call(this) || this;
                _this.hasBackData = false;
                _this.viewDataList = [];
                feng3d.Watcher.watch(editor3DData, ["selectedObject3D"], _this.updateView, _this);
                return _this;
            }
            InspectorViewData.prototype.showData = function (data, removeBack) {
                if (removeBack === void 0) { removeBack = false; }
                if (this.viewData) {
                    this.viewDataList.push(this.viewData);
                }
                if (removeBack) {
                    this.viewDataList.length = 0;
                }
                this.hasBackData = this.viewDataList.length > 0;
                //
                this.viewData = data;
                this.dispatchEvent(new feng3d.Event(feng3d.Event.CHANGE));
            };
            InspectorViewData.prototype.back = function () {
                this.viewData = this.viewDataList.pop();
                this.hasBackData = this.viewDataList.length > 0;
                this.dispatchEvent(new feng3d.Event(feng3d.Event.CHANGE));
            };
            InspectorViewData.prototype.updateView = function () {
                this.showData(editor.editor3DData.selectedObject3D, true);
            };
            return InspectorViewData;
        }(feng3d.EventDispatcher));
        editor.InspectorViewData = InspectorViewData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 巡视界面
         * @author feng     2017-03-20
         */
        var InspectorView = (function (_super) {
            __extends(InspectorView, _super);
            function InspectorView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "InspectorViewSkin";
                return _this;
            }
            InspectorView.prototype.onComplete = function () {
                this.group.percentWidth = 100;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            InspectorView.prototype.onAddedToStage = function () {
                this.inspectorViewData = editor.editor3DData.inspectorViewData;
                this.inspectorViewData.addEventListener(feng3d.Event.CHANGE, this.onDataChange, this);
                this.backButton.addEventListener(editor.MouseEvent.CLICK, this.onBackClick, this);
            };
            InspectorView.prototype.onRemovedFromStage = function () {
                this.inspectorViewData.removeEventListener(feng3d.Event.CHANGE, this.onDataChange, this);
                this.backButton.removeEventListener(editor.MouseEvent.CLICK, this.onBackClick, this);
                this.inspectorViewData = null;
            };
            InspectorView.prototype.onDataChange = function () {
                this.updateView();
            };
            InspectorView.prototype.updateView = function () {
                this.backButton.visible = this.inspectorViewData.hasBackData;
                if (this.view && this.view.parent) {
                    this.view.parent.removeChild(this.view);
                }
                if (this.inspectorViewData.viewData) {
                    this.view = feng3d.objectview.getObjectView(this.inspectorViewData.viewData);
                    this.view.percentWidth = 100;
                    this.group.addChild(this.view);
                }
            };
            InspectorView.prototype.onBackClick = function () {
                this.inspectorViewData.back();
            };
            return InspectorView;
        }(eui.Component));
        editor.InspectorView = InspectorView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var CreateObject3DView = (function (_super) {
            __extends(CreateObject3DView, _super);
            function CreateObject3DView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "CreateObject3DViewSkin";
                return _this;
            }
            CreateObject3DView.prototype.showView = function (data, selectedCallBack, globalPoint) {
                if (globalPoint === void 0) { globalPoint = null; }
                this._dataProvider.replaceAll(data.concat());
                this._selectedCallBack = selectedCallBack;
                globalPoint = globalPoint || new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.x = globalPoint.x;
                this.y = globalPoint.y;
                editor.editor3DData.stage.addChild(this);
            };
            CreateObject3DView.prototype.onComplete = function () {
                this._dataProvider = new eui.ArrayCollection();
                this.object3dList.dataProvider = this._dataProvider;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            CreateObject3DView.prototype.onAddedToStage = function () {
                var gP = this.localToGlobal(0, 0);
                this.maskSprite.x = -gP.x;
                this.maskSprite.y = -gP.y;
                this.maskSprite.width = this.stage.stageWidth;
                this.maskSprite.height = this.stage.stageHeight;
                this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
                this.maskSprite.addEventListener(editor.MouseEvent.CLICK, this.maskMouseDown, this);
            };
            CreateObject3DView.prototype.onRemovedFromStage = function () {
                this.object3dList.removeEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
                this.maskSprite.removeEventListener(editor.MouseEvent.CLICK, this.maskMouseDown, this);
            };
            CreateObject3DView.prototype.onObject3dListChange = function () {
                this._selectedCallBack(this.object3dList.selectedItem);
                this.object3dList.selectedIndex = -1;
                this.parent && this.parent.removeChild(this);
            };
            CreateObject3DView.prototype.maskMouseDown = function () {
                this.parent && this.parent.removeChild(this);
            };
            return CreateObject3DView;
        }(eui.Component));
        editor.CreateObject3DView = CreateObject3DView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var HierarchyView = (function (_super) {
            __extends(HierarchyView, _super);
            function HierarchyView() {
                var _this = _super.call(this) || this;
                _this.watchers = [];
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "HierarchyViewSkin";
                return _this;
            }
            HierarchyView.prototype.onComplete = function () {
                this.listData = this.list.dataProvider = new eui.ArrayCollection();
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            HierarchyView.prototype.onAddedToStage = function () {
                this.addButton.addEventListener(editor.MouseEvent.CLICK, this.onAddButtonClick, this);
                editor.editor3DData.hierarchy.rootNode.addEventListener(editor.HierarchyNode.ADDED, this.onHierarchyNodeAdded, this);
                editor.editor3DData.hierarchy.rootNode.addEventListener(editor.HierarchyNode.REMOVED, this.onHierarchyNodeRemoved, this);
                editor.editor3DData.hierarchy.rootNode.addEventListener(editor.HierarchyNode.OPEN_CHANGED, this.onHierarchyNodeRemoved, this);
                this.list.addEventListener(egret.Event.CHANGE, this.onListChange, this);
                this.watchers.push(feng3d.Watcher.watch(editor.editor3DData, ["selectedObject3D"], this.selectedObject3DChanged, this));
            };
            HierarchyView.prototype.onRemovedFromStage = function () {
                this.addButton.removeEventListener(editor.MouseEvent.CLICK, this.onAddButtonClick, this);
                editor.editor3DData.hierarchy.rootNode.removeEventListener(editor.HierarchyNode.ADDED, this.onHierarchyNodeAdded, this);
                editor.editor3DData.hierarchy.rootNode.removeEventListener(editor.HierarchyNode.REMOVED, this.onHierarchyNodeRemoved, this);
                editor.editor3DData.hierarchy.rootNode.removeEventListener(editor.HierarchyNode.OPEN_CHANGED, this.onHierarchyNodeRemoved, this);
                this.list.removeEventListener(egret.Event.CHANGE, this.onListChange, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
            };
            HierarchyView.prototype.onListChange = function () {
                var node = this.list.selectedItem;
                editor.editor3DData.selectedObject3D = node.object3D.gameObject;
            };
            HierarchyView.prototype.onHierarchyNodeAdded = function (event) {
                var nodes = editor.editor3DData.hierarchy.rootNode.getShowNodes();
                this.listData.replaceAll(nodes);
            };
            HierarchyView.prototype.onHierarchyNodeRemoved = function (event) {
                var nodes = editor.editor3DData.hierarchy.rootNode.getShowNodes();
                this.listData.replaceAll(nodes);
                this.list.selectedItem = editor.editor3DData.hierarchy.selectedNode;
            };
            HierarchyView.prototype.selectedObject3DChanged = function () {
                var node = editor.editor3DData.hierarchy.getNode(editor.editor3DData.selectedObject3D ? editor.editor3DData.selectedObject3D.transform : null);
                this.list.selectedIndex = this.listData.getItemIndex(node);
            };
            HierarchyView.prototype.onAddButtonClick = function () {
                var globalPoint = this.addButton.localToGlobal(0, 0);
                editor.createObject3DView.showView(createObjectConfig, this.onCreateObject3d, globalPoint);
            };
            HierarchyView.prototype.onCreateObject3d = function (selectedItem) {
                editor.$editorEventDispatcher.dispatchEvent(new feng3d.Event("Create_Object3D", selectedItem));
            };
            return HierarchyView;
        }(eui.Component));
        editor.HierarchyView = HierarchyView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MainView = (function (_super) {
            __extends(MainView, _super);
            function MainView() {
                var _this = _super.call(this) || this;
                _this.watchers = [];
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "MainViewSkin";
                return _this;
            }
            MainView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            MainView.prototype.onAddedToStage = function () {
                this.moveButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.addEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.addEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.mainButton.addEventListener(editor.MouseEvent.CLICK, this.onMainButtonClick, this);
                //
                editor.createObject3DView = editor.createObject3DView || new editor.CreateObject3DView();
                this.watchers.push(feng3d.Watcher.watch(editor.editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this));
            };
            MainView.prototype.onRemovedFromStage = function () {
                this.moveButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.removeEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.removeEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.mainButton.removeEventListener(editor.MouseEvent.CLICK, this.onMainButtonClick, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
            };
            MainView.prototype.onMainButtonClick = function () {
                var globalPoint = this.mainButton.localToGlobal(0, 0);
                editor.createObject3DView.showView(mainMenuConfig, this.onMainMenu.bind(this), globalPoint);
            };
            MainView.prototype.onMainMenu = function (item) {
                editor.$editorEventDispatcher.dispatchEvent(new feng3d.Event(item.command));
            };
            MainView.prototype.onHelpButtonClick = function () {
                window.open("index.md");
            };
            MainView.prototype.onButtonClick = function (event) {
                switch (event.currentTarget) {
                    case this.moveButton:
                        editor.editor3DData.object3DOperationID = 0;
                        break;
                    case this.rotateButton:
                        editor.editor3DData.object3DOperationID = 1;
                        break;
                    case this.scaleButton:
                        editor.editor3DData.object3DOperationID = 2;
                        break;
                }
            };
            MainView.prototype.onObject3DOperationIDChange = function () {
                this.moveButton.selected = editor.editor3DData.object3DOperationID == 0;
                this.rotateButton.selected = editor.editor3DData.object3DOperationID == 1;
                this.scaleButton.selected = editor.editor3DData.object3DOperationID == 2;
            };
            return MainView;
        }(eui.Component));
        editor.MainView = MainView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var AssetAdapter = (function () {
            function AssetAdapter() {
            }
            /**
             * @language zh_CN
             * 解析素材
             * @param source 待解析的新素材标识符
             * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
             * @param thisObject callBack的 this 引用
             */
            AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
                function onGetRes(data) {
                    compFunc.call(thisObject, data, source);
                }
                if (RES.hasRes(source)) {
                    var data = RES.getRes(source);
                    if (data) {
                        onGetRes(data);
                    }
                    else {
                        RES.getResAsync(source, onGetRes, this);
                    }
                }
                else {
                    RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
                }
            };
            return AssetAdapter;
        }());
        editor.AssetAdapter = AssetAdapter;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var LoadingUI = (function (_super) {
            __extends(LoadingUI, _super);
            function LoadingUI() {
                var _this = _super.call(this) || this;
                _this.createView();
                return _this;
            }
            LoadingUI.prototype.createView = function () {
                this.textField = new egret.TextField();
                this.addChild(this.textField);
                this.textField.y = 300;
                this.textField.width = 480;
                this.textField.height = 100;
                this.textField.textAlign = "center";
            };
            LoadingUI.prototype.setProgress = function (current, total) {
                this.textField.text = "Loading..." + current + "/" + total;
            };
            return LoadingUI;
        }(egret.Sprite));
        editor.LoadingUI = LoadingUI;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MainUI = (function (_super) {
            __extends(MainUI, _super);
            function MainUI() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isThemeLoadEnd = false;
                _this.isResourceLoadEnd = false;
                return _this;
            }
            MainUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                //inject the custom material parser
                //注入自定义的素材解析器
                var assetAdapter = new editor.AssetAdapter();
                egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
                egret.registerImplementation("eui.IThemeAdapter", new editor.ThemeAdapter());
                //Config loading process interface
                //设置加载进度界面
                this.loadingView = new editor.LoadingUI();
                this.stage.addChild(this.loadingView);
                // initialize the Resource loading library
                //初始化Resource资源加载库
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                RES.loadConfig("resource/default.res.json", "resource/");
            };
            /**
             * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
             * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
             */
            MainUI.prototype.onConfigComplete = function (event) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                // load skin theme configuration file, you can manually modify the file. And replace the default skin.
                //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                var theme = new eui.Theme("resource/default.thm.json", this.stage);
                theme.once(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                RES.loadGroup("preload");
            };
            /**
             * 主题文件加载完成,开始预加载
             * Loading of theme configuration file is complete, start to pre-load the
             */
            MainUI.prototype.onThemeLoadComplete = function () {
                this.isThemeLoadEnd = true;
                this.createScene();
            };
            /**
             * preload资源组加载完成
             * preload resource group is loaded
             */
            MainUI.prototype.onResourceLoadComplete = function (event) {
                if (event.groupName == "preload") {
                    this.stage.removeChild(this.loadingView);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                    this.isResourceLoadEnd = true;
                    this.createScene();
                }
            };
            MainUI.prototype.createScene = function () {
                if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
                    this.mainView = new editor.MainView();
                    this.stage.addChild(this.mainView);
                    this.onresize();
                    window.onresize = this.onresize.bind(this);
                }
            };
            MainUI.prototype.onresize = function () {
                this.stage.setContentSize(window.innerWidth, window.innerHeight);
                this.mainView.width = this.stage.stageWidth;
                this.mainView.height = this.stage.stageHeight;
            };
            /**
             * 资源组加载出错
             *  The resource group loading failed
             */
            MainUI.prototype.onItemLoadError = function (event) {
                console.warn("Url:" + event.resItem.url + " has failed to load");
            };
            /**
             * 资源组加载出错
             * Resource group loading failed
             */
            MainUI.prototype.onResourceLoadError = function (event) {
                //TODO
                console.warn("Group:" + event.groupName + " has failed to load");
                //忽略加载失败的项目
                //ignore loading failed projects
                this.onResourceLoadComplete(event);
            };
            /**
             * preload资源组加载进度
             * loading process of preload resource
             */
            MainUI.prototype.onResourceProgress = function (event) {
                if (event.groupName == "preload") {
                    this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
                }
            };
            return MainUI;
        }(eui.UILayer));
        editor.MainUI = MainUI;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var ThemeAdapter = (function () {
            function ThemeAdapter() {
            }
            /**
             * 解析主题
             * @param url 待解析的主题url
             * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
             * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
             * @param thisObject 回调的this引用
             */
            ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
                function onGetRes(e) {
                    compFunc.call(thisObject, e);
                }
                function onError(e) {
                    if (e.resItem.url == url) {
                        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                        errorFunc.call(thisObject);
                    }
                }
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
            };
            return ThemeAdapter;
        }());
        editor.ThemeAdapter = ThemeAdapter;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 场景数据
         */
        var SceneData = (function () {
            function SceneData() {
            }
            return SceneData;
        }());
        editor.SceneData = SceneData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Editor3DData = (function () {
            function Editor3DData() {
                this.sceneData = new editor.SceneData();
                this.object3DOperationID = 0;
                /**
                 * 鼠标在view3D中的坐标
                 */
                this.mouseInView3D = new feng3d.Point();
                this.view3DRect = new feng3d.Rectangle(0, 0, 100, 100);
                this.inspectorViewData = new editor.InspectorViewData(this);
            }
            return Editor3DData;
        }());
        editor.Editor3DData = Editor3DData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
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
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DControllerTarget = (function (_super) {
            __extends(Object3DControllerTarget, _super);
            function Object3DControllerTarget(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.startGlobalMatrixVec = [];
                _this.startScaleVec = [];
                _this.controllerImage = feng3d.GameObject.create();
                _this.isWoldCoordinate = false;
                _this.isBaryCenter = false;
                //
                _this._showObject3D = feng3d.GameObject.create();
                _this.targetBindings = [];
                _this.controllerBindingShowTarget = new editor.Object3DTransformBinding(_this._showObject3D.transform);
                _this.controllerBinding = new editor.Object3DSceneTransformBinding(_this.transform);
                feng3d.serializationConfig.excludeObject.push(_this.controllerImage);
                return _this;
            }
            Object.defineProperty(Object3DControllerTarget.prototype, "controllerTargets", {
                set: function (value) {
                    if (this._controllerTargets && this._controllerTargets.length > 0) {
                        this.controllerBindingShowTarget.target = null;
                        this.targetBindings.length = 0;
                        if (this.controllerImage.transform.parent) {
                            this.controllerImage.transform.parent.removeChild(this.controllerImage.transform);
                        }
                        this.controllerImage.transform.localToWorldMatrix = new feng3d.Matrix3D();
                    }
                    this._controllerTargets = value;
                    if (this._controllerTargets && this._controllerTargets.length > 0) {
                        this.controllerBindingShowTarget.target = this._controllerTargets[0];
                        this._controllerTargets[0].addChild(this.controllerImage.transform);
                        this.updateControllerImage();
                        this.controllerBinding.target = this.controllerImage.transform;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object3DControllerTarget.prototype.updateControllerImage = function () {
                var object3D = this._controllerTargets[0];
                var position = new feng3d.Vector3D();
                if (this.isBaryCenter) {
                    position.copyFrom(object3D.scenePosition);
                }
                else {
                    for (var i = 0; i < this._controllerTargets.length; i++) {
                        position.incrementBy(this._controllerTargets[i].scenePosition);
                    }
                    position.scaleBy(1 / this._controllerTargets.length);
                }
                var vec = object3D.localToWorldMatrix.decompose();
                vec[0] = position;
                vec[2].setTo(1, 1, 1);
                if (this.isWoldCoordinate) {
                    vec[1].setTo(0, 0, 0);
                }
                tempGlobalMatrix.recompose(vec);
                this.controllerImage.transform.localToWorldMatrix = tempGlobalMatrix;
            };
            Object3DControllerTarget.prototype.startTranslation = function () {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    this.startGlobalMatrixVec[i] = this._controllerTargets[i].localToWorldMatrix.clone();
                }
            };
            Object3DControllerTarget.prototype.translation = function (addPos) {
                if (addPos.length == 0)
                    return;
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[i]);
                    tempGlobalMatrix.appendTranslation(addPos.x, addPos.y, addPos.z);
                    this._controllerTargets[i].localToWorldMatrix = tempGlobalMatrix;
                }
            };
            Object3DControllerTarget.prototype.stopTranslation = function () {
                this.startGlobalMatrixVec.length = 0;
            };
            Object3DControllerTarget.prototype.startRotate = function () {
                this.startControllerImageGlobalMatrix3D = this.controllerImage.transform.localToWorldMatrix.clone();
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    this.startGlobalMatrixVec[i] = this._controllerTargets[i].localToWorldMatrix.clone();
                }
            };
            Object3DControllerTarget.prototype.rotate1 = function (angle, normal) {
                if (!this.isWoldCoordinate && this.isBaryCenter) {
                    tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[0]);
                    tempGlobalMatrix.invert();
                    normal = tempGlobalMatrix.deltaTransformVector(normal);
                }
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[i]);
                    if (!this.isWoldCoordinate && this.isBaryCenter) {
                        tempGlobalMatrix.prependRotation(angle, normal);
                    }
                    else {
                        if (this.isBaryCenter) {
                            tempGlobalMatrix.appendRotation(angle, normal, tempGlobalMatrix.position);
                        }
                        else {
                            tempGlobalMatrix.appendRotation(angle, normal, this.startControllerImageGlobalMatrix3D.position);
                        }
                    }
                    this._controllerTargets[i].localToWorldMatrix = tempGlobalMatrix;
                }
            };
            Object3DControllerTarget.prototype.rotate2 = function (angle, normal, angle2, normal2) {
                if (!this.isWoldCoordinate && this.isBaryCenter) {
                    tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[0]);
                    tempGlobalMatrix.invert();
                    normal = tempGlobalMatrix.deltaTransformVector(normal);
                    normal2 = tempGlobalMatrix.deltaTransformVector(normal2);
                }
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    tempGlobalMatrix.copyFrom(this.startGlobalMatrixVec[i]);
                    if (!this.isWoldCoordinate && this.isBaryCenter) {
                        tempGlobalMatrix.prependRotation(angle2, normal2);
                        tempGlobalMatrix.prependRotation(angle, normal);
                    }
                    else {
                        if (this.isBaryCenter) {
                            tempGlobalMatrix.appendRotation(angle, normal, tempGlobalMatrix.position);
                            tempGlobalMatrix.appendRotation(angle2, normal2, tempGlobalMatrix.position);
                        }
                        else {
                            tempGlobalMatrix.appendRotation(angle, normal, this.startControllerImageGlobalMatrix3D.position);
                            tempGlobalMatrix.appendRotation(angle2, normal2, this.startControllerImageGlobalMatrix3D.position);
                        }
                    }
                    this._controllerTargets[i].localToWorldMatrix = tempGlobalMatrix;
                }
            };
            Object3DControllerTarget.prototype.stopRote = function () {
                this.startGlobalMatrixVec.length = 0;
                this.startControllerImageGlobalMatrix3D = null;
            };
            Object3DControllerTarget.prototype.startScale = function () {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    this.startScaleVec[i] = this._controllerTargets[i].getScale();
                }
            };
            Object3DControllerTarget.prototype.doScale = function (scale) {
                feng3d.debuger && feng3d.assert(!!scale.length);
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    var result = this.startScaleVec[i].multiply(scale);
                    this._controllerTargets[i].scaleX = result.x;
                    this._controllerTargets[i].scaleY = result.y;
                    this._controllerTargets[i].scaleZ = result.z;
                }
            };
            Object3DControllerTarget.prototype.stopScale = function () {
                this.startScaleVec.length = 0;
            };
            return Object3DControllerTarget;
        }(feng3d.Component));
        editor.Object3DControllerTarget = Object3DControllerTarget;
        var tempGlobalMatrix = new feng3d.Matrix3D();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DTransformBinding = (function () {
            function Object3DTransformBinding(source) {
                this._sourceChanging = false;
                this._targetChanging = false;
                this._source = source;
            }
            Object.defineProperty(Object3DTransformBinding.prototype, "target", {
                get: function () {
                    return this._target;
                },
                set: function (value) {
                    if (this._target == value) {
                        return;
                    }
                    if (this._target) {
                        this._source.removeEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                        this._target.removeEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onTargetTransformChanged, this);
                    }
                    this._target = value;
                    if (this._target) {
                        this._source.addEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onSourceTransformChanged, this);
                        this._target.addEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onTargetTransformChanged, this);
                        this.doTargetTransformChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object3DTransformBinding.prototype.onSourceTransformChanged = function () {
                if (this._sourceChanging)
                    return;
                this._sourceChanging = true;
                this.doSourceTransformChanged();
                this._sourceChanging = false;
            };
            Object3DTransformBinding.prototype.onTargetTransformChanged = function () {
                if (this._targetChanging)
                    return;
                this._targetChanging = true;
                this.doTargetTransformChanged();
                this._targetChanging = false;
            };
            Object3DTransformBinding.prototype.doSourceTransformChanged = function () {
                this._target.matrix3d = this._source.matrix3d;
            };
            Object3DTransformBinding.prototype.doTargetTransformChanged = function () {
                this._source.matrix3d = this._target.matrix3d;
            };
            return Object3DTransformBinding;
        }());
        editor.Object3DTransformBinding = Object3DTransformBinding;
        var Object3DSceneTransformBinding = (function (_super) {
            __extends(Object3DSceneTransformBinding, _super);
            function Object3DSceneTransformBinding() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object3DSceneTransformBinding.prototype.doSourceTransformChanged = function () {
                this._target.localToWorldMatrix = this._source.localToWorldMatrix;
            };
            Object3DSceneTransformBinding.prototype.doTargetTransformChanged = function () {
                this._source.localToWorldMatrix = this._target.localToWorldMatrix;
            };
            return Object3DSceneTransformBinding;
        }(Object3DTransformBinding));
        editor.Object3DSceneTransformBinding = Object3DSceneTransformBinding;
        var Object3DControllerToolBinding = (function (_super) {
            __extends(Object3DControllerToolBinding, _super);
            function Object3DControllerToolBinding() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object3DControllerToolBinding.prototype.doSourceTransformChanged = function () {
                var targetVec = this._target.localToWorldMatrix.decompose();
                var sourceVec = this._source.localToWorldMatrix.decompose();
                //
                targetVec[0] = sourceVec[0];
                targetVec[1] = sourceVec[1];
                //
                tempMatrix3D.recompose(targetVec);
                this._target.localToWorldMatrix = tempMatrix3D;
            };
            Object3DControllerToolBinding.prototype.doTargetTransformChanged = function () {
                var targetVec = this._target.localToWorldMatrix.decompose();
                var sourceVec = this._source.localToWorldMatrix.decompose();
                //
                sourceVec[0] = targetVec[0];
                sourceVec[1] = targetVec[1];
                //
                tempMatrix3D.recompose(sourceVec);
                this._source.localToWorldMatrix = tempMatrix3D;
            };
            return Object3DControllerToolBinding;
        }(Object3DSceneTransformBinding));
        editor.Object3DControllerToolBinding = Object3DControllerToolBinding;
        var Object3DMoveBinding = (function (_super) {
            __extends(Object3DMoveBinding, _super);
            function Object3DMoveBinding() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object3DMoveBinding.prototype.doSourceTransformChanged = function () {
                var targetVec = this._target.localToWorldMatrix.decompose();
                var sourceVec = this._source.localToWorldMatrix.decompose();
                //
                targetVec[0] = sourceVec[0];
                //
                tempMatrix3D.recompose(targetVec);
                this._target.localToWorldMatrix = tempMatrix3D;
            };
            return Object3DMoveBinding;
        }(Object3DControllerToolBinding));
        editor.Object3DMoveBinding = Object3DMoveBinding;
        var Object3DRotationBinding = (function (_super) {
            __extends(Object3DRotationBinding, _super);
            function Object3DRotationBinding() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object3DRotationBinding.prototype.doSourceTransformChanged = function () {
                var targetVec = this._target.localToWorldMatrix.decompose();
                var sourceVec = this._source.localToWorldMatrix.decompose();
                //
                targetVec[1] = sourceVec[1];
                //
                tempMatrix3D.recompose(targetVec);
                this._target.localToWorldMatrix = tempMatrix3D;
            };
            return Object3DRotationBinding;
        }(Object3DControllerToolBinding));
        editor.Object3DRotationBinding = Object3DRotationBinding;
        var Object3DScaleBinding = (function (_super) {
            __extends(Object3DScaleBinding, _super);
            function Object3DScaleBinding() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object3DScaleBinding.prototype.doSourceTransformChanged = function () {
                //不改变目标
            };
            return Object3DScaleBinding;
        }(Object3DControllerToolBinding));
        editor.Object3DScaleBinding = Object3DScaleBinding;
        var tempMatrix3D = new feng3d.Matrix3D();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DMoveModel = (function (_super) {
            __extends(Object3DMoveModel, _super);
            function Object3DMoveModel(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.name = "Object3DMoveModel";
                _this.initModels();
                return _this;
            }
            Object3DMoveModel.prototype.initModels = function () {
                var xAxis = feng3d.GameObject.create("xAxis");
                this.xAxis = xAxis.addComponent(CoordinateAxis);
                this.xAxis.color.setTo(1, 0, 0);
                xAxis.transform.rotationZ = -90;
                this.transform.addChild(xAxis.transform);
                var yAxis = feng3d.GameObject.create("yAxis");
                this.yAxis = yAxis.addComponent(CoordinateAxis);
                this.yAxis.color.setTo(0, 1, 0);
                this.transform.addChild(yAxis.transform);
                var zAxis = feng3d.GameObject.create("zAxis");
                this.zAxis = zAxis.addComponent(CoordinateAxis);
                this.zAxis.color.setTo(0, 0, 1);
                zAxis.transform.rotationX = 90;
                this.transform.addChild(zAxis.transform);
                var yzPlane = feng3d.GameObject.create("yzPlane");
                this.yzPlane = yzPlane.addComponent(CoordinatePlane);
                this.yzPlane.color.setTo(1, 0, 0, 0.2);
                this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
                this.yzPlane.borderColor.setTo(1, 0, 0);
                yzPlane.transform.rotationZ = 90;
                this.transform.addChild(this.yzPlane.transform);
                this.xzPlane = feng3d.GameObject.create("xzPlane").addComponent(CoordinatePlane);
                this.xzPlane.color.setTo(0, 1, 0, 0.2);
                this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
                this.xzPlane.borderColor.setTo(0, 1, 0);
                this.transform.addChild(this.xzPlane.transform);
                this.xyPlane = feng3d.GameObject.create("xyPlane").addComponent(CoordinatePlane);
                this.xyPlane.color.setTo(0, 0, 1, 0.2);
                this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
                this.xyPlane.borderColor.setTo(0, 0, 1);
                this.xyPlane.transform.rotationX = -90;
                this.transform.addChild(this.xyPlane.transform);
                this.oCube = feng3d.GameObject.create("oCube").addComponent(CoordinateCube);
                this.transform.addChild(this.oCube.transform);
            };
            return Object3DMoveModel;
        }(feng3d.Component));
        editor.Object3DMoveModel = Object3DMoveModel;
        var CoordinateAxis = (function (_super) {
            __extends(CoordinateAxis, _super);
            function CoordinateAxis(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this.length = 100;
                _this._selected = false;
                var xLine = feng3d.GameObject.create();
                var segmentGeometry = xLine.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, _this.length, 0));
                segmentGeometry.addSegment(segment);
                _this.segmentMaterial = xLine.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.transform.addChild(xLine.transform);
                //
                _this.xArrow = feng3d.GameObject.create();
                _this.xArrow.addComponent(feng3d.MeshFilter).mesh = new feng3d.ConeGeometry(5, 18);
                _this.material = _this.xArrow.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
                _this.xArrow.transform.y = _this.length;
                _this.transform.addChild(_this.xArrow.transform);
                _this.update();
                var mouseHit = feng3d.GameObject.create("hit");
                mouseHit.addComponent(feng3d.MeshFilter).mesh = new feng3d.CylinderGeometry(5, 5, _this.length - 20);
                mouseHit.transform.y = 20 + (_this.length - 20) / 2;
                mouseHit.transform.visible = false;
                mouseHit.transform.mouseEnabled = true;
                _this.transform.addChild(mouseHit.transform);
                return _this;
            }
            Object.defineProperty(CoordinateAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateAxis.prototype.update = function () {
                this.segmentMaterial.color.copyFrom(this.selected ? this.selectedColor : this.color);
                //
                this.material.color = this.selected ? this.selectedColor : this.color;
            };
            return CoordinateAxis;
        }(feng3d.Component));
        editor.CoordinateAxis = CoordinateAxis;
        var CoordinateCube = (function (_super) {
            __extends(CoordinateCube, _super);
            function CoordinateCube(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 1, 1);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this._selected = false;
                //
                _this.oCube = feng3d.GameObject.create();
                _this.oCube.addComponent(feng3d.MeshFilter).mesh = new feng3d.CubeGeometry(8, 8, 8);
                _this.colorMaterial = _this.oCube.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
                _this.oCube.transform.mouseEnabled = true;
                _this.transform.addChild(_this.oCube.transform);
                _this.update();
                return _this;
            }
            Object.defineProperty(CoordinateCube.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateCube.prototype.update = function () {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
            };
            return CoordinateCube;
        }(feng3d.Component));
        editor.CoordinateCube = CoordinateCube;
        var CoordinatePlane = (function (_super) {
            __extends(CoordinatePlane, _super);
            function CoordinatePlane(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 0, 0, 0.2);
                _this.borderColor = new feng3d.Color(1, 0, 0);
                _this.selectedColor = new feng3d.Color(1, 0, 0, 0.5);
                _this.selectedborderColor = new feng3d.Color(1, 1, 0);
                _this._width = 20;
                _this._selected = false;
                var plane = feng3d.GameObject.create("plane");
                plane.transform.x = plane.transform.z = _this._width / 2;
                plane.addComponent(feng3d.MeshFilter).mesh = new feng3d.PlaneGeometry(_this._width, _this._width);
                _this.colorMaterial = plane.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
                plane.transform.mouseEnabled = true;
                _this.transform.addChild(plane.transform);
                var border = feng3d.GameObject.create("border");
                _this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.transform.addChild(border.transform);
                _this.update();
                return _this;
            }
            Object.defineProperty(CoordinatePlane.prototype, "width", {
                //
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinatePlane.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinatePlane.prototype.update = function () {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(0, 0, 0), new feng3d.Vector3D(this._width, 0, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(this._width, 0, 0), new feng3d.Vector3D(this._width, 0, this._width));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(this._width, 0, this._width), new feng3d.Vector3D(0, 0, this._width));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(0, 0, this._width), new feng3d.Vector3D(0, 0, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
            };
            return CoordinatePlane;
        }(feng3d.Component));
        editor.CoordinatePlane = CoordinatePlane;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DRotationModel = (function (_super) {
            __extends(Object3DRotationModel, _super);
            function Object3DRotationModel(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.gameObject.name = "Object3DRotationModel";
                _this.initModels();
                return _this;
            }
            Object3DRotationModel.prototype.initModels = function () {
                this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateRotationAxis);
                this.xAxis.color.setTo(1, 0, 0);
                this.xAxis.update();
                this.xAxis.transform.rotationY = 90;
                this.transform.addChild(this.xAxis.transform);
                this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateRotationAxis);
                this.yAxis.color.setTo(0, 1, 0);
                this.yAxis.update();
                this.yAxis.transform.rotationX = 90;
                this.transform.addChild(this.yAxis.transform);
                this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateRotationAxis);
                this.zAxis.color.setTo(0, 0, 1);
                this.zAxis.update();
                this.transform.addChild(this.zAxis.transform);
                this.cameraAxis = feng3d.GameObject.create("cameraAxis").addComponent(CoordinateRotationAxis);
                this.cameraAxis.color.setTo(1, 1, 1);
                this.zAxis.update();
                this.transform.addChild(this.cameraAxis.transform);
                this.freeAxis = feng3d.GameObject.create("freeAxis").addComponent(CoordinateRotationFreeAxis);
                this.freeAxis.color.setTo(1, 1, 1);
                this.freeAxis.update();
                this.transform.addChild(this.freeAxis.transform);
            };
            return Object3DRotationModel;
        }(feng3d.Component));
        editor.Object3DRotationModel = Object3DRotationModel;
        var CoordinateRotationAxis = (function (_super) {
            __extends(CoordinateRotationAxis, _super);
            function CoordinateRotationAxis(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.radius = 80;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.backColor = new feng3d.Color(0.6, 0.6, 0.6);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this._selected = false;
                _this.initModels();
                return _this;
            }
            Object.defineProperty(CoordinateRotationAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinateRotationAxis.prototype, "filterNormal", {
                /**
                 * 过滤法线显示某一面线条
                 */
                get: function () { return this._filterNormal; },
                set: function (value) { this._filterNormal = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateRotationAxis.prototype.initModels = function () {
                var border = feng3d.GameObject.create();
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                this.transform.addChild(border.transform);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorObject3D);
                var mouseHit = feng3d.GameObject.create("hit");
                this.torusGeometry = mouseHit.addComponent(feng3d.MeshFilter).mesh = new feng3d.TorusGeometry(this.radius, 2);
                mouseHit.addComponent(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
                mouseHit.transform.rotationX = 90;
                mouseHit.transform.visible = false;
                mouseHit.transform.mouseEnabled = true;
                this.transform.addChild(mouseHit.transform);
                this.update();
            };
            CoordinateRotationAxis.prototype.update = function () {
                this.sector.radius = this.radius;
                this.torusGeometry.radius = this.radius;
                var color = this._selected ? this.selectedColor : this.color;
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                if (this._filterNormal) {
                    var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this._filterNormal);
                }
                this.segmentGeometry.removeAllSegments();
                var points = [];
                for (var i = 0; i <= 360; i++) {
                    points[i] = new feng3d.Vector3D(Math.sin(i * feng3d.MathConsts.DEGREES_TO_RADIANS), Math.cos(i * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                    points[i].scaleBy(this.radius);
                    if (i > 0) {
                        var show = true;
                        if (localNormal) {
                            show = points[i - 1].dotProduct(localNormal) > 0 && points[i].dotProduct(localNormal) > 0;
                        }
                        if (show) {
                            var segment = new feng3d.Segment(points[i - 1], points[i]);
                            segment.startColor = segment.endColor = color;
                            this.segmentGeometry.addSegment(segment);
                        }
                        else if (this.selected) {
                            var segment = new feng3d.Segment(points[i - 1], points[i]);
                            segment.startColor = segment.endColor = this.backColor;
                            this.segmentGeometry.addSegment(segment);
                        }
                    }
                }
            };
            CoordinateRotationAxis.prototype.showSector = function (startPos, endPos) {
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
                var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
                var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                //
                var min = Math.min(startAngle, endAngle);
                var max = Math.max(startAngle, endAngle);
                if (max - min > 180) {
                    min += 360;
                }
                this.sector.update(min, max);
                this.transform.addChild(this.sector.transform);
            };
            CoordinateRotationAxis.prototype.hideSector = function () {
                this.transform.removeChild(this.sector.transform);
            };
            return CoordinateRotationAxis;
        }(feng3d.Component));
        editor.CoordinateRotationAxis = CoordinateRotationAxis;
        /**
         * 扇形对象
         */
        var SectorObject3D = (function (_super) {
            __extends(SectorObject3D, _super);
            /**
             * 构建3D对象
             */
            function SectorObject3D(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.borderColor = new feng3d.Color(0, 1, 1, 0.6);
                _this.radius = 80;
                _this._start = 0;
                _this._end = 0;
                _this.gameObject.name = "sector";
                _this.geometry = _this.gameObject.addComponent(feng3d.MeshFilter).mesh = new feng3d.Geometry();
                _this.gameObject.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial(new feng3d.Color(0.5, 0.5, 0.5, 0.2));
                var border = feng3d.GameObject.create("border");
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                _this.transform.addChild(border.transform);
                _this.update(0, 0);
                return _this;
            }
            SectorObject3D.prototype.update = function (start, end) {
                if (start === void 0) { start = 0; }
                if (end === void 0) { end = 0; }
                this._start = Math.min(start, end);
                this._end = Math.max(start, end);
                var length = Math.floor(this._end - this._start);
                if (length == 0)
                    length = 1;
                var vertexPositionData = new Float32Array((length + 2) * 3);
                var indices = new Uint16Array(length * 3);
                vertexPositionData[0] = 0;
                vertexPositionData[1] = 0;
                vertexPositionData[2] = 0;
                for (var i = 0; i < length; i++) {
                    vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * feng3d.MathConsts.DEGREES_TO_RADIANS);
                    vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * feng3d.MathConsts.DEGREES_TO_RADIANS);
                    vertexPositionData[i * 3 + 5] = 0;
                    if (i > 0) {
                        indices[(i - 1) * 3] = 0;
                        indices[(i - 1) * 3 + 1] = i;
                        indices[(i - 1) * 3 + 2] = i + 1;
                    }
                }
                this.geometry.setVAData("a_position", vertexPositionData, 3);
                this.geometry.setIndices(indices);
                //绘制边界
                var startPoint = new feng3d.Vector3D(this.radius * Math.cos((this._start - 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._start - 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                var endPoint = new feng3d.Vector3D(this.radius * Math.cos((this._end + 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._end + 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                //
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), startPoint);
                segment.startColor = segment.endColor = this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(), endPoint);
                segment.startColor = segment.endColor = this.borderColor;
                this.segmentGeometry.addSegment(segment);
            };
            return SectorObject3D;
        }(feng3d.Component));
        editor.SectorObject3D = SectorObject3D;
        var CoordinateRotationFreeAxis = (function (_super) {
            __extends(CoordinateRotationFreeAxis, _super);
            function CoordinateRotationFreeAxis(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.radius = 80;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.backColor = new feng3d.Color(0.6, 0.6, 0.6);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this._selected = false;
                _this.initModels();
                return _this;
            }
            Object.defineProperty(CoordinateRotationFreeAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateRotationFreeAxis.prototype.initModels = function () {
                var border = feng3d.GameObject.create("border");
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                this.transform.addChild(border.transform);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorObject3D);
                this.sector.update(0, 360);
                this.sector.transform.visible = false;
                this.sector.transform.mouseEnabled = true;
                this.transform.addChild(this.sector.transform);
                this.update();
            };
            CoordinateRotationFreeAxis.prototype.update = function () {
                this.sector.radius = this.radius;
                var color = this._selected ? this.selectedColor : this.color;
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                this.segmentGeometry.removeAllSegments();
                var points = [];
                for (var i = 0; i <= 360; i++) {
                    points[i] = new feng3d.Vector3D(Math.sin(i * feng3d.MathConsts.DEGREES_TO_RADIANS), Math.cos(i * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                    points[i].scaleBy(this.radius);
                    if (i > 0) {
                        var segment = new feng3d.Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = color;
                        this.segmentGeometry.addSegment(segment);
                    }
                }
            };
            return CoordinateRotationFreeAxis;
        }(feng3d.Component));
        editor.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DScaleModel = (function (_super) {
            __extends(Object3DScaleModel, _super);
            function Object3DScaleModel(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.gameObject.name = "Object3DScaleModel";
                _this.initModels();
                return _this;
            }
            Object3DScaleModel.prototype.initModels = function () {
                this.xCube = feng3d.GameObject.create("xCube").addComponent(CoordinateScaleCube);
                this.xCube.color.setTo(1, 0, 0);
                this.xCube.update();
                this.xCube.transform.rotationZ = -90;
                this.transform.addChild(this.xCube.transform);
                this.yCube = feng3d.GameObject.create("yCube").addComponent(CoordinateScaleCube);
                this.yCube.color.setTo(0, 1, 0);
                this.yCube.update();
                this.transform.addChild(this.yCube.transform);
                this.zCube = feng3d.GameObject.create("zCube").addComponent(CoordinateScaleCube);
                this.zCube.color.setTo(0, 0, 1);
                this.zCube.update();
                this.zCube.transform.rotationX = 90;
                this.transform.addChild(this.zCube.transform);
                this.oCube = feng3d.GameObject.create("oCube").addComponent(editor.CoordinateCube);
                this.transform.addChild(this.oCube.transform);
            };
            return Object3DScaleModel;
        }(feng3d.Component));
        editor.Object3DScaleModel = Object3DScaleModel;
        var CoordinateScaleCube = (function (_super) {
            __extends(CoordinateScaleCube, _super);
            function CoordinateScaleCube(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this.length = 100;
                _this._selected = false;
                _this._scale = 1;
                var xLine = feng3d.GameObject.create();
                xLine.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.segmentGeometry = xLine.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                _this.transform.addChild(xLine.transform);
                _this.coordinateCube = feng3d.GameObject.create("coordinateCube").addComponent(editor.CoordinateCube);
                _this.transform.addChild(_this.coordinateCube.transform);
                var mouseHit = feng3d.GameObject.create("hit");
                mouseHit.addComponent(feng3d.MeshFilter).mesh = new feng3d.CylinderGeometry(5, 5, _this.length - 4);
                mouseHit.addComponent(feng3d.MeshRenderer);
                mouseHit.transform.y = 4 + (_this.length - 4) / 2;
                mouseHit.transform.visible = false;
                mouseHit.transform.mouseEnabled = true;
                _this.transform.addChild(mouseHit.transform);
                _this.update();
                return _this;
            }
            Object.defineProperty(CoordinateScaleCube.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinateScaleCube.prototype, "scaleValue", {
                //
                get: function () { return this._scale; },
                set: function (value) { if (this._scale == value)
                    return; this._scale = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateScaleCube.prototype.update = function () {
                this.coordinateCube.color = this.color;
                this.coordinateCube.selectedColor = this.selectedColor;
                this.coordinateCube.update();
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, this._scale * this.length, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
                this.segmentGeometry.addSegment(segment);
                //
                this.coordinateCube.transform.y = this.length * this._scale;
                this.coordinateCube.selected = this.selected;
            };
            return CoordinateScaleCube;
        }(feng3d.Component));
        editor.CoordinateScaleCube = CoordinateScaleCube;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DControllerToolBase = (function (_super) {
            __extends(Object3DControllerToolBase, _super);
            function Object3DControllerToolBase(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.ismouseDown = false;
                _this.transform.holdSize = 1;
                _this.transform.addEventListener(feng3d.Scene3DEvent.ADDED_TO_SCENE, _this.onAddedToScene, _this);
                _this.transform.addEventListener(feng3d.Scene3DEvent.REMOVED_FROM_SCENE, _this.onRemovedFromScene, _this);
                return _this;
            }
            Object3DControllerToolBase.prototype.onAddedToScene = function () {
                this.updateToolModel();
                feng3d.input.addEventListener(feng3d.inputType.MOUSE_DOWN, this.onMouseDown, this);
                feng3d.input.addEventListener(feng3d.inputType.MOUSE_UP, this.onMouseUp, this);
                this.addEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                editor.editor3DData.cameraObject3D.transform.addEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            };
            Object3DControllerToolBase.prototype.onRemovedFromScene = function () {
                feng3d.input.removeEventListener(feng3d.inputType.MOUSE_DOWN, this.onMouseDown, this);
                feng3d.input.removeEventListener(feng3d.inputType.MOUSE_UP, this.onMouseUp, this);
                this.removeEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
                editor.editor3DData.cameraObject3D.transform.removeEventListener(feng3d.Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            };
            Object.defineProperty(Object3DControllerToolBase.prototype, "toolModel", {
                get: function () {
                    return this._toolModel;
                },
                set: function (value) {
                    if (this._toolModel)
                        this.transform.removeChild(this._toolModel.transform);
                    this._toolModel = value;
                    ;
                    if (this._toolModel) {
                        this.transform.addChild(this._toolModel.transform);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerToolBase.prototype, "selectedItem", {
                get: function () {
                    return this._selectedItem;
                },
                set: function (value) {
                    if (this._selectedItem == value)
                        return;
                    if (this._selectedItem)
                        this._selectedItem.selected = false;
                    this._selectedItem = value;
                    if (this._selectedItem)
                        this._selectedItem.selected = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Object3DControllerToolBase.prototype, "bindingObject3D", {
                get: function () {
                    return this.object3DControllerToolBingding.target.getComponent(editor.Object3DControllerTarget);
                },
                set: function (value) {
                    this.object3DControllerToolBingding.target = value.transform;
                },
                enumerable: true,
                configurable: true
            });
            Object3DControllerToolBase.prototype.updateToolModel = function () {
            };
            Object3DControllerToolBase.prototype.onMouseDown = function () {
                this.selectedItem = null;
                this.ismouseDown = true;
            };
            Object3DControllerToolBase.prototype.onMouseUp = function () {
                this.ismouseDown = false;
                this.movePlane3D = null;
                this.startSceneTransform = null;
            };
            Object3DControllerToolBase.prototype.onItemMouseDown = function (event) {
                this.selectedItem = event.currentTarget;
            };
            Object3DControllerToolBase.prototype.onScenetransformChanged = function () {
                this.updateToolModel();
            };
            Object3DControllerToolBase.prototype.onCameraScenetransformChanged = function () {
                this.updateToolModel();
            };
            /**
             * 获取鼠标射线与移动平面的交点（模型空间）
             */
            Object3DControllerToolBase.prototype.getLocalMousePlaneCross = function () {
                //射线与平面交点
                var crossPos = this.getMousePlaneCross();
                //把交点从世界转换为模型空间
                var inverseGlobalMatrix3D = this.startSceneTransform.clone();
                inverseGlobalMatrix3D.invert();
                crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
                return crossPos;
            };
            Object3DControllerToolBase.prototype.getMousePlaneCross = function () {
                var line3D = editor.editor3DData.view3D.getMouseRay3D();
                //射线与平面交点
                var crossPos = this.movePlane3D.lineCross(line3D);
                return crossPos;
            };
            return Object3DControllerToolBase;
        }(feng3d.Component));
        editor.Object3DControllerToolBase = Object3DControllerToolBase;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DMoveTool = (function (_super) {
            __extends(Object3DMoveTool, _super);
            function Object3DMoveTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                /**
                 * 用于判断是否改变了XYZ
                 */
                _this.changeXYZ = new feng3d.Vector3D();
                _this.object3DControllerToolBingding = new editor.Object3DMoveBinding(_this.transform);
                _this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DMoveModel);
                return _this;
            }
            Object3DMoveTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xAxis.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yAxis.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.zAxis.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yzPlane.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.xzPlane.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.xyPlane.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.oCube.transform.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            };
            Object3DMoveTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xAxis.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yAxis.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.zAxis.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yzPlane.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.xzPlane.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.xyPlane.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.oCube.transform.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            };
            Object3DMoveTool.prototype.onItemMouseDown = function (event) {
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var po = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 0));
                var px = globalMatrix3D.transformVector(new feng3d.Vector3D(1, 0, 0));
                var py = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 1, 0));
                var pz = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 1));
                //
                var ox = px.subtract(po);
                var oy = py.subtract(po);
                var oz = pz.subtract(po);
                //摄像机前方方向
                var cameraSceneTransform = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                this.movePlane3D = new feng3d.Plane3D();
                var selectedTransform = event.currentTarget;
                //
                switch (selectedTransform) {
                    case this.toolModel.xAxis.transform:
                        this.selectedItem = this.toolModel.xAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                        this.changeXYZ.setTo(1, 0, 0);
                        break;
                    case this.toolModel.yAxis.transform:
                        this.selectedItem = this.toolModel.yAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                        this.changeXYZ.setTo(0, 1, 0);
                        break;
                    case this.toolModel.zAxis.transform:
                        this.selectedItem = this.toolModel.zAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                        this.changeXYZ.setTo(0, 0, 1);
                        break;
                    case this.toolModel.yzPlane.transform:
                        this.selectedItem = this.toolModel.yzPlane;
                        this.movePlane3D.fromPoints(po, py, pz);
                        this.changeXYZ.setTo(0, 1, 1);
                        break;
                    case this.toolModel.xzPlane.transform:
                        this.selectedItem = this.toolModel.xzPlane;
                        this.movePlane3D.fromPoints(po, px, pz);
                        this.changeXYZ.setTo(1, 0, 1);
                        break;
                    case this.toolModel.xyPlane.transform:
                        this.selectedItem = this.toolModel.xyPlane;
                        this.movePlane3D.fromPoints(po, px, py);
                        this.changeXYZ.setTo(1, 1, 0);
                        break;
                    case this.toolModel.oCube.transform:
                        this.selectedItem = this.toolModel.oCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                        this.changeXYZ.setTo(1, 1, 1);
                        break;
                }
                //
                this.startSceneTransform = globalMatrix3D.clone();
                this.startPlanePos = this.getLocalMousePlaneCross();
                this.startPos = this.toolModel.transform.getPosition();
                this.bindingObject3D.startTranslation();
                //
                feng3d.input.addEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
            };
            Object3DMoveTool.prototype.onMouseMove = function () {
                var crossPos = this.getLocalMousePlaneCross();
                var addPos = crossPos.subtract(this.startPlanePos);
                addPos.x *= this.changeXYZ.x;
                addPos.y *= this.changeXYZ.y;
                addPos.z *= this.changeXYZ.z;
                var sceneTransform = this.startSceneTransform.clone();
                sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
                var sceneAddpos = sceneTransform.position.subtract(this.startSceneTransform.position);
                this.bindingObject3D.translation(sceneAddpos);
            };
            Object3DMoveTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.input.removeEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
                this.bindingObject3D.stopTranslation();
                this.startPos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
                this.updateToolModel();
            };
            Object3DMoveTool.prototype.updateToolModel = function () {
                //鼠标按下时不更新
                if (this.ismouseDown)
                    return;
                var cameraPos = editor.editor3DData.cameraObject3D.transform.scenePosition;
                var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
                this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
                this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
            };
            return Object3DMoveTool;
        }(editor.Object3DControllerToolBase));
        editor.Object3DMoveTool = Object3DMoveTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DRotationTool = (function (_super) {
            __extends(Object3DRotationTool, _super);
            function Object3DRotationTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.object3DControllerToolBingding = new editor.Object3DRotationBinding(_this.transform);
                _this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DRotationModel);
                return _this;
            }
            Object3DRotationTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xAxis.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yAxis.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.zAxis.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.freeAxis.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.cameraAxis.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            };
            Object3DRotationTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xAxis.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yAxis.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.zAxis.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.freeAxis.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.cameraAxis.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            };
            Object3DRotationTool.prototype.onItemMouseDown = function (event) {
                _super.prototype.onItemMouseDown.call(this, event);
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var pos = globalMatrix3D.position;
                var xDir = globalMatrix3D.right;
                var yDir = globalMatrix3D.up;
                var zDir = globalMatrix3D.forward;
                //摄像机前方方向
                var cameraSceneTransform = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                var cameraPos = cameraSceneTransform.position;
                this.movePlane3D = new feng3d.Plane3D();
                switch (this.selectedItem) {
                    case this.toolModel.xAxis:
                        this.movePlane3D.fromNormalAndPoint(xDir, pos);
                        break;
                    case this.toolModel.yAxis:
                        this.movePlane3D.fromNormalAndPoint(yDir, pos);
                        break;
                    case this.toolModel.zAxis:
                        this.movePlane3D.fromNormalAndPoint(zDir, pos);
                        break;
                    case this.toolModel.freeAxis:
                        this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                        break;
                    case this.toolModel.cameraAxis:
                        this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                        break;
                }
                this.startPlanePos = this.getMousePlaneCross();
                this.startMousePos = editor.editor3DData.mouseInView3D.clone();
                this.startSceneTransform = globalMatrix3D.clone();
                this.bindingObject3D.startRotate();
                //
                feng3d.input.addEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
            };
            Object3DRotationTool.prototype.onMouseMove = function () {
                switch (this.selectedItem) {
                    case this.toolModel.xAxis:
                    case this.toolModel.yAxis:
                    case this.toolModel.zAxis:
                    case this.toolModel.cameraAxis:
                        var origin = this.startSceneTransform.position;
                        var planeCross = this.getMousePlaneCross();
                        var startDir = this.startPlanePos.subtract(origin);
                        startDir.normalize();
                        var endDir = planeCross.subtract(origin);
                        endDir.normalize();
                        //计算夹角
                        var cosValue = startDir.dotProduct(endDir);
                        var angle = Math.acos(cosValue) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                        //计算是否顺时针
                        var sign = this.movePlane3D.normal.crossProduct(startDir).dotProduct(endDir);
                        sign = sign > 0 ? 1 : -1;
                        angle = angle * sign;
                        //
                        this.bindingObject3D.rotate1(angle, this.movePlane3D.normal);
                        //绘制扇形区域
                        if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                            this.selectedItem.showSector(this.startPlanePos, planeCross);
                        }
                        break;
                    case this.toolModel.freeAxis:
                        var endPoint = editor.editor3DData.mouseInView3D.clone();
                        var offset = endPoint.subtract(this.startMousePos);
                        var cameraSceneTransform = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix;
                        var right = cameraSceneTransform.right;
                        var up = cameraSceneTransform.up;
                        this.bindingObject3D.rotate2(-offset.y, right, -offset.x, up);
                        //
                        this.startMousePos = endPoint;
                        this.bindingObject3D.startRotate();
                        break;
                }
            };
            Object3DRotationTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.input.removeEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
                if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                    this.selectedItem.hideSector();
                }
                this.bindingObject3D.stopRote();
                this.startMousePos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
            };
            Object3DRotationTool.prototype.updateToolModel = function () {
                var cameraSceneTransform = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix.clone();
                var cameraDir = cameraSceneTransform.forward;
                cameraDir.negate();
                //
                var xyzAxis = [this.toolModel.xAxis, this.toolModel.yAxis, this.toolModel.zAxis];
                for (var i = 0; i < xyzAxis.length; i++) {
                    var axis = xyzAxis[i];
                    axis.filterNormal = cameraDir;
                }
                //朝向摄像机
                var temp = cameraSceneTransform.clone();
                temp.append(this.toolModel.transform.worldToLocalMatrix);
                var rotation = temp.decompose()[1];
                rotation.scaleBy(feng3d.MathConsts.RADIANS_TO_DEGREES);
                this.toolModel.freeAxis.transform.setRotation(rotation.x, rotation.y, rotation.z);
                this.toolModel.cameraAxis.transform.setRotation(rotation.x, rotation.y, rotation.z);
            };
            return Object3DRotationTool;
        }(editor.Object3DControllerToolBase));
        editor.Object3DRotationTool = Object3DRotationTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DScaleTool = (function (_super) {
            __extends(Object3DScaleTool, _super);
            function Object3DScaleTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                /**
                 * 用于判断是否改变了XYZ
                 */
                _this.changeXYZ = new feng3d.Vector3D();
                _this.object3DControllerToolBingding = new editor.Object3DScaleBinding(_this.transform);
                _this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DScaleModel);
                return _this;
            }
            Object3DScaleTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xCube.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yCube.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.zCube.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.oCube.addEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            };
            Object3DScaleTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xCube.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.yCube.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.zCube.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
                this.toolModel.oCube.removeEventListener(feng3d.Mouse3DEvent.MOUSE_DOWN, this.onItemMouseDown, this);
            };
            Object3DScaleTool.prototype.onItemMouseDown = function (event) {
                _super.prototype.onItemMouseDown.call(this, event);
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var po = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 0));
                var px = globalMatrix3D.transformVector(new feng3d.Vector3D(1, 0, 0));
                var py = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 1, 0));
                var pz = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 1));
                //
                var ox = px.subtract(po);
                var oy = py.subtract(po);
                var oz = pz.subtract(po);
                //摄像机前方方向
                var cameraSceneTransform = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                this.movePlane3D = new feng3d.Plane3D();
                switch (this.selectedItem) {
                    case this.toolModel.xCube:
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                        this.changeXYZ.setTo(1, 0, 0);
                        break;
                    case this.toolModel.yCube:
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                        this.changeXYZ.setTo(0, 1, 0);
                        break;
                    case this.toolModel.zCube:
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                        this.changeXYZ.setTo(0, 0, 1);
                        break;
                    case this.toolModel.oCube:
                        this.startMousePos = editor.editor3DData.mouseInView3D.clone();
                        this.changeXYZ.setTo(1, 1, 1);
                        break;
                }
                this.startSceneTransform = globalMatrix3D.clone();
                this.startPlanePos = this.getLocalMousePlaneCross();
                this.bindingObject3D.startScale();
                //
                feng3d.input.addEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
            };
            Object3DScaleTool.prototype.onMouseMove = function () {
                var addPos = new feng3d.Vector3D();
                var addScale = new feng3d.Vector3D();
                if (this.selectedItem == this.toolModel.oCube) {
                    var currentMouse = editor.editor3DData.mouseInView3D;
                    var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                    addPos.setTo(distance, distance, distance);
                    var scale = 1 + (addPos.x + addPos.y) / (editor.editor3DData.view3DRect.height);
                    addScale.setTo(scale, scale, scale);
                }
                else {
                    var crossPos = this.getLocalMousePlaneCross();
                    var offset = crossPos.subtract(this.startPlanePos);
                    if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0) {
                        addScale.x = offset.x / this.startPlanePos.x;
                    }
                    if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0) {
                        addScale.y = offset.y / this.startPlanePos.y;
                    }
                    if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0) {
                        addScale.z = offset.z / this.startPlanePos.z;
                    }
                    addScale.x += 1;
                    addScale.y += 1;
                    addScale.z += 1;
                }
                this.bindingObject3D.doScale(addScale);
                //
                this.toolModel.xCube.scaleValue = addScale.x;
                this.toolModel.yCube.scaleValue = addScale.y;
                this.toolModel.zCube.scaleValue = addScale.z;
            };
            Object3DScaleTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.input.removeEventListener(feng3d.inputType.MOUSE_MOVE, this.onMouseMove, this);
                this.startPlanePos = null;
                this.startSceneTransform = null;
                //
                this.toolModel.xCube.scaleValue = 1;
                this.toolModel.yCube.scaleValue = 1;
                this.toolModel.zCube.scaleValue = 1;
            };
            return Object3DScaleTool;
        }(editor.Object3DControllerToolBase));
        editor.Object3DScaleTool = Object3DScaleTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DControllerTool = (function (_super) {
            __extends(Object3DControllerTool, _super);
            function Object3DControllerTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.object3DControllerTarget = feng3d.GameObject.create("object3DControllerTarget").addComponent(editor.Object3DControllerTarget);
                _this.object3DMoveTool = feng3d.GameObject.create("object3DMoveTool").addComponent(editor.Object3DMoveTool);
                _this.object3DRotationTool = feng3d.GameObject.create("object3DRotationTool").addComponent(editor.Object3DRotationTool);
                _this.object3DScaleTool = feng3d.GameObject.create("object3DScaleTool").addComponent(editor.Object3DScaleTool);
                _this.object3DMoveTool.bindingObject3D = _this.object3DControllerTarget;
                _this.object3DRotationTool.bindingObject3D = _this.object3DControllerTarget;
                _this.object3DScaleTool.bindingObject3D = _this.object3DControllerTarget;
                //
                _this.currentTool = _this.object3DMoveTool;
                feng3d.Watcher.watch(editor.editor3DData, ["object3DOperationID"], _this.onObject3DOperationIDChange, _this);
                feng3d.shortcut.addEventListener("object3DMoveTool", _this.onObject3DMoveTool, _this);
                feng3d.shortcut.addEventListener("object3DRotationTool", _this.onObject3DRotationTool, _this);
                feng3d.shortcut.addEventListener("object3DScaleTool", _this.onObject3DScaleTool, _this);
                feng3d.Watcher.watch(editor.editor3DData, ["selectedObject3D"], _this.onSelectedObject3DChange, _this);
                return _this;
            }
            Object3DControllerTool.prototype.onSelectedObject3DChange = function () {
                if (editor.editor3DData.selectedObject3D) {
                    this.object3DControllerTarget.controllerTargets = [editor.editor3DData.selectedObject3D.transform];
                    editor.editor3DData.scene3D.transform.addChild(this.transform);
                }
                else {
                    this.object3DControllerTarget.controllerTargets = null;
                    editor.editor3DData.scene3D.transform.removeChild(this.transform);
                }
            };
            Object3DControllerTool.prototype.onObject3DOperationIDChange = function () {
                switch (editor.editor3DData.object3DOperationID) {
                    case 0:
                        this.currentTool = this.object3DMoveTool;
                        break;
                    case 1:
                        this.currentTool = this.object3DRotationTool;
                        break;
                    case 2:
                        this.currentTool = this.object3DScaleTool;
                        break;
                }
            };
            Object3DControllerTool.prototype.onObject3DMoveTool = function () {
                editor.editor3DData.object3DOperationID = 0;
            };
            Object3DControllerTool.prototype.onObject3DRotationTool = function () {
                editor.editor3DData.object3DOperationID = 1;
            };
            Object3DControllerTool.prototype.onObject3DScaleTool = function () {
                editor.editor3DData.object3DOperationID = 2;
            };
            Object.defineProperty(Object3DControllerTool.prototype, "currentTool", {
                set: function (value) {
                    if (this._currentTool == value)
                        return;
                    if (this._currentTool) {
                        this.transform.removeChild(this._currentTool.transform);
                    }
                    this._currentTool = value;
                    if (this._currentTool) {
                        this.transform.addChild(this._currentTool.transform);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return Object3DControllerTool;
        }(feng3d.Component));
        editor.Object3DControllerTool = Object3DControllerTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Hierarchy = (function () {
            function Hierarchy(rootObject3D) {
                this.nodeMap = new feng3d.Map();
                this.rootNode = new HierarchyNode(rootObject3D);
                this.rootNode.depth = -1;
                this.nodeMap.push(rootObject3D, this.rootNode);
                //
                rootObject3D.addEventListener(feng3d.Mouse3DEvent.CLICK, this.onMouseClick, this);
                editor.$editorEventDispatcher.addEventListener("Create_Object3D", this.onCreateObject3D, this);
                editor.$editorEventDispatcher.addEventListener("saveScene", this.onSaveScene, this);
                editor.$editorEventDispatcher.addEventListener("import", this.onImport, this);
                //监听命令
                feng3d.shortcut.addEventListener("deleteSeletedObject3D", this.onDeleteSeletedObject3D, this);
            }
            Object.defineProperty(Hierarchy.prototype, "selectedNode", {
                get: function () {
                    return this.nodeMap.get(editor.editor3DData.selectedObject3D.transform);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取节点
             */
            Hierarchy.prototype.getNode = function (object3D) {
                var node = this.nodeMap.get(object3D);
                return node;
            };
            Hierarchy.prototype.addObject3D = function (object3D, parentNode, allChildren) {
                if (parentNode === void 0) { parentNode = null; }
                if (allChildren === void 0) { allChildren = false; }
                var node = new HierarchyNode(object3D);
                this.nodeMap.push(object3D, node);
                if (parentNode) {
                    parentNode.addNode(node);
                }
                else {
                    this.rootNode.addNode(node);
                }
                if (allChildren) {
                    for (var i = 0; i < object3D.childCount; i++) {
                        this.addObject3D(object3D.getChildAt(i), node, true);
                    }
                }
                return node;
            };
            Hierarchy.prototype.onMouseClick = function (event) {
                var object3D = event.target;
                var node = this.nodeMap.get(object3D);
                while (!node && (object3D = object3D.parent))
                    ;
                {
                    node = this.nodeMap.get(object3D);
                }
                if (node && object3D)
                    editor.editor3DData.selectedObject3D = object3D.gameObject;
            };
            Hierarchy.prototype.onCreateObject3D = function (event) {
                var className = event.data.className;
                var gameobject = feng3d.GameObjectFactory.create(event.data.label);
                if (gameobject) {
                    this.addObject3D(gameobject.transform);
                    editor.editor3DData.selectedObject3D = gameobject;
                }
                else {
                    console.error("\u65E0\u6CD5\u5B9E\u4F8B\u5316" + className + ",\u8BF7\u68C0\u67E5\u914D\u7F6E createObjectConfig");
                }
            };
            Hierarchy.prototype.onDeleteSeletedObject3D = function () {
                var selectedObject3D = editor.editor3DData.selectedObject3D;
                if (selectedObject3D) {
                    var node = this.nodeMap.get(selectedObject3D.transform);
                    node.delete();
                }
                editor.editor3DData.selectedObject3D = null;
            };
            Hierarchy.prototype.resetScene = function (scene) {
                for (var i = 0; i < scene.transform.childCount; i++) {
                    this.addObject3D(scene.transform.getChildAt(i), null, true);
                }
            };
            Hierarchy.prototype.onImport = function () {
                var fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                fileInput.addEventListener('change', function (event) {
                    if (fileInput.files.length == 0)
                        return;
                    var file = fileInput.files[0];
                    // try sending
                    var reader = new FileReader();
                    reader.onloadstart = function () {
                        console.log("onloadstart");
                    };
                    reader.onprogress = function (p) {
                        console.log("onprogress");
                    };
                    reader.onload = function () {
                        console.log("load complete");
                    };
                    reader.onloadend = function () {
                        if (reader.error) {
                            console.log(reader.error);
                        }
                        else {
                            var json = JSON.parse(reader.result);
                            var scene = feng3d.serialization.readObject(json);
                            editor.editor3DData.hierarchy.resetScene(scene);
                        }
                    };
                    reader.readAsBinaryString(file);
                });
                document.addEventListener("mouseup", onmouseup, true);
                function onmouseup(e) {
                    fileInput.click();
                    e.preventDefault();
                    document.removeEventListener("mouseup", onmouseup, true);
                }
            };
            Hierarchy.prototype.onSaveScene = function () {
                var obj = feng3d.serialization.writeObject(this.rootNode.object3D);
                obj;
                var output = "";
                try {
                    output = JSON.stringify(obj, null, '\t');
                    output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                }
                catch (e) {
                    output = JSON.stringify(output);
                }
                var link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link); // Firefox workaround, see #6594
                link.href = URL.createObjectURL(new Blob([output], { type: 'text/plain' }));
                link.download = 'scene.json';
                link.click();
                //to do 删除 link
            };
            return Hierarchy;
        }());
        editor.Hierarchy = Hierarchy;
        var HierarchyNode = (function (_super) {
            __extends(HierarchyNode, _super);
            function HierarchyNode(object3D) {
                var _this = _super.call(this) || this;
                _this.depth = 0;
                _this.isOpen = true;
                /**
                 * 子节点列表
                 */
                _this.children = [];
                _this.object3D = object3D;
                _this.label = object3D.name;
                _this._uuid = Math.generateUUID();
                feng3d.Watcher.watch(_this, ["isOpen"], _this.onIsOpenChange, _this);
                return _this;
            }
            Object.defineProperty(HierarchyNode.prototype, "uuid", {
                get: function () {
                    return this._uuid;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 判断是否包含节点
             */
            HierarchyNode.prototype.contain = function (node) {
                if (this == node)
                    return true;
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].contain(node))
                        return true;
                }
                return false;
            };
            HierarchyNode.prototype.addNode = function (node) {
                feng3d.debuger && console.assert(!node.contain(this), "无法添加到自身节点中!");
                node.parent = this;
                this.object3D.addChild(node.object3D);
                this.children.push(node);
                node.depth = this.depth + 1;
                node.updateChildrenDepth();
                this.hasChildren = true;
                this.dispatchEvent(new feng3d.Event(HierarchyNode.ADDED, node, true));
            };
            HierarchyNode.prototype.removeNode = function (node) {
                node.parent = null;
                this.object3D.removeChild(node.object3D);
                var index = this.children.indexOf(node);
                console.assert(index != -1);
                this.children.splice(index, 1);
                this.hasChildren = this.children.length > 0;
                this.dispatchEvent(new feng3d.Event(HierarchyNode.REMOVED, node, true));
            };
            HierarchyNode.prototype.delete = function () {
                this.parent.removeNode(this);
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].delete();
                }
                this.children.length = 0;
            };
            HierarchyNode.prototype.updateChildrenDepth = function () {
                var _this = this;
                this.children.forEach(function (element) {
                    element.depth = _this.depth + 1;
                    element.updateChildrenDepth();
                });
            };
            HierarchyNode.prototype.getShowNodes = function () {
                var nodes = [];
                if (this.isOpen) {
                    this.children.forEach(function (element) {
                        nodes.push(element);
                        nodes = nodes.concat(element.getShowNodes());
                    });
                }
                return nodes;
            };
            HierarchyNode.prototype.onIsOpenChange = function () {
                this.dispatchEvent(new feng3d.Event(HierarchyNode.OPEN_CHANGED, this, true));
            };
            return HierarchyNode;
        }(feng3d.EventDispatcher));
        HierarchyNode.ADDED = "added";
        HierarchyNode.REMOVED = "removed";
        HierarchyNode.OPEN_CHANGED = "openChanged";
        editor.HierarchyNode = HierarchyNode;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var SceneControl = (function () {
            function SceneControl() {
                this.controller = new feng3d.FPSController();
                feng3d.shortcut.addEventListener("lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
                feng3d.shortcut.addEventListener("dragSceneStart", this.onDragSceneStart, this);
                feng3d.shortcut.addEventListener("dragScene", this.onDragScene, this);
                feng3d.shortcut.addEventListener("fpsViewStart", this.onFpsViewStart, this);
                feng3d.shortcut.addEventListener("fpsViewStop", this.onFpsViewStop, this);
                feng3d.shortcut.addEventListener("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
                feng3d.shortcut.addEventListener("mouseRotateScene", this.onMouseRotateScene, this);
                feng3d.shortcut.addEventListener("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
                //
            }
            SceneControl.prototype.onDragSceneStart = function () {
                this.dragSceneMousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.dragSceneCameraGlobalMatrix3D = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix.clone();
            };
            SceneControl.prototype.onDragScene = function () {
                var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
                var scale = editor.editor3DData.view3D.getScaleByDepth(300);
                var up = this.dragSceneCameraGlobalMatrix3D.up;
                var right = this.dragSceneCameraGlobalMatrix3D.right;
                up.scaleBy(addPoint.y * scale);
                right.scaleBy(-addPoint.x * scale);
                var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
                globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
                editor.editor3DData.cameraObject3D.transform.localToWorldMatrix = globalMatrix3D;
            };
            SceneControl.prototype.onFpsViewStart = function () {
                this.controller.targetObject = editor.editor3DData.cameraObject3D.gameObject;
                this.controller["onMousedown"]();
            };
            SceneControl.prototype.onFpsViewStop = function () {
                this.controller.targetObject = null;
                this.controller["onMouseup"]();
            };
            SceneControl.prototype.onMouseRotateSceneStart = function () {
                this.rotateSceneMousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.rotateSceneCameraGlobalMatrix3D = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix.clone();
                this.rotateSceneCenter = null;
                if (editor.editor3DData.selectedObject3D) {
                    this.rotateSceneCenter = editor.editor3DData.selectedObject3D.transform.scenePosition;
                }
                else {
                    this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                    this.rotateSceneCenter.scaleBy(config.lookDistance);
                    this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
                }
            };
            SceneControl.prototype.onMouseRotateScene = function () {
                var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
                var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                var view3DRect = editor.editor3DData.view3DRect;
                var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
                var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
                globalMatrix3D.appendRotation(rotateY, feng3d.Vector3D.Y_AXIS, this.rotateSceneCenter);
                var rotateAxisX = globalMatrix3D.right;
                globalMatrix3D.appendRotation(rotateX, rotateAxisX, this.rotateSceneCenter);
                editor.editor3DData.cameraObject3D.transform.localToWorldMatrix = globalMatrix3D;
            };
            SceneControl.prototype.onLookToSelectedObject3D = function () {
                var selectedObject3D = editor.editor3DData.selectedObject3D;
                if (selectedObject3D) {
                    var cameraObject3D = editor.editor3DData.cameraObject3D;
                    config.lookDistance = config.defaultLookDistance;
                    var lookPos = cameraObject3D.transform.localToWorldMatrix.forward;
                    lookPos.scaleBy(-config.lookDistance);
                    lookPos.incrementBy(selectedObject3D.transform.scenePosition);
                    var localLookPos = cameraObject3D.transform.worldToLocalMatrix.transformVector(lookPos);
                    egret.Tween.get(editor.editor3DData.cameraObject3D).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
                }
            };
            SceneControl.prototype.onMouseWheelMoveSceneCamera = function (event) {
                var distance = event.data.wheelDelta * config.mouseWheelMoveStep;
                editor.editor3DData.cameraObject3D.transform.localToWorldMatrix = editor.editor3DData.cameraObject3D.transform.localToWorldMatrix.moveForward(distance);
                config.lookDistance -= distance;
            };
            return SceneControl;
        }());
        editor.SceneControl = SceneControl;
        var SceneControlConfig = (function () {
            function SceneControlConfig() {
                this.mouseWheelMoveStep = 0.4;
                this.defaultLookDistance = 300;
                //dynamic
                this.lookDistance = 300;
            }
            return SceneControlConfig;
        }());
        editor.SceneControlConfig = SceneControlConfig;
        var config = new SceneControlConfig();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 地面网格
         * @author feng 2016-10-29
         */
        var GroundGrid = (function (_super) {
            __extends(GroundGrid, _super);
            function GroundGrid(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.num = 100;
                _this.transform.mouseEnabled = false;
                _this.init();
                return _this;
                // editor3DData.cameraObject3D.addEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
            /**
             * 创建地面网格对象
             */
            GroundGrid.prototype.init = function () {
                var meshFilter = this.gameObject.addComponent(feng3d.MeshFilter);
                this.segmentGeometry = meshFilter.mesh = new feng3d.SegmentGeometry();
                var meshRenderer = this.gameObject.addComponent(feng3d.MeshRenderer);
                meshRenderer.material = new feng3d.SegmentMaterial();
                this.update();
            };
            GroundGrid.prototype.update = function () {
                var cameraGlobalPosition = editor.editor3DData.cameraObject3D.transform.scenePosition;
                this.level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
                this.step = Math.pow(10, this.level - 1);
                var startX = Math.round(cameraGlobalPosition.x / (10 * this.step)) * 10 * this.step;
                var startZ = Math.round(cameraGlobalPosition.z / (10 * this.step)) * 10 * this.step;
                //设置在原点
                startX = startZ = 0;
                this.step = 100;
                var halfNum = this.num / 2;
                this.segmentGeometry.removeAllSegments();
                for (var i = -halfNum; i <= halfNum; i++) {
                    var color = (i % 10) == 0 ? 0x888888 : 0x777777;
                    var thickness = (i % 10) == 0 ? 2 : 1;
                    this.segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(-halfNum * this.step + startX, 0, i * this.step + startZ), new feng3d.Vector3D(halfNum * this.step + startX, 0, i * this.step + startZ), color, color, thickness));
                    this.segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(i * this.step + startX, 0, -halfNum * this.step + startZ), new feng3d.Vector3D(i * this.step + startX, 0, halfNum * this.step + startZ), color, color, thickness));
                }
            };
            return GroundGrid;
        }(feng3d.Component));
        editor.GroundGrid = GroundGrid;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
        * 编辑器3D入口
        * @author feng 2016-10-29
        */
        var Main3D = (function () {
            function Main3D() {
                this.init();
                //
                feng3d.ticker.addEventListener(feng3d.Event.ENTER_FRAME, this.process, this);
            }
            Main3D.prototype.process = function (event) {
                editor.editor3DData.mouseInView3D.copyFrom(editor.editor3DData.view3D.mousePos);
                editor.editor3DData.view3DRect.copyFrom(editor.editor3DData.view3D.viewRect);
            };
            Main3D.prototype.init = function () {
                var canvas = document.getElementById("glcanvas");
                var view3D = new feng3d.View3D(canvas);
                view3D.scene.background.fromUnit(0x666666);
                editor.editor3DData.view3D = view3D;
                editor.editor3DData.scene3D = view3D.scene;
                editor.editor3DData.cameraObject3D = view3D.camera;
                editor.editor3DData.hierarchy = new editor.Hierarchy(view3D.scene.transform);
                //
                var camera = view3D.camera;
                camera.transform.z = -500;
                camera.transform.y = 300;
                camera.transform.lookAt(new feng3d.Vector3D());
                var trident = feng3d.GameObject.create("Trident");
                trident.addComponent(feng3d.Trident);
                view3D.scene.transform.addChild(trident.transform);
                feng3d.serializationConfig.excludeObject.push(trident);
                //初始化模块
                var groundGrid = feng3d.GameObject.create("GroundGrid").addComponent(editor.GroundGrid);
                view3D.scene.transform.addChild(groundGrid.transform);
                feng3d.serializationConfig.excludeObject.push(groundGrid);
                var object3DControllerTool = feng3d.GameObject.create("object3DControllerTool").addComponent(editor.Object3DControllerTool);
                feng3d.serializationConfig.excludeObject.push(object3DControllerTool);
                //
                var sceneControl = new editor.SceneControl();
                this.test();
            };
            Main3D.prototype.test = function () {
                editor.editor3DData.scene3D.transform.addEventListener(feng3d.Mouse3DEvent.CLICK, function (event) {
                    var transform = event.target;
                    var names = [transform.gameObject.name];
                    while (transform.parent) {
                        transform = transform.parent;
                        names.push(transform.gameObject.name);
                    }
                    console.log(event.type, names.reverse().join("->"));
                }, this);
                // this.testMouseRay();
            };
            Main3D.prototype.testMouseRay = function () {
                feng3d.input.addEventListener(feng3d.inputType.CLICK, function () {
                    var gameobject = feng3d.GameObject.create("test");
                    gameobject.addComponent(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
                    gameobject.addComponent(feng3d.MeshFilter).mesh = new feng3d.SphereGeometry(10);
                    gameobject.transform.mouseEnabled = false;
                    editor.editor3DData.scene3D.transform.addChild(gameobject.transform);
                    var mouseRay3D = editor.editor3DData.view3D.getMouseRay3D();
                    gameobject.transform.position = mouseRay3D.position;
                    var direction = mouseRay3D.direction.clone();
                    var num = 1000;
                    var translate = function () {
                        gameobject.transform.translate(direction, 15);
                        if (num > 0) {
                            setTimeout(function () {
                                translate();
                            }, 1000 / 60);
                        }
                        else {
                            editor.editor3DData.scene3D.transform.removeChild(gameobject.transform);
                        }
                        num--;
                    };
                    translate();
                }, this);
            };
            return Main3D;
        }());
        editor.Main3D = Main3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var EditorEnvironment = (function () {
            function EditorEnvironment() {
                this.init();
            }
            EditorEnvironment.prototype.init = function () {
                document.body.oncontextmenu = function () { return false; };
                //给反射添加查找的空间
                feng3d.ClassUtils.addClassNameSpace("feng3d.editor");
                feng3d.ClassUtils.addClassNameSpace("egret");
                //调整默认字体大小
                egret.TextField.default_size = 12;
                //解决TextInput.text绑定Number是不显示0的bug
                var p = eui.TextInput.prototype;
                var old = p["textDisplayAdded"];
                p["textDisplayAdded"] = function () {
                    old.call(this);
                    var values = this.$TextInput;
                    this.textDisplay.text = String(values[6 /* text */]);
                };
            };
            return EditorEnvironment;
        }());
        editor.EditorEnvironment = EditorEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.MouseEvent = egret.TouchEvent;
        //映射事件名称
        editor.MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
        editor.MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
        editor.MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
        editor.MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
        editor.MouseEvent.MOUSE_OUT = "mouseout";
        editor.MouseEvent.MOUSE_OVER = "mouseover";
        //
        //解决TextInput.text绑定Number是不显示0的bug
        var p = egret.DisplayObject.prototype;
        var old = p.dispatchEvent;
        p.dispatchEvent = function (event) {
            if (event.type == editor.MouseEvent.MOUSE_OVER) {
                //鼠标已经在对象上时停止over冒泡
                if (this.isMouseOver) {
                    event.stopPropagation();
                    return true;
                }
                this.isMouseOver = true;
            }
            if (event.type == editor.MouseEvent.MOUSE_OUT) {
                //如果再次mouseover的对象是该对象的子对象时停止out事件冒泡
                var overDisplayObject = editor.mouseEventEnvironment.overDisplayObject;
                while (overDisplayObject) {
                    if (this == overDisplayObject) {
                        event.stopPropagation();
                        return true;
                    }
                    overDisplayObject = overDisplayObject.parent;
                }
                this.isMouseOver = false;
            }
            return old.call(this, event);
        };
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MouseEventEnvironment = (function () {
            function MouseEventEnvironment() {
                this.webTouchHandler = this.getWebTouchHandler();
                this.canvas = this.webTouchHandler.canvas;
                this.touch = this.webTouchHandler.touch;
                this.webTouchHandler.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
            }
            MouseEventEnvironment.prototype.onMouseMove = function (event) {
                var location = this.webTouchHandler.getLocation(event);
                var x = location.x;
                var y = location.y;
                var target = this.touch["findTarget"](x, y);
                if (target == this.overDisplayObject)
                    return;
                var preOverDisplayObject = this.overDisplayObject;
                this.overDisplayObject = target;
                if (preOverDisplayObject) {
                    egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, editor.MouseEvent.MOUSE_OUT, true, true, x, y);
                }
                if (this.overDisplayObject) {
                    egret.TouchEvent.dispatchTouchEvent(this.overDisplayObject, editor.MouseEvent.MOUSE_OVER, true, true, x, y);
                }
            };
            MouseEventEnvironment.prototype.getWebTouchHandler = function () {
                var list = document.querySelectorAll(".egret-player");
                var length = list.length;
                var player = null;
                for (var i = 0; i < length; i++) {
                    var container = list[i];
                    player = container["egret-player"];
                    if (player)
                        break;
                }
                return player.webTouchHandler;
            };
            return MouseEventEnvironment;
        }());
        editor.MouseEventEnvironment = MouseEventEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
/**
 * 层级界面创建3D对象列表数据
 */
var createObjectConfig = [
    //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
    { label: "GameObject", className: "feng3d.GameObject" },
    { label: "Plane", className: "feng3d.PlaneObject3D" },
    { label: "Cube", className: "feng3d.CubeObject3D" },
    { label: "Sphere", className: "feng3d.SphereObject3D" },
    { label: "Capsule", className: "feng3d.CapsuleObject3D" },
    { label: "Cylinder", className: "feng3d.CylinderObject3D" },
    { label: "Cone", className: "feng3d.ConeObject3D" },
    { label: "Torus", className: "feng3d.TorusObect3D" },
    { label: "Particle", className: "feng3d.ParticleObject3D" },
    { label: "Camera", className: "feng3d.CameraObject3D" },
    { label: "PointLight", className: "feng3d.PointLightObject3D" },
];
/**
 * 层级界面创建3D对象列表数据
 */
var createObject3DComponentConfig = [
    //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
    { label: "ParticleAnimator", className: "feng3d.ParticleAnimator" },
    { label: "Camera3D", className: "feng3d.Camera3D" },
    { label: "Model", className: "feng3d.Model" },
    { label: "PointLight", className: "feng3d.PointLight" },
    { label: "Script", className: "feng3d.Object3dScript" },
];
/**
 * 主菜单
 */
var mainMenuConfig = [
    { label: "save scene", command: "saveScene" },
    { label: "import", command: "import" },
];
/**
 * ObjectView总配置数据
 */
var objectViewConfig = {
    defaultBaseObjectViewClass: "feng3d.editor.DefaultBaseObjectView",
    defaultObjectViewClass: "feng3d.editor.DefaultObjectView",
    defaultObjectAttributeViewClass: "feng3d.editor.DefaultObjectAttributeView",
    defaultObjectAttributeBlockView: "feng3d.editor.DefaultObjectBlockView",
    attributeDefaultViewClassByTypeVec: [
        {
            type: "Boolean",
            component: "feng3d.editor.BooleanAttrView"
        },
        {
            type: "feng3d.Vector3D",
            component: "feng3d.editor.OAVVector3D"
        }
    ],
    classConfigVec: [
        {
            name: "feng3d.Transform1",
            component: "",
            componentParam: null,
            attributeDefinitionVec: [
                {
                    name: "position",
                    block: ""
                },
                {
                    name: "rotation",
                    block: ""
                },
                {
                    name: "scale",
                    block: ""
                }
            ],
            blockDefinitionVec: []
        },
        {
            name: "feng3d.Object3D1",
            component: "",
            componentParam: null,
            attributeDefinitionVec: [
                {
                    name: "name",
                    block: ""
                },
                {
                    name: "visible",
                    block: ""
                },
                {
                    name: "mouseEnabled",
                    block: ""
                },
                {
                    name: "components",
                    component: "feng3d.editor.OAVObject3DComponentList",
                    block: ""
                }
            ],
            blockDefinitionVec: []
        }
    ]
};
/**
 * 快捷键配置
 */
var shortcutConfig = [
    //	key					[必须]	快捷键；用“+”连接多个按键，“!”表示没按下某键；例如 “a+!b”表示按下“a”与没按下“b”时触发。
    //	command				[可选]	要执行的command的id；使用“,”连接触发多个命令；例如 “commandA,commandB”表示满足触发条件后依次执行commandA与commandB命令。
    //	stateCommand		[可选]	要执行的状态命令id；使用“,”连接触发多个状态命令，没带“!”表示激活该状态，否则表示使其处于非激活状态；例如 “stateA,!stateB”表示满足触发条件后激活状态“stateA，使“stateB处于非激活状态。
    //	when				[可选]	快捷键激活的条件；使用“+”连接多个状态，没带“!”表示需要处于激活状态，否则需要处于非激活状态； 例如 “stateA+!stateB”表示stateA处于激活状态且stateB处于非激活状态时会判断按键是否满足条件。
    { key: "rightmousedown", command: "fpsViewStart", stateCommand: "fpsViewing", when: "mouseInView3D" },
    { key: "rightmouseup", command: "fpsViewStop", stateCommand: "!fpsViewing", when: "fpsViewing" },
    { key: "f", command: "lookToSelectedObject3D", when: "" },
    { key: "w", command: "object3DMoveTool", when: "!fpsViewing" },
    { key: "e", command: "object3DRotationTool", when: "!fpsViewing" },
    { key: "r", command: "object3DScaleTool", when: "!fpsViewing" },
    { key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "" },
    { key: "mousemove", command: "mouseRotateScene", when: "mouseRotateSceneing" },
    { key: "mouseup", stateCommand: "!mouseRotateSceneing", when: "mouseRotateSceneing" },
    { key: "middlemousedown", command: "dragSceneStart", stateCommand: "dragSceneing", when: "mouseInView3D" },
    { key: "mousemove", command: "dragScene", when: "dragSceneing" },
    { key: "middlemouseup", stateCommand: "!dragSceneing", when: "dragSceneing" },
    { key: "del", command: "deleteSeletedObject3D", when: "" },
    { key: "mousewheel", command: "mouseWheelMoveSceneCamera", when: "mouseInView3D" },
];
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 编辑器
         * @author feng 2016-10-29
         */
        var Editor = (function (_super) {
            __extends(Editor, _super);
            function Editor() {
                var _this = _super.call(this) || this;
                //
                new editor.EditorEnvironment();
                //初始化feng3d
                new editor.Main3D();
                feng3d.shortcut.addShortCuts(shortcutConfig);
                _this.addChild(new editor.MainUI());
                _this.once(egret.Event.ENTER_FRAME, function () {
                    //
                    editor.mouseEventEnvironment = new editor.MouseEventEnvironment();
                }, _this);
                _this.once(egret.Event.ADDED_TO_STAGE, _this._onAddToStage, _this);
                return _this;
            }
            Editor.prototype._onAddToStage = function () {
                editor.editor3DData.stage = this.stage;
            };
            return Editor;
        }(eui.UILayer));
        editor.Editor = Editor;
        /*************************** 初始化模块 ***************************/
        //初始化配置
        feng3d.$objectViewConfig = objectViewConfig;
        editor.$editorEventDispatcher = new feng3d.EventDispatcher();
        //
        editor.editor3DData = new editor.Editor3DData();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=editor.js.map