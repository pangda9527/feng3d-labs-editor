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
		private editorCamera: feng3d.Camera;
		private selectedObjectsHistory: feng3d.GameObject[] = [];
		private rotateSceneCenter: feng3d.Vector3;
		private rotateSceneCameraGlobalMatrix3D: feng3d.Matrix4x4;
		private rotateSceneMousePoint: feng3d.Vector2;
		private preMousePoint: feng3d.Vector2;
		private dragSceneMousePoint: feng3d.Vector2;
		private dragSceneCameraGlobalMatrix3D: feng3d.Matrix4x4;

		/**
		 * 模块名称
		 */
		moduleName: string;
		static moduleName = "Scene";

		/**
		 * 鼠标是否在界面中
		 */
		private get mouseInView()
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
				//
				this._canvas = document.createElement("canvas");
				(<any>document.getElementById("app")).append(this._canvas);
				this.engine = new EditorEngine(this._canvas);
				//
				var editorCamera = this.editorCamera = Object.setValue(new feng3d.GameObject(), { name: "editorCamera" }).addComponent(feng3d.Camera);
				editorCamera.lens.far = 5000;
				editorCamera.transform.x = 5;
				editorCamera.transform.y = 3;
				editorCamera.transform.z = 5;
				editorCamera.transform.lookAt(new feng3d.Vector3());
				editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
				this.engine.camera = editorCamera;
				//
				var editorScene = Object.setValue(new feng3d.GameObject(), { name: "editorScene" }).addComponent(feng3d.Scene3D);
				editorScene.runEnvironment = feng3d.RunEnvironment.all;
				this.engine.editorScene = editorScene;
				//
				var sceneRotateTool = editorScene.gameObject.addComponent(SceneRotateTool);
				sceneRotateTool.engine = this.engine;
				//
				//初始化模块
				var groundGrid = editorScene.gameObject.addComponent(GroundGrid);
				groundGrid.editorCamera = editorCamera;
				var mrsTool = editorScene.gameObject.addComponent(MRSTool);
				mrsTool.editorCamera = editorCamera;
				editorComponent = editorScene.gameObject.addComponent(EditorComponent);
				editorComponent.editorCamera = editorCamera;
				//
				feng3d.loader.loadText(editorData.getEditorAssetPath("gameobjects/Trident.gameobject.json"), (content) =>
				{
					var trident: feng3d.GameObject = feng3d.serialization.deserialize(JSON.parse(content));
					editorScene.gameObject.addChild(trident);
				});
			}

			this.addEventListener(egret.Event.RESIZE, this.onResize, this);

			this.addEventListener(egret.MouseEvent.MOUSE_OVER, this._onMouseOver, this);
			this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

			//
			feng3d.shortcut.on("areaSelectStart", this._onAreaSelectStart, this);
			feng3d.shortcut.on("areaSelect", this._onAreaSelect, this);
			feng3d.shortcut.on("areaSelectEnd", this._onAreaSelectEnd, this);
			feng3d.shortcut.on("selectGameObject", this.onSelectGameObject, this);
			feng3d.shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
			feng3d.shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
			//
			feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", this.onSceneCameraForwardBackMouseMoveStart, this);
			feng3d.shortcut.on("sceneCameraForwardBackMouseMove", this.onSceneCameraForwardBackMouseMove, this);
			//
			feng3d.shortcut.on("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
			feng3d.shortcut.on("dragSceneStart", this.onDragSceneStart, this);
			feng3d.shortcut.on("dragScene", this.onDragScene, this);
			feng3d.shortcut.on("fpsViewStart", this.onFpsViewStart, this);
			feng3d.shortcut.on("fpsViewStop", this.onFpsViewStop, this);
			feng3d.shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);

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
			feng3d.shortcut.off("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
			feng3d.shortcut.off("mouseRotateScene", this.onMouseRotateScene, this);
			//
			feng3d.shortcut.off("sceneCameraForwardBackMouseMoveStart", this.onSceneCameraForwardBackMouseMoveStart, this);
			feng3d.shortcut.off("sceneCameraForwardBackMouseMove", this.onSceneCameraForwardBackMouseMove, this);
			//
			feng3d.shortcut.off("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
			feng3d.shortcut.off("dragSceneStart", this.onDragSceneStart, this);
			feng3d.shortcut.off("dragScene", this.onDragScene, this);
			feng3d.shortcut.off("fpsViewStart", this.onFpsViewStart, this);
			feng3d.shortcut.off("fpsViewStop", this.onFpsViewStop, this);
			feng3d.shortcut.off("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);

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
			if (!this.mouseInView) return;

			var gameObjects = feng3d.raycaster.pickAll(this.engine.getMouseRay3D(), this.engine.editorScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
			if (gameObjects.length > 0)
				return;
			//
			gameObjects = feng3d.raycaster.pickAll(this.engine.getMouseRay3D(), editorData.gameScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map(v => v.gameObject);
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

		private onMouseRotateSceneStart()
		{
			if (!this.mouseInView) return;

			this.rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
			this.rotateSceneCameraGlobalMatrix3D = this.editorCamera.transform.localToWorldMatrix.clone();
			this.rotateSceneCenter = null;
			//获取第一个 游戏对象
			var transformBox = editorData.transformBox;
			if (transformBox)
			{
				this.rotateSceneCenter = transformBox.getCenter();
			} else
			{
				this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
				this.rotateSceneCenter.scaleNumber(sceneControlConfig.lookDistance);
				this.rotateSceneCenter = this.rotateSceneCenter.addTo(this.rotateSceneCameraGlobalMatrix3D.position);
			}
		}

		private onMouseRotateScene()
		{
			if (!this.mouseInView) return;

			var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
			var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
			var view3DRect = this.engine.viewRect;
			var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
			var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
			globalMatrix3D.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, this.rotateSceneCenter);
			var rotateAxisX = globalMatrix3D.right;
			globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
			this.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
		}

		private onSceneCameraForwardBackMouseMoveStart()
		{
			if (!this.mouseInView) return;

			this.preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
		}

		private onSceneCameraForwardBackMouseMove()
		{
			if (!this.mouseInView) return;

			var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
			var moveDistance = (currentMousePoint.x + currentMousePoint.y - this.preMousePoint.x - this.preMousePoint.y) * sceneControlConfig.sceneCameraForwardBackwardStep;
			sceneControlConfig.lookDistance -= moveDistance;

			var forward = this.editorCamera.transform.localToWorldMatrix.forward;
			var camerascenePosition = this.editorCamera.transform.scenePosition;
			var newCamerascenePosition = new feng3d.Vector3(
				forward.x * moveDistance + camerascenePosition.x,
				forward.y * moveDistance + camerascenePosition.y,
				forward.z * moveDistance + camerascenePosition.z);
			var newCameraPosition = this.editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
			this.editorCamera.transform.position = newCameraPosition;

			this.preMousePoint = currentMousePoint;
		}

		private onDragSceneStart()
		{
			if (!this.mouseInView) return;

			this.dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
			this.dragSceneCameraGlobalMatrix3D = this.editorCamera.transform.localToWorldMatrix.clone();
		}

		private onDragScene()
		{
			if (!this.mouseInView) return;

			var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
			var addPoint = mousePoint.subTo(this.dragSceneMousePoint);
			var scale = this.editorCamera.getScaleByDepth(sceneControlConfig.lookDistance);
			var up = this.dragSceneCameraGlobalMatrix3D.up;
			var right = this.dragSceneCameraGlobalMatrix3D.right;
			up.scaleNumber(addPoint.y * scale);
			right.scaleNumber(-addPoint.x * scale);
			var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
			globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
			this.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
		}

		private onFpsViewStart()
		{
			if (!this.mouseInView) return;

			var fpsController: feng3d.FPSController = this.editorCamera.getComponent(feng3d.FPSController)
			fpsController.onMousedown();
			feng3d.ticker.onframe(this.updateFpsView, this);
		}

		private onFpsViewStop()
		{
			var fpsController = this.editorCamera.getComponent(feng3d.FPSController)
			fpsController.onMouseup();
			feng3d.ticker.offframe(this.updateFpsView, this);
		}

		private updateFpsView()
		{
			var fpsController = this.editorCamera.getComponent(feng3d.FPSController)
			fpsController.update();
		}

		private onLookToSelectedGameObject()
		{
			if (!this.mouseInView) return;

			var transformBox = editorData.transformBox;
			if (transformBox)
			{
				var scenePosition = transformBox.getCenter();
				var size = transformBox.getSize().length;
				size = Math.max(size, 1);
				var lookDistance = size;
				var lens = this.editorCamera.lens;
				if (lens instanceof feng3d.PerspectiveLens)
				{
					lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
				}
				//
				sceneControlConfig.lookDistance = lookDistance;
				var lookPos = this.editorCamera.transform.localToWorldMatrix.forward;
				lookPos.scaleNumber(-lookDistance);
				lookPos.add(scenePosition);
				var localLookPos = lookPos.clone();
				if (this.editorCamera.transform.parent)
				{
					localLookPos = this.editorCamera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
				}
				egret.Tween.get(this.editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
			}
		}

		private onMouseWheelMoveSceneCamera()
		{
			if (!this.mouseInView) return;

			var distance = -feng3d.windowEventProxy.deltaY * sceneControlConfig.mouseWheelMoveStep * sceneControlConfig.lookDistance / 10;
			this.editorCamera.transform.localToWorldMatrix = this.editorCamera.transform.localToWorldMatrix.moveForward(distance);
			sceneControlConfig.lookDistance -= distance;
		}
	}

	Modules.moduleViewCls[SceneView.moduleName] = SceneView;
}