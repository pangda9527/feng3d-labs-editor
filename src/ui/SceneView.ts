import { Vector2, Camera, GameObject, Vector3, Matrix4x4, Stats, serialization, FPSController, Scene, RunEnvironment, loader, shortcut, globalEmitter, windowEventProxy, raycaster, ticker, PerspectiveLens, IEvent } from 'feng3d';
import { EditorComponent } from '../feng3d/EditorComponent';
import { EditorView } from '../feng3d/EditorView';
import { GroundGrid } from '../feng3d/GroundGrid';
import { hierarchy } from '../feng3d/hierarchy/Hierarchy';
import { MRSTool } from '../feng3d/mrsTool/MRSTool';
import { SceneRotateTool } from '../feng3d/scene/SceneRotateTool';
import { EditorData } from '../global/EditorData';
import { Modules } from '../Modules';
import { sceneControlConfig } from '../shortcut/Editorshortcut';
import { AreaSelectRect } from './components/AreaSelectRect';
import { ModuleView } from './components/TabView';
import { drag } from './drag/Drag';

/**
 * 场景视图
 */
export class SceneView extends eui.Component implements ModuleView
{
	public backRect: eui.Rect;
	public group: eui.Group;

	private _canvas: HTMLCanvasElement;
	private _areaSelectStartPosition: Vector2;
	private _areaSelectRect: AreaSelectRect;
	private view: EditorView;
	private editorCamera: Camera;
	private selectedObjectsHistory: GameObject[] = [];
	private rotateSceneCenter: Vector3;
	private rotateSceneCameraGlobalMatrix: Matrix4x4;
	private rotateSceneMousePoint: Vector2;
	private preMousePoint: Vector2;
	private dragSceneMousePoint: Vector2;
	private dragSceneCameraGlobalMatrix: Matrix4x4;

