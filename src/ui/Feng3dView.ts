namespace editor
{
	export class Feng3dView extends eui.Component implements ModuleView
	{
		private _canvas: HTMLElement;
		private _areaSelectStartPosition: feng3d.Vector2;
		private _areaSelectRect: AreaSelectRect;

		/**
		 * 模块名称
		 */
		moduleName: string;
		static moduleName = "Scene";

		constructor()
		{
			super();
			this.skinName = "Feng3dViewSkin";
			//
			feng3d.Stats.init(document.getElementById("stats"));
			editorui.feng3dView = this;
			//
			this.moduleName = Feng3dView.moduleName;
			//
			this._areaSelectRect = new AreaSelectRect();
			//
			feng3d.shortcut.on("areaSelectStart", this._onAreaSelectStart, this);
			feng3d.shortcut.on("areaSelect", this._onAreaSelect, this);
			feng3d.shortcut.on("areaSelectEnd", this._onAreaSelectEnd, this);

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}

		private onAddedToStage()
		{
			this._canvas = document.getElementById("glcanvas");
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);

			this.addEventListener(egret.MouseEvent.MOUSE_OVER, this._onMouseOver, this);
			this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

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

			this.once(egret.Event.ENTER_FRAME, this.onResize, this);
		}

		private onRemoveFromStage()
		{
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);

			this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this._onMouseOver, this);
			this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

			drag.unregister(this);

			if (this._canvas)
			{
				this._canvas.style.display = "none";
				this._canvas = null;
			}
		}

		private _onAreaSelectStart()
		{
			this._areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
		}

		private _onAreaSelect()
		{
			var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);

			var rectangle = editorui.feng3dView.getGlobalBounds();
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
			if (!this._canvas) return;

			this._canvas.style.display = "";

			var bound = this.getGlobalBounds();

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

	Modules.moduleViewCls[Feng3dView.moduleName] = Feng3dView;
}