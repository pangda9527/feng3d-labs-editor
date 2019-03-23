namespace editor
{
	export class Feng3dView extends eui.Component
	{
		private _canvas: HTMLElement;
		private _areaSelectStartPosition: feng3d.Vector2;
		private _areaSelectRect: AreaSelectRect;

		constructor()
		{
			super();
			this.skinName = "Feng3dViewSkin";
			feng3d.Stats.init(document.getElementById("stats"));
			editorui.feng3dView = this;

			this._areaSelectRect = new AreaSelectRect();
			//
			feng3d.shortcut.on("areaSelectStart", this._onAreaSelectStart, this);
			feng3d.shortcut.on("areaSelect", this._onAreaSelect, this);
			feng3d.shortcut.on("areaSelectEnd", this._onAreaSelectEnd, this);
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number)
		{
			super.$onAddToStage(stage, nestLevel);

			this._canvas = document.getElementById("glcanvas");
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);

			this.addEventListener(egret.MouseEvent.MOUSE_OVER, this._onMouseOver, this);
			this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

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

					gameobject.addScript(dragdata.file_script.scriptName);
				}
			});
		}

		$onRemoveFromStage()
		{
			super.$onRemoveFromStage()

			this._canvas = null;
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);

			this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this._onMouseOver, this);
			this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

			drag.unregister(this);
		}

		private _onAreaSelectStart()
		{
			this._areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
		}

		private _onAreaSelect()
		{
			var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);

			var lt = editorui.feng3dView.localToGlobal(0, 0);
			var rb = editorui.feng3dView.localToGlobal(editorui.feng3dView.width, editorui.feng3dView.height);
			var rectangle = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
			//
			areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
			//
			this._areaSelectRect.show(this._areaSelectStartPosition, areaSelectEndPosition);
			//
			var gs = engine.getObjectsInGlobalArea(this._areaSelectStartPosition, areaSelectEndPosition);
			var gs0 = gs.filter(g =>
			{
				return !!hierarchy.getNode(g);
			});
			editorData.selectMultiObject(gs0);
		}

		private _onAreaSelectEnd()
		{
			this._areaSelectRect.hide();
		}

		private _onMouseOver()
		{
			feng3d.shortcut.activityState("mouseInView3D");
		}

		private onMouseOut()
		{
			feng3d.shortcut.deactivityState("mouseInView3D");
		}

		private onResize()
		{
			if (!this.stage)
				return;

			var lt = this.localToGlobal(0, 0);
			var rb = this.localToGlobal(this.width, this.height);
			var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);

			var style = this._canvas.style;
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