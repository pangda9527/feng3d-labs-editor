module feng3d.editor
{
	export class Feng3dView extends eui.Component implements eui.UIComponent
	{
		public fullbutton: eui.Button;
		private canvas: HTMLElement;

		constructor()
		{
			super();
			this.skinName = "Feng3dViewSkin";
			Stats.init();
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number)
		{
			super.$onAddToStage(stage, nestLevel);

			this.canvas = document.getElementById("glcanvas");
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
			this.fullbutton.addEventListener(MouseEvent.CLICK, this.onclick, this);

			this.onResize();

			drag.register(this, null, ["file_gameobject", "file_script"], (dragdata) =>
			{
				if (dragdata.file_gameobject)
				{
					hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, hierarchyTree.rootnode.gameobject);
				}
				if (dragdata.file_script)
				{
					var gameobject = mouse3DManager.getSelectedObject3D();
					if (!gameobject || !gameobject.scene)
						gameobject = hierarchyTree.rootnode.gameobject;
					GameObjectUtil.addScript(gameobject, dragdata.file_script.replace(/\.ts\b/, ".js"))
				}
			});
		}

		$onRemoveFromStage()
		{
			super.$onRemoveFromStage()

			this.canvas = null;
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
			this.fullbutton.removeEventListener(MouseEvent.CLICK, this.onclick, this);

			drag.unregister(this);
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

			Stats.instance.dom.style.left = bound.x + "px";
			Stats.instance.dom.style.top = bound.y + "px";
			
			if (bound.contains(input.clientX, input.clientY))
			{
				shortcut.activityState("mouseInView3D");
			} else
			{
				shortcut.deactivityState("mouseInView3D");
			}
		}

		private onclick()
		{
			var gameObject = mouse3DManager.getSelectedObject3D();
			if (!gameObject || !gameObject.scene)
				return;
			var node = hierarchyTree.getNode(gameObject);
			while (!node && (gameObject == gameObject.parent));
			{
				node = hierarchyTree.getNode(gameObject);
			}
			if (node && gameObject)
			{
				if (gameObject.scene.gameObject == gameObject)
				{
					editor3DData.selectedObject = null;
				} else
				{
					editor3DData.selectedObject = gameObject;
				}
			}
		}
	}
}