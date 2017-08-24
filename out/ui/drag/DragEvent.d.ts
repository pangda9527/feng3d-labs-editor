declare namespace feng3d.editor {
    /**
     * 拖拽事件
     * @author feng		2017-01-22
     */
    class DragEvent extends egret.Event {
        /**
         * 拖拽放下事件
         */
        static DRAG_DROP: string;
        /**
         * 拖入事件
         */
        static DRAG_ENTER: string;
        /**
         * 拖出事件
         */
        static DRAG_EXIT: string;
        /**
         * 拖拽发起对象
         */
        dragInitiator: egret.DisplayObject;
        /**
         * 拖拽源
         */
        dragSource: DragSource;
        /**
         * 构建拖拽事件
         * @param type						事件类型
         * @param dragInitiator				拖拽发起对象
         * @param dragSource				拖拽源
         * @param bubbles					是否冒泡
         * @param cancelable				能否取消事件传播
         */
        constructor(type: string, dragInitiator?: egret.DisplayObject, dragSource?: DragSource, bubbles?: boolean, cancelable?: boolean);
    }
}
