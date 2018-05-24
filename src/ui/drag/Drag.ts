namespace feng3d.editor
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
			acceptableitems && acceptableitems.forEach(element =>
			{
				element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null)
				element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null)
			});
			acceptableitems = null;

			//获取可接受数据的对象列表
			acceptableitems = registers.reduce((value: DragItem[], item) =>
			{
				if (item != dragitem && acceptData(item, dragSource))
				{
					value.push(item);
				}
				return value;
			}, []);

			acceptableitems.forEach(element =>
			{
				element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null)
				element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null)
			});
		}
	};


	drag = new Drag();

	/**
	 * 拖拽数据
	 */
	export interface DragData
	{
		gameobject?: GameObject;
		animationclip?: AnimationClip;
		material?: Material;
		geometry?: Geometry;
		//
		file_gameobject?: string;
		/**
		 * 脚本路径
		 */
		file_script?: string;
		/**
		 * 文件路径
		 */
		file?: string;
		/**
		 * 图片路径
		 */
		image?: string;
		/**
		 * 立方体纹理
		 */
		texturecube?: TextureCube;
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
	 * 接受拖拽数据对象列表
	 */
	var accepters: egret.DisplayObject[];
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

		acceptableitems && acceptableitems.forEach(element =>
		{
			element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null)
			element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null)
		});
		acceptableitems = null;

		accepters && accepters.forEach(accepter =>
		{
			accepter.alpha = 1.0;
			var accepteritem = getitem(accepter);
			accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
		});
		accepters = null;

		dragitem = null;
	}

	function onMouseMove(event: egret.MouseEvent)
	{
		stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);

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

		acceptableitems.forEach(element =>
		{
			element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null)
			element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null)
		});
	}

	function onMouseOver(event: egret.Event)
	{
		var displayObject: egret.DisplayObject = event.currentTarget;
		accepters = accepters || [];
		if (accepters.indexOf(displayObject) == -1)
		{
			accepters.push(displayObject);
			displayObject.alpha = 0.5;
		}
	}

	function onMouseOut(event: egret.Event)
	{
		var displayObject: egret.DisplayObject = event.currentTarget;
		accepters = accepters || [];
		var index = accepters.indexOf(displayObject);
		if (index != -1)
		{
			accepters.splice(index, 1);
			displayObject.alpha = 1.0;
		}
	}
}