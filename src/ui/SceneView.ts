namespace editor
{
	/**
	 * 场景视图
	 */
	export class SceneView extends eui.Component implements ModuleView
	{
		private _canvas: HTMLCanvasElement;
		private _areaSelectStartPosition: feng3d.Vector2;
		private _areaSelectRect: AreaSelectRect;
		private engine: EditorEngine;
		private selectedObjectsHistory: feng3d.GameObject[] = [];

		/**
		 * 模块名称
		 */
		moduleName: string;
		static moduleName = "Scene";

		/**
		 * 鼠标是否在界面中
		 */
		private get inView()
		{
			if (!this.stage) return false;
			return this.getGlobalBounds().contains(this.stage.stageX, this.stage.stageY);
		}

		constructor()
		{
			super();
			this.skinName = "SceneView";
			//
			feng3d.Stats.init(document.getElementById("stats"));
			//
			this.moduleName = SceneView.moduleName;
			//
			this._areaSelectRect = new AreaSelectRect();

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}

		private onAddedToStage()
		{
			//
			if (!this._canvas)
			{
				this._canvas = document.createElement("canvas");
				(<any>document.getElementById("app")).append(this._canvas);
				this.engine = new EditorEngine(this._canvas);
			}

			this.addEventListener(egret.Event.RESIZE, this.onResize, this);

			this.addEventListener(egret.MouseEvent.MOUSE_OVER, this._onMouseOver, this);
			this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

			//
			feng3d.shortcut.on("areaSelectStart", this._onAreaSelectStart, this);
			feng3d.shortcut.on("areaSelect", this._onAreaSelect, this);
			feng3d.shortcut.on("areaSelectEnd", this._onAreaSelectEnd, this);
			feng3d.shortcut.on("selectGameObject", this.onSelectGameObject, this);

			drag.register(this, null, ["file_gameobject", "file_script"], (dragdata) =>
			{
				if (dragdata.file_gameobject)
				{
					hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, hierarchy.rootnode.gameobject);
				}
				if (dragdata.file_script)
				{
					var gameobject = this.engine.mouse3DManager.selectedGameObject;
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

			//
			feng3d.shortcut.off("areaSelectStart", this._onAreaSelectStart, this);
			feng3d.shortcut.off("areaSelect", this._onAreaSelect, this);
			feng3d.shortcut.off("areaSelectEnd", this._onAreaSelectEnd, this);
			feng3d.shortcut.off("selectGameObject", this.onSelectGameObject, this);

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

			var rectangle = this.getGlobalBounds();
			//
			areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
			//
			this._areaSelectRect.show(this._areaSelectStartPosition, areaSelectEndPosition);
			//
			var gs = this.engine.getObjectsInGlobalArea(this._areaSelectStartPosition, areaSelectEndPosition);
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

		private onSelectGameObject()
		{
			if (!this.inView) return;

			var gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), editorData.editorScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
			if (gameObjects.length > 0)
				return;
			//
			gameObjects = feng3d.raycaster.pickAll(editorCamera.getMouseRay3D(), editorData.gameScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
			if (gameObjects.length == 0)
			{
				editorData.clearSelectedObjects();
				return;
			}
			//
			gameObjects = gameObjects.reduce((pv: feng3d.GameObject[], gameObject) =>
			{
				var node = hierarchy.getNode(gameObject);
				while (!node && gameObject.parent)
				{
					gameObject = gameObject.parent;
					node = hierarchy.getNode(gameObject);
				}
				if (gameObject != gameObject.scene.gameObject)
				{
					pv.push(gameObject);
				}
				return pv;
			}, []);
			//
			if (gameObjects.length > 0)
			{
				var selectedObjectsHistory = this.selectedObjectsHistory;
				var gameObject = gameObjects.reduce((pv, cv) =>
				{
					if (pv) return pv;
					if (selectedObjectsHistory.indexOf(cv) == -1) pv = cv;
					return pv;
				}, null);
				if (!gameObject)
				{
					selectedObjectsHistory.length = 0;
					gameObject = gameObjects[0];
				}
				editorData.selectObject(gameObject);
				selectedObjectsHistory.push(gameObject);
			}
			else
			{
				editorData.clearSelectedObjects();
			}
		}

	}

	Modules.moduleViewCls[SceneView.moduleName] = SceneView;
}