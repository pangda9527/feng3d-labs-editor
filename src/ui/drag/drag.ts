module feng3d.editor
{
	export var drag = {
		register: register,
		unregister: unregister,
		/** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
		refreshAcceptables: refreshAcceptables,
	};

	export interface DragData
	{
		gameobject?: GameObject;
		animationclip?: AnimationClip;
		file_gameobject?: string;
		file_script?: string;
		file?: string;
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

	function unregister(displayObject: egret.DisplayObject)
	{
		for (var i = registers.length - 1; i >= 0; i--)
		{
			if (registers[i].displayObject == displayObject)
			{
				registers.splice(i, 1);
			}
		}
		displayObject.removeEventListener(MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
	}

	function register(displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: (keyof DragData)[], onDragDrop?: (dragSource: DragData) => void)
	{
		unregister(displayObject);
		registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });

		if (setdargSource)
			displayObject.addEventListener(MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
	}

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
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove, null);
			stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp, null);
		}
	}

	function onMouseUp(event: MouseEvent)
	{
		stage.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove, null);
		stage.removeEventListener(MouseEvent.MOUSE_UP, onMouseUp, null);

		acceptableitems && acceptableitems.forEach(element =>
		{
			element.displayObject.removeEventListener(MouseEvent.MOUSE_OVER, onMouseOver, null)
			element.displayObject.removeEventListener(MouseEvent.MOUSE_OUT, onMouseOut, null)
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

	function onMouseMove(event: MouseEvent)
	{
		stage.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove, null);

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
			element.displayObject.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver, null)
			element.displayObject.addEventListener(MouseEvent.MOUSE_OUT, onMouseOut, null)
		});
	}

	function refreshAcceptables()
	{
		acceptableitems && acceptableitems.forEach(element =>
		{
			element.displayObject.removeEventListener(MouseEvent.MOUSE_OVER, onMouseOver, null)
			element.displayObject.removeEventListener(MouseEvent.MOUSE_OUT, onMouseOut, null)
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
			element.displayObject.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver, null)
			element.displayObject.addEventListener(MouseEvent.MOUSE_OUT, onMouseOut, null)
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