	/**
	 * 模块名称
	 */
	moduleName: string;
	static moduleName = 'Scene';

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
		this.skinName = 'SceneView';
		//
		Stats.init(document.getElementById('stats'));
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
			this._canvas = document.createElement('canvas');
			document.getElementById('app').appendChild(this._canvas);
			this.view = new EditorView(this._canvas);
			//
			const editorCamera = this.editorCamera = serialization.setValue(new GameObject(), { name: 'editorCamera' }).addComponent(Camera);
			editorCamera.lens.far = 5000;
			editorCamera.transform.x = 5;
			editorCamera.transform.y = 3;
			editorCamera.transform.z = 5;
			editorCamera.transform.lookAt(new Vector3());
			editorCamera.gameObject.addComponent(FPSController).auto = false;
			this.view.camera = editorCamera;
			//
			const editorScene = serialization.setValue(new GameObject(), { name: 'editorScene' }).addComponent(Scene);
			editorScene.runEnvironment = RunEnvironment.all;
			this.view.editorScene = editorScene;
			//
			const sceneRotateTool = editorScene.gameObject.addComponent(SceneRotateTool);
			sceneRotateTool.view = this.view;
			//
			// 初始化模块
			const groundGrid = editorScene.gameObject.addComponent(GroundGrid);
			groundGrid.editorCamera = editorCamera;
			const mrsTool = editorScene.gameObject.addComponent(MRSTool);
			mrsTool.editorCamera = editorCamera;
			this.view.editorComponent = editorScene.gameObject.addComponent(EditorComponent);
			//
			loader.loadText(EditorData.editorData.getEditorAssetPath('gameobjects/Trident.gameobject.json'), (content) =>
			{
				const trident: GameObject = serialization.deserialize(JSON.parse(content));
				editorScene.gameObject.addChild(trident);
			});
		}

		this.addEventListener(egret.Event.RESIZE, this.onResize, this);

		this.backRect.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
		this.backRect.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

		shortcut.on('selectGameObject', this.onSelectGameObject, this);
		//
		shortcut.on('areaSelectStart', this._onAreaSelectStart, this);
		shortcut.on('areaSelect', this._onAreaSelect, this);
		shortcut.on('areaSelectEnd', this._onAreaSelectEnd, this);
		//
		shortcut.on('mouseRotateSceneStart', this.onMouseRotateSceneStart, this);
		shortcut.on('mouseRotateScene', this.onMouseRotateScene, this);
		shortcut.on('mouseRotateSceneEnd', this.onMouseRotateSceneEnd, this);
		//
		shortcut.on('sceneCameraForwardBackMouseMoveStart', this.onSceneCameraForwardBackMouseMoveStart, this);
		shortcut.on('sceneCameraForwardBackMouseMove', this.onSceneCameraForwardBackMouseMove, this);
		shortcut.on('sceneCameraForwardBackMouseMoveEnd', this.onSceneCameraForwardBackMouseMoveEnd, this);
		//
		shortcut.on('lookToSelectedGameObject', this.onLookToSelectedGameObject, this);
		//
		shortcut.on('dragSceneStart', this.onDragSceneStart, this);
		shortcut.on('dragScene', this.onDragScene, this);
		shortcut.on('dragSceneEnd', this.onDragSceneEnd, this);
		//
		shortcut.on('fpsViewStart', this.onFpsViewStart, this);
		shortcut.on('fpsViewStop', this.onFpsViewStop, this);
		shortcut.on('mouseWheelMoveSceneCamera', this.onMouseWheelMoveSceneCamera, this);

		globalEmitter.on('editor.addSceneToolView', this._onAddSceneToolView, this);

		drag.register(this, null, ['file_gameobject', 'file_script'], (dragdata) =>
		{
			dragdata.getDragData('file_gameobject').forEach((v) =>
			{
				hierarchy.addGameoObjectFromAsset(v, hierarchy.rootnode.gameobject);
			});
			dragdata.getDragData('file_script').forEach((v) =>
			{
				let gameobject = this.view.mouse3DManager.selectedGameObject;
				if (!gameobject || !gameobject.scene)
				{ gameobject = hierarchy.rootnode.gameobject; }
				gameobject.addScript(v.scriptName);
			});
		});

		this.once(egret.Event.ENTER_FRAME, this.onResize, this);
	}

	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.RESIZE, this.onResize, this);

		this.backRect.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
		this.backRect.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);

		//
		shortcut.off('selectGameObject', this.onSelectGameObject, this);
		//
		shortcut.off('areaSelectStart', this._onAreaSelectStart, this);
		shortcut.off('areaSelect', this._onAreaSelect, this);
		shortcut.off('areaSelectEnd', this._onAreaSelectEnd, this);
		//
		shortcut.off('mouseRotateSceneStart', this.onMouseRotateSceneStart, this);
		shortcut.off('mouseRotateScene', this.onMouseRotateScene, this);
		shortcut.off('mouseRotateSceneEnd', this.onMouseRotateSceneEnd, this);
		//
		shortcut.off('sceneCameraForwardBackMouseMoveStart', this.onSceneCameraForwardBackMouseMoveStart, this);
		shortcut.off('sceneCameraForwardBackMouseMove', this.onSceneCameraForwardBackMouseMove, this);
		shortcut.off('sceneCameraForwardBackMouseMoveEnd', this.onSceneCameraForwardBackMouseMoveEnd, this);
		//
		shortcut.off('lookToSelectedGameObject', this.onLookToSelectedGameObject, this);
		shortcut.off('dragSceneStart', this.onDragSceneStart, this);
		shortcut.off('dragScene', this.onDragScene, this);
		shortcut.off('fpsViewStart', this.onFpsViewStart, this);
		shortcut.off('fpsViewStop', this.onFpsViewStop, this);
		shortcut.off('mouseWheelMoveSceneCamera', this.onMouseWheelMoveSceneCamera, this);

		globalEmitter.off('editor.addSceneToolView', this._onAddSceneToolView, this);

		drag.unregister(this);

		if (this._canvas)
		{
			this._canvas.style.display = 'none';
			this._canvas = null;
		}
	}

	private _onAreaSelectStart()
	{
		if (!this.mouseInView) return;
		this._areaSelectStartPosition = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
	}

	private _onAreaSelect()
	{
		if (!this._areaSelectStartPosition) return;

		let areaSelectEndPosition = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);

		const rectangle = this.getGlobalBounds();
		//
		areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
		//
		this._areaSelectRect.show(this._areaSelectStartPosition, areaSelectEndPosition);
		//
		const gs = this.view.getObjectsInGlobalArea(this._areaSelectStartPosition, areaSelectEndPosition);
		const gs0 = gs.filter((g) =>
			!!hierarchy.getNode(g));
		EditorData.editorData.selectMultiObject(gs0);
	}

	private _onAreaSelectEnd()
	{
		this._areaSelectStartPosition = null;
		this._areaSelectRect.hide();
	}

	private onMouseOver()
	{
		shortcut.activityState('mouseInView3D');
	}

	private onMouseOut()
	{
		shortcut.deactivityState('mouseInView3D');
	}

	private onResize()
	{
		if (!this._canvas) return;

		this._canvas.style.display = '';

		const bound = this.getGlobalBounds();

		const style = this._canvas.style;
		style.position = 'absolute';
		style.left = `${bound.x}px`;
		style.top = `${bound.y}px`;
		style.width = `${bound.width}px`;
		style.height = `${bound.height}px`;
		style.cursor = 'hand';

		Stats.instance.dom.style.left = `${bound.x}px`;
		Stats.instance.dom.style.top = `${bound.y}px`;
	}

	private onSelectGameObject()
	{
		if (!this.mouseInView) return;

		let gameObjects = raycaster.pickAll(this.view.mouseRay3D, this.view.editorScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map((v) => v.gameObject);
		if (gameObjects.length > 0)
		{ return; }
		//
		gameObjects = raycaster.pickAll(this.view.mouseRay3D, EditorData.editorData.gameScene.mouseCheckObjects).sort((a, b) => a.rayEntryDistance - b.rayEntryDistance).map((v) => v.gameObject);
		if (gameObjects.length === 0)
		{
			EditorData.editorData.clearSelectedObjects();

			return;
		}
		//
		gameObjects = gameObjects.reduce((pv: GameObject[], gameObject) =>
		{
			let node = hierarchy.getNode(gameObject);
			while (!node && gameObject.parent)
			{
				gameObject = gameObject.parent;
				node = hierarchy.getNode(gameObject);
			}
			if (gameObject !== gameObject.scene.gameObject)
			{
				pv.push(gameObject);
			}

			return pv;
		}, []);
		//
		if (gameObjects.length > 0)
		{
			const selectedObjectsHistory = this.selectedObjectsHistory;
			let gameObject = gameObjects.reduce((pv, cv) =>
			{
				if (pv) return pv;
				if (selectedObjectsHistory.indexOf(cv) === -1) pv = cv;

				return pv;
			}, null);
			if (!gameObject)
			{
				selectedObjectsHistory.length = 0;
				gameObject = gameObjects[0];
			}
			EditorData.editorData.selectObject(gameObject);
			selectedObjectsHistory.push(gameObject);
		}
		else
		{
			EditorData.editorData.clearSelectedObjects();
		}
	}

	private onMouseRotateSceneStart()
	{
		if (!this.mouseInView) return;

		this.rotateSceneMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
		this.rotateSceneCameraGlobalMatrix = this.editorCamera.transform.localToWorldMatrix.clone();
		this.rotateSceneCenter = null;
		// 获取第一个 游戏对象
		const transformBox = EditorData.editorData.transformBox;
		if (transformBox)
		{
			this.rotateSceneCenter = transformBox.getCenter();
		}
		else
		{
			this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix.getAxisZ();
			this.rotateSceneCenter.scaleNumber(sceneControlConfig.lookDistance);
			this.rotateSceneCenter = this.rotateSceneCenter.addTo(this.rotateSceneCameraGlobalMatrix.getPosition());
		}
	}

	private onMouseRotateScene()
	{
		if (!this.rotateSceneMousePoint) return;

		const globalMatrix = this.rotateSceneCameraGlobalMatrix.clone();
		const mousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
		const view3DRect = this.view.viewRect;
		const rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
		const rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
		globalMatrix.appendRotation(Vector3.Y_AXIS, rotateY, this.rotateSceneCenter);
		const rotateAxisX = globalMatrix.getAxisX();
		globalMatrix.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
		this.editorCamera.transform.localToWorldMatrix = globalMatrix;
	}

	private onMouseRotateSceneEnd()
	{
		this.rotateSceneMousePoint = null;
	}

	private onSceneCameraForwardBackMouseMoveStart()
	{
		if (!this.mouseInView) return;

		this.preMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
	}

	private onSceneCameraForwardBackMouseMove()
	{
		if (!this.preMousePoint) return;

		const currentMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
		const moveDistance = (currentMousePoint.x + currentMousePoint.y - this.preMousePoint.x - this.preMousePoint.y) * sceneControlConfig.sceneCameraForwardBackwardStep;
		sceneControlConfig.lookDistance -= moveDistance;

		const forward = this.editorCamera.transform.localToWorldMatrix.getAxisZ();
		const camerascenePosition = this.editorCamera.transform.worldPosition;
		const newCamerascenePosition = new Vector3(
			forward.x * moveDistance + camerascenePosition.x,
			forward.y * moveDistance + camerascenePosition.y,
			forward.z * moveDistance + camerascenePosition.z);
		const newCameraPosition = this.editorCamera.transform.worldToLocalPoint(newCamerascenePosition);
		this.editorCamera.transform.position = newCameraPosition;

		this.preMousePoint = currentMousePoint;
	}

	private onSceneCameraForwardBackMouseMoveEnd()
	{
		this.preMousePoint = null;
	}

	private onDragSceneStart()
	{
		if (!this.mouseInView) return;

		this.dragSceneMousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
		this.dragSceneCameraGlobalMatrix = this.editorCamera.transform.localToWorldMatrix.clone();
	}

	private onDragScene()
	{
		if (!this.dragSceneMousePoint) return;

		const mousePoint = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
		const addPoint = mousePoint.subTo(this.dragSceneMousePoint);
		const scale = this.view.getScaleByDepth(sceneControlConfig.lookDistance);
		const up = this.dragSceneCameraGlobalMatrix.getAxisY();
		const right = this.dragSceneCameraGlobalMatrix.getAxisX();
		up.normalize(addPoint.y * scale);
		right.normalize(-addPoint.x * scale);
		const globalMatrix = this.dragSceneCameraGlobalMatrix.clone();
		globalMatrix.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
		this.editorCamera.transform.localToWorldMatrix = globalMatrix;
	}

	private onDragSceneEnd()
	{
		this.dragSceneMousePoint = null;
		this.dragSceneCameraGlobalMatrix = null;
	}

	private onFpsViewStart()
	{
		if (!this.mouseInView) return;

		const fpsController: FPSController = this.editorCamera.getComponent(FPSController);
		fpsController.onMousedown();
		ticker.onframe(this.updateFpsView, this);
	}

	private onFpsViewStop()
	{
		const fpsController = this.editorCamera.getComponent(FPSController);
		fpsController.onMouseup();
		ticker.offframe(this.updateFpsView, this);
	}

	private updateFpsView()
	{
		const fpsController = this.editorCamera.getComponent(FPSController);
		fpsController.update();
	}

	private onLookToSelectedGameObject()
	{
		if (!this.mouseInView) return;

		const transformBox = EditorData.editorData.transformBox;
		if (transformBox)
		{
			const scenePosition = transformBox.getCenter();
			let size = transformBox.getSize().length;
			size = Math.max(size, 1);
			let lookDistance = size;
			const lens = this.editorCamera.lens;
			if (lens instanceof PerspectiveLens)
			{
				lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
			}
			//
			sceneControlConfig.lookDistance = lookDistance;
			const lookPos = this.editorCamera.transform.localToWorldMatrix.getAxisZ();
			lookPos.scaleNumber(-lookDistance);
			lookPos.add(scenePosition);
			let localLookPos = lookPos.clone();
			if (this.editorCamera.transform.parent)
			{
				localLookPos = this.editorCamera.transform.parent.worldToLocalMatrix.transformPoint3(lookPos);
			}
			egret.Tween.get(this.editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
		}
	}

	private onMouseWheelMoveSceneCamera()
	{
		if (!this.mouseInView) return;

		const distance = -windowEventProxy.deltaY * sceneControlConfig.mouseWheelMoveStep * sceneControlConfig.lookDistance / 10;
		this.editorCamera.transform.localToWorldMatrix = this.editorCamera.transform.localToWorldMatrix.moveForward(distance);
		sceneControlConfig.lookDistance -= distance;
	}

	private _onAddSceneToolView(event: IEvent<eui.Component>)
	{
		this.group.addChild(event.data);
	}
}

Modules.moduleViewCls[SceneView.moduleName] = SceneView;
