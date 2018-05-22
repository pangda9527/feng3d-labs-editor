namespace feng3d.editor
{
	export class TreeNode
	{
		/**
		 * 标签
		 */
		label = "";
		/**
         * 目录深度
         */
		depth = 0;
		/**
		 * 是否打开
		 */
		isOpen = true;
		/**
		 * 是否选中
		 */
		selected = false;
        /** 
         * 父节点
         */
		parent: TreeNode = null;
        /**
         * 子节点列表
         */
		children: TreeNode[];

		constructor(obj?: Partial<TreeNode>)
		{
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
			this.parent = null;
			this.children = null;
		}
	}

	export interface TreeEventMap
	{
		added: TreeNode;
		removed: TreeNode;
		changed: TreeNode;
		openChanged: TreeNode;
	}

	export interface Tree
	{
		once<K extends keyof TreeEventMap>(type: K, listener: (event: TreeEventMap[K]) => void, thisObject?: any, priority?: number): void;
		dispatch<K extends keyof TreeEventMap>(type: K, data?: TreeEventMap[K], bubbles?: boolean);
		has<K extends keyof TreeEventMap>(type: K): boolean;
		on<K extends keyof TreeEventMap>(type: K, listener: (event: TreeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean);
		off<K extends keyof TreeEventMap>(type?: K, listener?: (event: TreeEventMap[K]) => any, thisObject?: any);
	}

	export class Tree extends EventDispatcher
	{
		_rootnode: TreeNode;
		get rootnode()
		{
			return this._rootnode;
		}
		set rootnode(value)
		{
			if (this._rootnode == value)
				return;
			if (this._rootnode)
			{
				watcher.unwatch(this._rootnode, "isOpen", this.isopenchanged, this)
			}
			this._rootnode = value;
			if (this._rootnode)
			{
				watcher.watch(this._rootnode, "isOpen", this.isopenchanged, this)
			}
		}

        /**
         * 判断是否包含节点
         */
		contain(node: TreeNode, rootnode?: TreeNode)
		{
			rootnode = rootnode || this.rootnode;
			var result = false;
			treeMap(rootnode, (item) =>
			{
				if (item == node)
					result = true;
			});
			return result;
		}

		addNode(node: TreeNode, parentnode?: TreeNode)
		{
			parentnode = parentnode || this.rootnode;
			debuger && assert(!this.contain(parentnode, node), "无法添加到自身节点中!");

			node.parent = parentnode;
			parentnode.children.push(node);
			this.updateChildrenDepth(node);

			watcher.watch(node, "isOpen", this.isopenchanged, this)

			this.dispatch("added", node);
			this.dispatch("changed", node);
		}

		removeNode(node: TreeNode)
		{
			var parentnode = node.parent;
			if (!parentnode)
				return;
			var index = parentnode.children.indexOf(node);
			debuger && assert(index != -1);
			parentnode.children.splice(index, 1);

			node.parent = null;

			watcher.unwatch(node, "isOpen", this.isopenchanged, this)

			this.dispatch("removed", node);
			this.dispatch("changed", node);
		}

		destroy(node: TreeNode)
		{
			this.removeNode(node);
			if (node.children)
			{
				for (var i = node.children.length - 1; i >= 0; i--)
				{
					this.destroy(node.children[i]);
				}
				node.children.length = 0;
			}
		}

		updateChildrenDepth(node: TreeNode)
		{
			node.depth = ~~node.parent.depth + 1;
			treeMap(node, (node) =>
			{
				node.depth = ~~node.parent.depth + 1;
			});
		}

		getShowNodes(node?: TreeNode)
		{
			node = node || this.rootnode;
			if (!node) return [];
			var nodes: TreeNode[] = [node];
			if (node.isOpen)
			{
				node.children.forEach(element =>
				{
					nodes = nodes.concat(this.getShowNodes(element));
				});
			}
			return nodes;
		}

		private isopenchanged(host: any, property: string, oldvalue: any)
		{
			this.dispatch("openChanged", host);
		}
	}

	export function treeMap<T extends TreeNode>(treeNode: T, callback: (node: T, parent: T) => void)
	{
		if (treeNode.children)
		{
			treeNode.children.forEach(element =>
			{
				callback(<T>element, treeNode);
				treeMap(element, callback);
			});
		}
	}
}