module feng3d.editor
{

	/**
	 * 拖拽管理者
	 * @author feng 2017-01-22
	 *
	 */
	export class DragManager
	{

		/**
		 * 拖拽示例
		 */
		private static _instance: DragManager;

		/**
		 * 拖拽管理者
		 */
		private static get instance(): DragManager
		{
			return this._instance = this._instance || new DragManager();
		}

		/**
		 * 是否正在拖拽
		 */
		public static get isDragging(): boolean
		{
			return this.instance.isDragging;
		}

		/**
		 * 是否被接受
		 */
		public static get isSuccess(): boolean
		{
			return this.instance.isSuccess;
		}

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
		public static doDrag(dragInitiator: egret.DisplayObject, dragSource: DragSource, mouseEvent: MouseEvent, dragImagge: egret.DisplayObject = null, xOffset: number = 0, yOffset: number = 0, imageAlpha: number = 0.5, allowMove: boolean = true): void
		{
			this.instance.doDrag(dragInitiator, dragSource, mouseEvent, dragImagge, xOffset, yOffset, imageAlpha, allowMove);
		}

		/**
		 * 接受拖入
		 * @param target		接受拖入的对象
		 */
		public static acceptDragDrop(target: egret.DisplayObject): void
		{
			this.instance.acceptDragDrop(target);
		}

		/**
		 * 是否接受拖入
		 */
		public static isAcceptDragDrop(target: egret.DisplayObject): boolean
		{
			return this.instance.accepter == target;
		}

		/**
		 * 是否正在拖拽
		 */
		private isDragging: boolean;
		private _accepter: egret.DisplayObject;
		/**
		 * 拖拽发起对象
		 */
		private dragInitiator: egret.DisplayObject;
		/**
		 * 拖拽源
		 */
		private dragSource: DragSource;
		/**
		 * 鼠标事件
		 */
		private mouseEvent: MouseEvent;
		/**
		 * 拖拽图片
		 */
		private dragImage: egret.DisplayObject;
		/**
		 * X偏移
		 */
		private xOffset: number;
		/**
		 * y偏移
		 */
		private yOffset: number;
		/**
		 * 图片透明度
		 */
		private imageAlpha: number;
		/**
		 * 是否允许移动
		 */
		private allowMove: boolean;
		/**
		 * 舞台
		 */
		private stage: egret.Stage;
		/**
		 * 是否放入接受者中
		 */
		private isSuccess: boolean;

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
		public doDrag(dragInitiator: egret.DisplayObject, dragSource: DragSource, mouseEvent: MouseEvent, dragImage: egret.DisplayObject = null, xOffset: number = 0, yOffset: number = 0, imageAlpha: number = 0.5, allowMove: boolean = true): void
		{
			this.isSuccess = false;
			this.dragInitiator = dragInitiator;
			this.dragSource = dragSource;
			this.mouseEvent = mouseEvent;
			this.dragImage = dragImage;
			this.xOffset = xOffset;
			this.yOffset = yOffset;
			this.imageAlpha = imageAlpha;
			this.allowMove = allowMove;
			this.stage = dragInitiator.stage;
			this.startDrag();
		}

		/**
		 * 接受拖入
		 * @param target		接受拖入的对象
		 */
		public acceptDragDrop(target: egret.DisplayObject)
		{
			this.accepter = target;
		}

		/**
		 * 接受对象
		 */
		private get accepter(): egret.DisplayObject
		{
			return this._accepter;
		}

		private set accepter(value: egret.DisplayObject)
		{
			if (this._accepter)
			{
				this._accepter.removeEventListener(MouseEvent.MOUSE_OUT, this.onAccepterMouseOut, this);
			}
			this._accepter = value;
			if (this._accepter)
			{
				this._accepter.addEventListener(MouseEvent.MOUSE_OUT, this.onAccepterMouseOut, this);
			}
		}

		/**
		 * 开始拖拽
		 */
		private startDrag(): void
		{
			this.isDragging = true;
			this.accepter = null;
			this.addListeners();
			// this.dragImage = this.dragImage || this.createDragImage();
			// this.stage.addChild(this.dragImage);
			// this.updateDragImage();
		}

		private updateDragImage(): void
		{
			this.dragImage.x = input.clientX + this.xOffset;
			this.dragImage.y = input.clientY + this.yOffset;
			this.dragImage.alpha = this.imageAlpha;
		}

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

		private endDrag(): void
		{
			this.isDragging = false;
			this.removeListeners();
			this.accepter = null;
			this.stage.removeChild(this.dragImage);
			this.dragImage = null;
		}

		/**
		 * 处理接受对象鼠标移出事件
		 */
		protected onAccepterMouseOut(event: MouseEvent): void
		{
			this.accepter.dispatchEvent(new DragEvent(DragEvent.DRAG_EXIT, this.dragInitiator, this.dragSource, true));
			this.accepter = null;
		}

		/**
		 * 处理舞台鼠标移入事件
		 */
		protected onStageMouseOver(event: MouseEvent): void
		{
			var target: egret.DisplayObject = <any>event.target;
			target.dispatchEvent(new DragEvent(DragEvent.DRAG_ENTER, this.dragInitiator, this.dragSource, true));
		}

		protected onStageMouseUp(event: MouseEvent): void
		{
			if (this.accepter != null)
			{
				this.isSuccess = true;
				this.accepter.dispatchEvent(new DragEvent(DragEvent.DRAG_DROP, this.dragInitiator, this.dragSource, true));
			}
			this.endDrag();
		}

		protected onStageMouseMove(event: MouseEvent): void
		{
			// this.updateDragImage();
		}

		private addListeners(): void
		{
			this.stage.addEventListener(MouseEvent.MOUSE_OVER, this.onStageMouseOver, this);
			this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageMouseUp, this);
			this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageMouseMove, this);
		}

		private removeListeners(): void
		{
			this.stage.removeEventListener(MouseEvent.MOUSE_OVER, this.onStageMouseOver, this);
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageMouseUp, this);
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageMouseMove, this);
		}
	}
}
