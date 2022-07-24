
export var drag: Drag;

export class Drag
{
	register(displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: (keyof DragDataMap)[], onDragDrop?: (dragSource: DragData) => void)
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

export interface DragDataItem<K extends keyof DragDataMap>
{
	datatype: K;
	value: DragDataMap[K];
}

export class DragData
{
	private datas: DragDataItem<any>[] = [];

	/**
	 * 添加拖拽数据
	 * 
	 * @param datatype 
	 * @param value 
	 */
	addDragData<K extends keyof DragDataMap>(datatype: K, value: DragDataMap[K])
	{
		var item = { datatype: datatype, value: value };
		this.datas.push(item)
	}

	/**
	 * 获取拖拽数据列表
	 * 
	 * @param datatype 
	 */
	getDragData<K extends keyof DragDataMap>(datatype: K)
	{
		var data: DragDataMap[K][] = this.datas.filter(v => v.datatype == datatype).map(v => v.value);
		return data;
	}

	/**
	 * 是否拥有指定类型数据
	 * 
	 * @param datatype 
	 */
	hasDragData<K extends keyof DragDataMap>(datatype: K)
	{
		var data: DragDataMap[K][] = this.datas.filter(v => v.datatype == datatype).map(v => v.value);
		return data.length > 0;
	}
}

/**
 * 拖拽数据
 */
export interface DragDataMap
{
	gameobject: feng3d.GameObject;
	animationclip: feng3d.AnimationClip;
	material: feng3d.Material;
	geometry: feng3d.Geometry;
	//
	file_gameobject: feng3d.GameObjectAsset;
	/**
	 * 脚本路径
	 */
	file_script: feng3d.ScriptAsset;
	/**
	 * 文件
	 */
	assetNodes: AssetNode;
	/**
	 * 声音路径
	 */
	audio: feng3d.AudioAsset;
	/**
	 * 纹理
	 */
	texture2d: feng3d.Texture2D;
	/**
	 * 立方体纹理
	 */
	texturecube: feng3d.TextureCube;
}

interface DragItem
{
	displayObject: egret.DisplayObject,
	setdargSource: (dragSource: DragData) => void,
	accepttypes: (keyof DragDataMap)[],
	onDragDrop?: (dragSource: DragData) => void
}

var stage: egret.Stage;
var registers: DragItem[] = [];
/**
 * 对象与触发接受拖拽的对象列表
 */
var accepter: egret.DisplayObject;
var accepterAlpha: number;
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
	var hasdata = item.accepttypes.reduce((prevalue, accepttype) => { return prevalue || dragSource.hasDragData(accepttype); }, false)
	return hasdata;
}

/**
 * 是否处于拖拽中
 */
var draging = false;
// 鼠标按下时位置
var mouseDownPosX = 0;
var mouseDownPosY = 0;

function onItemMouseDown(event: egret.TouchEvent): void
{
	mouseDownPosX = feng3d.windowEventProxy.clientX;
	mouseDownPosY = feng3d.windowEventProxy.clientY;

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
		//
		feng3d.shortcut.activityState(feng3d.shortCutStates.draging);
	}
}

function onMouseUp(event: egret.MouseEvent)
{
	stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
	stage.removeEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);

	acceptableitems = null;

	if (accepter)
	{
		var accepteritem = getitem(accepter);
		if (accepter != dragitem.displayObject)
		{
			accepter.alpha = accepterAlpha;
			accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
		}
	}
	accepter = null;
	dragitem = null;
	draging = false;
	//
	feng3d.shortcut.deactivityState(feng3d.shortCutStates.draging);
}

function onMouseMove(event: egret.MouseEvent)
{
	if (!dragitem) return;

	if (!draging)
	{
		if (Math.abs(mouseDownPosX - feng3d.windowEventProxy.clientX) +
			Math.abs(mouseDownPosY - feng3d.windowEventProxy.clientY) > 5)
		{
			draging = true;
		}
		return;
	}
	if (!acceptableitems)
	{
		//获取拖拽数据
		dragSource = new DragData();
		dragitem.setdargSource(dragSource);

		//获取可接受数据的对象列表
		acceptableitems = registers.reduce((value: DragItem[], item) =>
		{
			if (acceptData(item, dragSource) && item.displayObject.stage)
			{
				item["hierarchyValue"] = getHierarchyValue(item.displayObject);
				value.push(item);
			}
			return value;
		}, []);

		// 根据层级排序
		acceptableitems.sort((a, b) =>
		{
			var ah: number[] = a["hierarchyValue"];
			var bh: number[] = b["hierarchyValue"];
			for (let i = 0, num = Math.min(ah.length, bh.length); i < num; i++)
			{
				if (ah[i] != bh[i]) return ah[i] - bh[i];
			}
			return ah.length - bh.length;
		});
		acceptableitems.reverse();
	}

	if (accepter)
	{
		if (dragitem.displayObject != accepter)
		{
			accepter.alpha = accepterAlpha;
		}

		accepter = null;
	}

	//
	for (let i = 0; i < acceptableitems.length; i++)
	{
		const element = acceptableitems[i];
		var rect = element.displayObject.getGlobalBounds();
		if (rect.contains(event.stageX, event.stageY))
		{
			accepter = element.displayObject;
			if (dragitem.displayObject != accepter)
			{
				accepterAlpha = element.displayObject.alpha;
				element.displayObject.alpha = 0.5;
			}
			break;
		}
	}
}

/**
 * 获取显示对象的层级
 * 
 * @param displayObject 
 */
function getHierarchyValue(displayObject: egret.DisplayObject)
{
	var hierarchys = [];
	if (displayObject.parent)
	{
		hierarchys.unshift(displayObject.parent.getChildIndex(displayObject));
		displayObject = displayObject.parent;
	}
	return hierarchy;
}
