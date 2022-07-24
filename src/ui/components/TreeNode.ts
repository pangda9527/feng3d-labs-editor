import { EventEmitter, watch, gPartial } from 'feng3d';

export interface TreeNodeMap
{
	added: TreeNode;
	removed: TreeNode;
	openChanged: TreeNode;
}

export class TreeNode<T extends TreeNodeMap = TreeNodeMap> extends EventEmitter<T>
{
	/**
	 * 标签
	 */
	label = "";
	/**
	 * 目录深度
	 */
	get depth()
	{
		var d = 0;
		var p = this.parent;
		while (p)
		{
			d++;
			p = p.parent;
		}
		return d;
	}
	/**
	 * 是否打开
	 */
	@watch("openChanged")
	isOpen = false;

	/**
	 * 是否选中
	 */
	@watch("selectedChanged")
	selected = false;
	/** 
	 * 父结点
	 */
	parent: TreeNode = null;
	/**
	 * 子结点列表
	 */
	children: TreeNode[];

	constructor(obj?: gPartial<TreeNode>)
	{
		super();
		if (obj)
		{
			Object.assign(this, obj);
		}
	}

	/**
	 * 销毁
	 */
	destroy()
	{
		if (this.children)
		{
			this.children.concat().forEach(element =>
			{
				element.destroy();
			});
		}
		this.remove();

		this.parent = null;
		this.children = null;
	}

	/**
	 * 判断是否包含结点
	 */
	contain(node: TreeNode)
	{
		while (node)
		{
			if (node == this) return true;
			node = node.parent;
		}
		return false;
	}

	addChild(node: TreeNode)
	{
		node.remove();

		console.assert(!node.contain(this), "无法添加到自身结点中!");

		if (this.children.indexOf(node) == -1) this.children.push(node);
		node.parent = this;

		this.emit("added", node, true);
	}

	remove()
	{
		if (this.parent)
		{
			var index = this.parent.children.indexOf(this);
			if (index != -1) this.parent.children.splice(index, 1);
			this.emit("removed", this, true);
			this.parent = null;
		}
	}

	getShowNodes()
	{
		var nodes: TreeNode[] = [this];
		if (this.isOpen)
		{
			this.children.forEach(element =>
			{
				nodes = nodes.concat(element.getShowNodes());
			});
		}
		return nodes;
	}

	openParents()
	{
		var p = this.parent;
		while (p)
		{
			p.isOpen = true;
			p = p.parent;
		}
	}

	private openChanged()
	{
		this.emit("openChanged", null, true);
	}

	private selectedChanged()
	{
		this.openParents();
	}
}
