import { ticker, watcher } from 'feng3d';
import { menuConfig } from '../../configs/CommonConfig';
import { hierarchy } from '../../feng3d/hierarchy/Hierarchy';
import { HierarchyNode } from '../../feng3d/hierarchy/HierarchyNode';
import { EditorData } from '../../global/EditorData';
import { Modules } from '../../Modules';
import { menu } from '../components/Menu';
import { ModuleView } from '../components/TabView';
import { drag, DragData } from '../drag/Drag';
import { HierarchyTreeItemRenderer } from './HierarchyTreeItemRenderer';

export class HierarchyView extends eui.Component implements ModuleView
{
	/**
	 * 模块名称
	 */
	static moduleName = 'Hierarchy';

	public hierachyScroller: eui.Scroller;
	public list: eui.List;

	private listData: eui.ArrayCollection;

	/**
	 * 模块名称
	 */
	moduleName: string;

	constructor()
	{
		super();
		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'HierarchyViewSkin';
		this.moduleName = HierarchyView.moduleName;
	}

	private onComplete(): void
	{
		this.list.itemRenderer = HierarchyTreeItemRenderer;

		this.hierachyScroller.viewport = this.list;

		this.listData = this.list.dataProvider = new eui.ArrayCollection();

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		if (this.stage)
		{
			this.onAddedToStage();
		}
	}

	private onAddedToStage()
	{
		drag.register(this.list, null, ['gameobject', 'file_gameobject', 'file_script'], (dragdata: DragData) =>
		{
			hierarchy.rootnode.acceptDragDrop(dragdata);
		});

		this.list.addEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
		this.list.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);

		watcher.watch(hierarchy, 'rootnode', this.onRootNodeChanged, this);
		this.onRootNode(hierarchy.rootnode);

		this.invalidHierarchy();
	}

	private onRemovedFromStage()
	{
		drag.unregister(this.list);

		this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
		this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);

		watcher.unwatch(hierarchy, 'rootnode', this.onRootNodeChanged, this);
		this.offRootNode(hierarchy.rootnode);
	}

	private onRootNodeChanged(newValue?: HierarchyNode, oldvalue?: HierarchyNode)
	{
		this.offRootNode(oldvalue);
		this.onRootNode(hierarchy.rootnode);
		this.invalidHierarchy();
	}

	private onRootNode(node: HierarchyNode)
	{
		if (node)
		{
			node.on('added', this.invalidHierarchy, this);
			node.on('removed', this.invalidHierarchy, this);
			node.on('openChanged', this.invalidHierarchy, this);
		}
	}

	private offRootNode(node: HierarchyNode)
	{
		if (node)
		{
			node.off('added', this.invalidHierarchy, this);
			node.off('removed', this.invalidHierarchy, this);
			node.off('openChanged', this.invalidHierarchy, this);
		}
	}

	private invalidHierarchy()
	{
		ticker.nextframe(this.updateHierarchyTree, this);
	}

	private updateHierarchyTree()
	{
		if (!hierarchy.rootnode) return;
		const nodes = hierarchy.rootnode.getShowNodes();
		this.listData.replaceAll(nodes);
	}

	private onListClick(e: egret.MouseEvent)
	{
		if (e.target === this.list)
		{
			EditorData.editorData.selectObject(null);
		}
	}

	private onListRightClick(e: egret.MouseEvent)
	{
		if (e.target === this.list)
		{
			EditorData.editorData.selectObject(null);
			menu.popup(menuConfig.getCreateObjectMenu());
		}
	}
}

Modules.moduleViewCls[HierarchyView.moduleName] = HierarchyView;
