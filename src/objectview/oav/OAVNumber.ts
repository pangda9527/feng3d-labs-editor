namespace editor
{
	/**
	 * 默认对象属性界面
	 * @author feng 2016-3-10
	 */
	@feng3d.OAVComponent()
	export class OAVNumber extends OAVDefault
	{
		/**
		 * 步长，精度
		 */
		step = 0.001;

		/**
		 * 键盘上下方向键步长
		 */
		stepDownup = 0.001;

		/**
		 * 移动一个像素时增加的步长数量
		 */
		stepScale = 1;

		attributeValue: number;

		initView()
		{
			super.initView();
			this.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
		}

		dispose()
		{
			this.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
			super.dispose();
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			var fractionDigits = 0;
			while (Math.pow(10, fractionDigits) * this.step < 1)
			{
				fractionDigits++;
			}
			this.text.text = (Math.round(this.attributeValue / this.step) * this.step).toFixed(fractionDigits);
		}

		private mouseDownPosition = new feng3d.Vector2();
		private mouseDownValue = 0;

		private onMouseDown(e: egret.MouseEvent)
		{
			this.mouseDownPosition.init(e.stageX, e.stageY);
			this.mouseDownValue = this.attributeValue;
			editorui.stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onStageMouseMove, this);
			editorui.stage.addEventListener(egret.MouseEvent.MOUSE_UP, this.onStageMouseUp, this);
		}

		private onStageMouseMove(e: egret.MouseEvent)
		{
			this.attributeValue = this.mouseDownValue + ((e.stageX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - e.stageY)) * this.step * this.stepScale;
		}

		private onStageMouseUp()
		{
			editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onStageMouseMove, this);
			editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_UP, this.onStageMouseUp, this);
		}

		protected ontxtfocusin()
		{
			super.ontxtfocusin();
			feng3d.windowEventProxy.on("keydown", this.onWindowKeyDown, this);
		}

		protected ontxtfocusout()
		{
			super.ontxtfocusout();
			feng3d.windowEventProxy.off("keydown", this.onWindowKeyDown, this);
		}

		private onWindowKeyDown(event: KeyboardEvent)
		{
			if (event.key == "ArrowUp")
			{
				this.attributeValue += this.step;
			} else if (event.key == "ArrowDown")
			{
				this.attributeValue -= this.step;
			}
		}
	}
}