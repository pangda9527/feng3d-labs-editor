import { globalEmitter, menuConfig, serialization, FSType, FS, Rectangle, MenuItem, windowEventProxy, Vector2 } from 'feng3d';
import { editorRS } from '../assets/EditorRS';
import { editorcache } from '../caches/Editorcache';
import { editorData } from '../Editor';
import { MRSToolType } from '../global/EditorData';
import { menu } from './components/Menu';

export class TopView extends eui.Component implements eui.UIComponent
{
	public menuList: eui.List;
	public labelLab: eui.Label;
	public topGroup: eui.Group;
	public moveButton: eui.ToggleButton;
	public rotateButton: eui.ToggleButton;
	public scaleButton: eui.ToggleButton;
	public centerButton: eui.ToggleButton;
	public worldButton: eui.ToggleButton;
	public helpButton: eui.Button;
	public qrcodeButton: eui.Button;
	public settingButton: eui.Button;
	public stopBtn: eui.Button;
	public playBtn: eui.Button;
	public nextframeBtn: eui.Button;

	constructor()
	{
		super();

		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "TopView";
	}

	private onComplete(): void
	{
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		if (this.stage)
		{
			this.onAddedToStage();
		}
	}

	private onAddedToStage()
	{
		this.moveButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.rotateButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.scaleButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.worldButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.centerButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.playBtn.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

		this.helpButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
		this.settingButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
		this.qrcodeButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

		globalEmitter.on("editor.toolTypeChanged", this.updateview, this);

		//
		var menuItems = menuConfig.getMainMenu();
		var menuItem = menu.handleShow({ submenu: menuItems });
		menuItems = menuItem.submenu;
		menuItems = menuItems.filter(v => v.type != "separator");
		var dataProvider = new eui.ArrayCollection();
		dataProvider.replaceAll(menuItems);
		//
		this.menuList.itemRenderer = TopMenuItemRenderer;
		this.menuList.dataProvider = dataProvider;
		this.updateview();
	}

	private onRemovedFromStage()
	{
		this.moveButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.rotateButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.scaleButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.worldButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.centerButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
		this.playBtn.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

		this.helpButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
		this.settingButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
		this.qrcodeButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

		globalEmitter.off("editor.toolTypeChanged", this.updateview, this);

		if (runwin) runwin.close();
		runwin = null;
	}

	private onHelpButtonClick()
	{
		window.open("http://com");
	}

	private onButtonClick(event: egret.TouchEvent)
	{
		switch (event.currentTarget)
		{
			case this.moveButton:
				editorData.toolType = MRSToolType.MOVE;
				break;
			case this.rotateButton:
				editorData.toolType = MRSToolType.ROTATION;
				break;
			case this.scaleButton:
				editorData.toolType = MRSToolType.SCALE;
				break;
			case this.worldButton:
				editorData.isWoldCoordinate = !editorData.isWoldCoordinate;
				break;
			case this.centerButton:
				editorData.isBaryCenter = !editorData.isBaryCenter;
				break;
			case this.playBtn:
				var e = globalEmitter.emit("inspector.saveShowData", () =>
				{
					let obj = serialization.serialize(editorData.gameScene.gameObject);
					editorRS.fs.writeObject("default.scene.json", obj, (err) =>
					{
						if (err)
						{
							console.warn(err);
							return;
						}
						if (editorRS.fs.type == FSType.indexedDB)
						{
							if (runwin) runwin.close();
							runwin = window.open(`run.html?fstype=${FS.fs.type}&project=${editorcache.projectname}`);
							return;
						}
						var path = editorRS.fs.getAbsolutePath("index.html");
						if (runwin) runwin.close();
						runwin = window.open(path);
					});
				});
				var a = e;
				break;
			case this.qrcodeButton:
				setTimeout(() =>
				{
					$('#output').show();
				}, 10);
				break;
		}
	}

	private updateview()
	{
		this.labelLab.text = editorcache.projectname;
		this.moveButton.selected = editorData.toolType == MRSToolType.MOVE;
		this.rotateButton.selected = editorData.toolType == MRSToolType.ROTATION;
		this.scaleButton.selected = editorData.toolType == MRSToolType.SCALE;
		this.worldButton.selected = !editorData.isWoldCoordinate;
		this.centerButton.selected = editorData.isBaryCenter;
	}
}

var showMenuItem: { menu: egret.DisplayObject, item: TopMenuItemRenderer };
var items: { item: TopMenuItemRenderer; rect: Rectangle; }[]

export class TopMenuItemRenderer extends eui.ItemRenderer
{
	data: MenuItem;

	public selectedRect: eui.Rect;
	public label: eui.Label;

	protected dataChanged()
	{
		super.dataChanged();
		this.updateView();
	}

	constructor()
	{
		super();
		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "TopMenuItemRender";
	}

	private onComplete(): void
	{
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		if (this.stage)
		{
			this.onAddedToStage();
		}
	}

	private onAddedToStage()
	{
		this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);

		this.updateView();
	}

	private onRemovedFromStage()
	{
		this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
	}

	private updateView()
	{
		if (!this.data)
			return;
		this.touchEnabled = true;
		this.touchChildren = true;
		this.skin.currentState = "normal";
		this.selectedRect.visible = false;
	}

	private onItemMouseDown(event: egret.TouchEvent): void
	{
		if (showMenuItem) return;

		var list = this.parent;
		console.assert(list instanceof eui.List);
		items = list.$children.filter(v => v instanceof TopMenuItemRenderer).map((v: TopMenuItemRenderer) => { return { item: v, rect: v.getGlobalBounds() }; });

		showMenu(this);

		windowEventProxy.on("mousemove", onMenuMouseMove);
	}
}

function showMenu(item: TopMenuItemRenderer)
{
	removeMenu();

	//
	var rect = item.getTransformedBounds(item.stage);
	var menuView = menu.popup(item.data.submenu);
	menuView.x = rect.x;
	menuView.y = rect.bottom;
	menuView.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromeStage, null);
	showMenuItem = { menu: menuView, item: item };
}

function onMenuMouseMove()
{
	var p = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
	var overitem = items.filter(v => v.rect.contains(p.x, p.y))[0];
	if (!overitem) return;
	if (showMenuItem.item == overitem.item) return;

	showMenu(overitem.item);
}

function removeMenu()
{
	if (showMenuItem)
	{
		showMenuItem.menu.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromeStage, null);
		showMenuItem.menu.remove()
	};
	showMenuItem = null;
}

function onRemoveFromeStage()
{
	removeMenu();

	windowEventProxy.off("mousemove", onMenuMouseMove);
}

// 运行窗口
export var runwin: Window;
