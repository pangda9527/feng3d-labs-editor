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
                        this._accepter.alpha = 1;
                    }
                    this._accepter = value;
                    if (this._accepter) {
                        this._accepter.alpha = 0.5;
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
//# sourceMappingURL=DragManager.js.map