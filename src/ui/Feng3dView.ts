namespace editor
{
	export class Feng3dView extends eui.Component implements eui.UIComponent
	{
		public backRect: eui.Rect;
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

			this.backRect.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
			feng3d.windowEventProxy.on("mousemove", this.onGlobalMouseMove, this);

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

			this.backRect.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
			feng3d.windowEventProxy.off("mousemove", this.onGlobalMouseMove, this);

			drag.unregister(this);
		}

		private inMouseMove: boolean;
		private onMouseMove()
		{
			feng3d.shortcut.activityState("mouseInView3D");
			this.inMouseMove = true;
		}

		private onGlobalMouseMove()
		{
			if (this.inMouseMove)
			{
				this.inMouseMove = false;
				return;
			}
			feng3d.shortcut.deactivityState("mouseInView3D");
		}

		private onResize()
		{
			if (!this.stage)
				return;

			var lt = this.localToGlobal(0, 0);
			var rb = this.localToGlobal(this.width, this.height);
			var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);

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