declare namespace feng3d.editor {
    /**
     * 拖拽管理者
     * @author feng 2017-01-22
     *
     */
    class DragManager {
        /**
         * 拖拽示例
         */
        private static _instance;
        /**
         * 拖拽管理者
         */
        private static readonly instance;
        /**
         * 是否正在拖拽
         */
        static readonly isDragging: boolean;
        /**
         * 是否被接受
         */
        static readonly isSuccess: boolean;
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
        static doDrag(dragInitiator: egret.DisplayObject, dragSource: DragSource, dragImagge?: egret.DisplayObject, xOffset?: number, yOffset?: number, imageAlpha?: number, allowMove?: boolean): void;
        /**
         * 接受拖入
         * @param target		接受拖入的对象
         */
        static acceptDragDrop(target: egret.DisplayObject): void;
        /**
         * 是否接受拖入
         */
        static isAcceptDragDrop(target: egret.DisplayObject): boolean;
        /**
         * 是否正在拖拽
         */
        private isDragging;
        private _accepter;
        /**
         * 拖拽发起对象
         */
        private dragInitiator;
        /**
         * 拖拽源
         */
        private dragSource;
        /**
         * 拖拽图片
         */
        private dragImage;
        /**
         * X偏移
         */
        private xOffset;
        /**
         * y偏移
         */
        private yOffset;
        /**
         * 图片透明度
         */
        private imageAlpha;
        /**
         * 是否允许移动
         */
        private allowMove;
        /**
         * 舞台
         */
        private stage;
        /**
         * 是否放入接受者中
         */
        private isSuccess;
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
        doDrag(dragInitiator: egret.DisplayObject, dragSource: DragSource, dragImage?: egret.DisplayObject, xOffset?: number, yOffset?: number, imageAlpha?: number, allowMove?: boolean): void;
        /**
         * 接受拖入
         * @param target		接受拖入的对象
         */
        acceptDragDrop(target: egret.DisplayObject): void;
        /**
         * 接受对象
         */
        private accepter;
        /**
         * 开始拖拽
         */
        private startDrag();
        private updateDragImage();
        private endDrag();
        /**
         * 处理接受对象鼠标移出事件
         */
        protected onAccepterMouseOut(event: MouseEvent): void;
        /**
         * 处理舞台鼠标移入事件
         */
        protected onStageMouseOver(event: MouseEvent): void;
        protected onStageMouseUp(event: MouseEvent): void;
        protected onStageMouseMove(event: MouseEvent): void;
        private addListeners();
        private removeListeners();
    }
}
