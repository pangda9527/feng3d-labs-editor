namespace feng3d.editor
{
	/**
	 * 拖拽事件
	 * @author feng		2017-01-22
	 */
	export class DragEvent extends egret.Event
	{
		/**
		 * 拖拽放下事件
		 */
		static DRAG_DROP = "dragDrop";

		/**
		 * 拖入事件
		 */
		static DRAG_ENTER = "dragEnter";

		/**
		 * 拖出事件
		 */
		static DRAG_EXIT = "dragExit";

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
		constructor(type: string, dragInitiator: egret.DisplayObject = null, dragSource: DragSource = null, bubbles = false, cancelable = false)
		{
			super(type, bubbles);
			this.dragInitiator = dragInitiator;
			this.dragSource = dragSource;
		}
	}
}
