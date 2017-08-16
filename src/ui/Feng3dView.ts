namespace feng3d.editor
{
	export class Feng3dView extends eui.Component implements eui.UIComponent
	{
		private canvas: HTMLElement;

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "Feng3dViewSkin";
		}

		private onComplete(): void
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		private onAddedToStage()
		{
			this.canvas = document.getElementById("glcanvas");
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
			this.onResize();
		}

		private onRemovedFromStage()
		{
			this.canvas = null;
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
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

			if (bound.contains(input.clientX, input.clientY))
			{
				shortcut.activityState("mouseInView3D");
			} else
			{
				shortcut.deactivityState("mouseInView3D");
			}
		}
	}
}