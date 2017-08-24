namespace feng3d.editor
{
	export interface ITreeNode
	{
		label: string;
		children?: ITreeNode[];
	}

	function treeMap(treeNode: ITreeNode, callback: (node: ITreeNode, parent: ITreeNode) => void)
	{
		if (treeNode.children)
		{
			treeNode.children.forEach(element =>
			{
				callback(element, treeNode);
				treeMap(element, callback);
			});
		}
	}

	export class TreeCollection extends egret.EventDispatcher implements eui.ICollection
	{
		private _rootNode: ITreeNode;

		get length()
		{
			if (!this._rootNode || !this._rootNode.children)
				return 0;

			var len = 0;
			treeMap(this._rootNode, () =>
			{
				len++;
			});
			return len;
		}

		constructor(rootNode: ITreeNode)
		{
			super();
			this._rootNode = rootNode;
		}

		getItemAt(index: number)
		{
			var currentIndex = 0;
			var item: ITreeNode = null;
			treeMap(this._rootNode, (node) =>
			{
				if (currentIndex == index)
					item = node;
				currentIndex++;
			});
			return item;
		}

		getItemIndex(item: ITreeNode)
		{
			var itemIndex = -1;
			var currentIndex = 0;
			treeMap(this._rootNode, (node) =>
			{
				if (item == node)
					itemIndex = currentIndex;
				currentIndex++;
			});
			return itemIndex;
		}
	}
}