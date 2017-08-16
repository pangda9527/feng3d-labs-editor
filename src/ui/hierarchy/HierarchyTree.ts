namespace feng3d.editor
{
    export class HierarchyTree extends Tree
    {
        constructor()
        {
            super();
            this.itemRenderer = HierarchyTreeItemRenderer;
        }
    }
}