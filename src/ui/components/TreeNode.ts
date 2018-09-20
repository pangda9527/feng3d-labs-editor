namespace editor
{
	export interface TreeNodeMap
	{
		added: TreeNode;
		removed: TreeNode;
		openChanged: TreeNode;
	}

	export interface TreeNode
	{
		once<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => void, thisObject?: any, priority?: number): void;
		dispatch<K extends keyof TreeNodeMap>(type: K, data?: TreeNodeMap[K], bubbles?: boolean): feng3d.Event<TreeNodeMap[K]>;
		has<K extends keyof TreeNodeMap>(type: K): boolean;
		on<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean);
		off<K extends keyof TreeNodeMap>(type?: K, listener?: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any);
	}

	export class TreeNode extends feng3d.EventDispatcher
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
		@feng3d.watch("openChanged")
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
         * 判断是否包含节点
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
			feng3d.assert(!node.contain(this), "无法添加到自身节点中!");

			if (this.children.indexOf(node) == -1) this.children.push(node);
			node.parent = this;

			this.dispatch("added", node, true);
		}

		remove()
		{
			if (this.parent)
			{
				var index = this.parent.children.indexOf(this);
				if (index != -1) this.parent.children.splice(index, 1);
			}

			this.dispatch("removed", this, true);
			this.parent = null;
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

		private openChanged()
		{
			this.dispatch("openChanged", null, true);
		}
	}
}