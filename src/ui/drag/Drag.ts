namespace editor
{
	export var drag: Drag;

	export class Drag
	{
		register(displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: (keyof DragData)[], onDragDrop?: (dragSource: DragData) => void)
		{
			this.unregister(displayObject);
			registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });

			if (setdargSource)
				displayObject.addEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
		}
		unregister(displayObject: egret.DisplayObject)
		{
			for (var i = registers.length - 1; i >= 0; i--)
			{
				if (registers[i].displayObject == displayObject)
				{
					registers.splice(i, 1);
				}
			}
			displayObject.removeEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
		}
		/** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
		refreshAcceptables()
		{
			//获取可接受数据的对象列表
			acceptableitems = registers.reduce((value: DragItem[], item) =>
			{
				if (item != dragitem && acceptData(item, dragSource))
				{
					value.push(item);
				}
				return value;
			}, []);
		}
	};

	drag = new Drag();

	/**
	 * 拖拽数据
	 */
	export interface DragData
	{
		gameobject?: feng3d.GameObject;
		animationclip?: feng3d.AnimationClip;
		material?: feng3d.Material;
		geometry?: feng3d.Geometry;
		//
		file_gameobject?: string;
		/**
		 * 脚本路径
		 */
		file_script?: ScriptFile;
		/**
		 * 文件路径
		 */
		file?: string;
		/**
		 * 图片路径
		 */
		image?: string;
		/**
		 * 声音路径
		 */
		audio?: string;
		/**
		 * 立方体纹理
		 */
		texturecube?: feng3d.TextureCube;
	}

	interface DragItem
	{
		displayObject: egret.DisplayObject,
		setdargSource: (dragSource: DragData) => void,
		accepttypes: (keyof DragData)[],
		onDragDrop?: (dragSource: DragData) => void
	}

	var stage: egret.Stage;
	var registers: DragItem[] = [];
	/**
	 * 对象与触发接受拖拽的对象列表
	 */
	var accepters = new Map<egret.DisplayObject, number>();
	/**
	 * 被拖拽数据
	 */
	var dragSource: DragData;
	/**
	 * 被拖拽对象
	 */
	var dragitem: DragItem;
	/**
	 * 可接受拖拽数据对象列表
	 */
	var acceptableitems: DragItem[];

	function getitem(displayObject: egret.DisplayObject)
	{
		for (var i = 0; i < registers.length; i++)
		{
			if (registers[i].displayObject == displayObject)
				return registers[i];
		}
		return null;
	}

	/**
	 * 判断是否接受数据
	 * @param item 
	 * @param dragSource 
	 */
	function acceptData(item: DragItem, dragSource: DragData)
	{
		var hasdata = item.accepttypes.reduce((prevalue, accepttype) => { return prevalue || !!dragSource[accepttype]; }, false)
		return hasdata;
	}

	function onItemMouseDown(event: egret.TouchEvent): void
	{
		if (dragitem)
			return;
		dragitem = getitem(event.currentTarget);

		if (!dragitem.setdargSource)
		{
			dragitem = null;
			return;
		}

		if (dragitem)
		{
			stage = dragitem.displayObject.stage;
			stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
			stage.addEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
		}
	}

	function onMouseUp(event: egret.MouseEvent)
	{
		stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
		stage.removeEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);

		acceptableitems = null;

		accepters.getKeys().forEach(element =>
		{
			element.alpha = accepters.get(element);
			var accepteritem = getitem(element);
			accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
		});

		accepters.clear();

		dragitem = null;
	}

	function onMouseMove(event: egret.MouseEvent)
	{
		if (!acceptableitems)
		{
			//获取拖拽数据
			dragSource = {};
			dragitem.setdargSource(dragSource);

			//获取可接受数据的对象列表
			acceptableitems = registers.reduce((value: DragItem[], item) =>
			{
				if (item != dragitem && acceptData(item, dragSource))
				{
					value.push(item);
				}
				return value;
			}, []);
		}

		accepters.getKeys().forEach(element =>
		{
			element.alpha = accepters.get(element);
		});
		accepters.clear();

		acceptableitems.forEach(element =>
		{
			if (element.displayObject.getTransformedBounds(stage).contains(event.stageX, event.stageY))
			{
				accepters.set(element.displayObject, element.displayObject.alpha);
				element.displayObject.alpha = 0.5;
			}
		});
	}
}