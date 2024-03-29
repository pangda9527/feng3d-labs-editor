import { FS, FSType, globalEmitter, Rectangle, serialization, Vector2, windowEventProxy } from 'feng3d';
import { editorRS } from '../assets/EditorRS';
import { editorcache } from '../caches/Editorcache';
import { menuConfig } from '../configs/CommonConfig';
import { EditorData, MRSToolType } from '../global/EditorData';
import { menu, MenuItem } from './components/Menu';

export class TopView extends eui.Component implements eui.UIComponent
{
	// 运行窗口
	static runwin: Window;

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
		this.skinName = 'TopView';
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

		globalEmitter.on('editor.toolTypeChanged', this.updateview, this);

		//
		let menuItems = menuConfig.getMainMenu();
		const menuItem = menu.handleShow({ submenu: menuItems });
		menuItems = menuItem.submenu;
		menuItems = menuItems.filter((v) => v.type !== 'separator');
		const dataProvider = new eui.ArrayCollection();
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

		globalEmitter.off('editor.toolTypeChanged', this.updateview, this);

		if (TopView.runwin) TopView.runwin.close();
		TopView.runwin = null;
	}

	private onHelpButtonClick()
	{
		window.open('http://com');
	}

	private onButtonClick(event: egret.TouchEvent)
	{
		switch (event.currentTarget)
		{
			case this.moveButton:
				EditorData.editorData.toolType = MRSToolType.MOVE;
				break;
			case this.rotateButton:
				EditorData.editorData.toolType = MRSToolType.ROTATION;
				break;
			case this.scaleButton:
				EditorData.editorData.toolType = MRSToolType.SCALE;
				break;
			case this.worldButton:
				EditorData.editorData.isWoldCoordinate = !EditorData.editorData.isWoldCoordinate;
				break;
			case this.centerButton:
				EditorData.editorData.isBaryCenter = !EditorData.editorData.isBaryCenter;
				break;
			case this.playBtn:
				globalEmitter.emit('inspector.saveShowData', () =>
				{
					const obj = serialization.serialize(EditorData.editorData.gameScene.gameObject);
					editorRS.fs.writeObject('default.scene.json', obj, (err) =>
					{
						if (err)
						{
							console.warn(err);

							return;
						}
						if (editorRS.fs.type === FSType.indexedDB)
						{
							if (TopView.runwin) TopView.runwin.close();
							TopView.runwin = window.open(`run.html?fstype=${FS.fs.type}&project=${editorcache.projectname}`);

							return;
						}
						const path = editorRS.fs.getAbsolutePath('index.html');
						if (TopView.runwin) TopView.runwin.close();
						TopView.runwin = window.open(path);
					});
				});
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
		this.moveButton.selected = EditorData.editorData.toolType === MRSToolType.MOVE;
		this.rotateButton.selected = EditorData.editorData.toolType === MRSToolType.ROTATION;
		this.scaleButton.selected = EditorData.editorData.toolType === MRSToolType.SCALE;
		this.worldButton.selected = !EditorData.editorData.isWoldCoordinate;
		this.centerButton.selected = EditorData.editorData.isBaryCenter;
	}
}

let showMenuItem: { menu: egret.DisplayObject, item: TopMenuItemRenderer };
let items: { item: TopMenuItemRenderer; rect: Rectangle; }[];

export class TopMenuItemRenderer extends eui.ItemRenderer
{
	declare data: MenuItem;

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
		this.skinName = 'TopMenuItemRender';
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
		{ return; }
		this.touchEnabled = true;
		this.touchChildren = true;
		this.skin.currentState = 'normal';
		this.selectedRect.visible = false;
	}

	private onItemMouseDown(_event: egret.TouchEvent): void
	{
		if (showMenuItem) return;

		const list = this.parent;
		console.assert(list instanceof eui.List);
		items = list.$children.filter((v) => v instanceof TopMenuItemRenderer).map((v: TopMenuItemRenderer) => ({ item: v, rect: v.getGlobalBounds() }));

		showMenu(this);

		windowEventProxy.on('mousemove', onMenuMouseMove);
	}
}

function showMenu(item: TopMenuItemRenderer)
{
	removeMenu();

	//
	const rect = item.getTransformedBounds(item.stage);
	const menuView = menu.popup(item.data.submenu);
	menuView.x = rect.x;
	menuView.y = rect.bottom;
	menuView.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromeStage, null);
	showMenuItem = { menu: menuView, item };
}

function onMenuMouseMove()
{
	const p = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
	const overitem = items.filter((v) => v.rect.contains(p.x, p.y))[0];
	if (!overitem) return;
	if (showMenuItem.item === overitem.item) return;

	showMenu(overitem.item);
}

function removeMenu()
{
	if (showMenuItem)
	{
		showMenuItem.menu.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromeStage, null);
		showMenuItem.menu.remove();
	}
	showMenuItem = null;
}

function onRemoveFromeStage()
{
	removeMenu();

	windowEventProxy.off('mousemove', onMenuMouseMove);
}

