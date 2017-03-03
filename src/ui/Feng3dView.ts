module feng3d.editor
{
	export class Feng3dView extends eui.Component implements eui.UIComponent
	{
		private canvas: HTMLElement;

		public constructor()
		{
			super();
			this.canvas = document.getElementById("glcanvas");
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);

			this.skinName = "Feng3dViewSkin";
		}

		private onComplete(): void
		{
			this.onResize();
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
		}

		private onAddedToStage()
		{
			this.onResize();
		}

		private onResize()
		{
			if (!this.stage)
				return;
			var lt = this.localToGlobal(0, 0);
			var rb = this.localToGlobal(this.width, this.height);
			var bound1 = new Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);

			// var bound2 = this.getTransformedBounds(this.stage);
			var bound = bound1;

			var style = this.canvas.style;
			style.position = "absolute";
			style.left = bound.x + "px";
			style.top = bound.y + "px";
			style.width = bound.width + "px";
			style.height = bound.height + "px";

			if (bound.contains(Input.instance.clientX, Input.instance.clientY))
			{
				shortcut.ShortCut.activityState("mouseInView3D");
			} else
			{
				shortcut.ShortCut.deactivityState("mouseInView3D");
			}
		}
	}
}