namespace editor
{
	export class Feng3dView extends eui.Component implements eui.UIComponent
	{
		public backRect:eui.Rect;
		private canvas: HTMLElement;

		constructor()
		{
			super();
			this.skinName = "Feng3dViewSkin";
			feng3d.Stats.init(document.getElementById("stats"));
			editorui.feng3dView = this;
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number)
		{
			super.$onAddToStage(stage, nestLevel);

			this.canvas = document.getElementById("glcanvas");
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.backRect.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);

			this.onResize();

			drag.register(this, null, ["file_gameobject", "file_script"], (dragdata) =>
			{
				if (dragdata.file_gameobject)
				{
					hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, hierarchy.rootnode.gameobject);
				}
				if (dragdata.file_script)
				{
					var gameobject = engine.mouse3DManager.selectedGameObject;
					if (!gameobject || !gameobject.scene)
						gameobject = hierarchy.rootnode.gameobject;

					dragdata.file_script.getScriptClassName(scriptClassName =>
					{
						gameobject.addScript(scriptClassName);
					});
				}
			});
		}

		$onRemoveFromStage()
		{
			super.$onRemoveFromStage()

			this.canvas = null;
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
			this.backRect.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);

			drag.unregister(this);
		}

		private onMouseDown()
		{
			this.checkMouseInView3D();

			feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
			feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
		}

		private onMouseMove()
		{
			this.checkMouseInView3D();
		}

		private onMouseUp()
		{
			feng3d.shortcut.deactivityState("mouseInView3D");

			feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
			feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
		}

		private checkMouseInView3D()
		{
			var canvasRect = this.canvas.getBoundingClientRect();
			var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
			if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
			{
				feng3d.shortcut.activityState("mouseInView3D");
			} else
			{
				feng3d.shortcut.deactivityState("mouseInView3D");
			}
		}

		private onResize()
		{
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
			style.cursor = "hand";

			feng3d.Stats.instance.dom.style.left = bound.x + "px";
			feng3d.Stats.instance.dom.style.top = bound.y + "px";
		}
	}
}