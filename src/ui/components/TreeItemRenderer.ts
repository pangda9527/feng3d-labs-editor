namespace feng3d.editor
{
    export class TreeItemRenderer extends eui.ItemRenderer
    {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;

        /**
		 * 子节点相对父节点的缩进值，以像素为单位。默认17。
		 */
        indentation = 17
        data: TreeNode;

        private watchers: eui.Watcher[] = [];

        private _dragOver = false;
        protected set dragOver(value)
        {

        }
        protected get dragOver()
        {
            return this._dragOver;
        }

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "TreeItemRendererSkin";
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
            this.addEventListener(MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false, 1000);
            this.addEventListener(DragEvent.DRAG_ENTER, this.onDragEnter, this);
            this.addEventListener(DragEvent.DRAG_EXIT, this.onDragExit, this);
            this.addEventListener(DragEvent.DRAG_DROP, this.onDragDrop, this);

            //
            this.disclosureButton.addEventListener(MouseEvent.CLICK, this.onDisclosureButtonClick, this);

            this.watchers.push(
                eui.Watcher.watch(this, ["data", "depth"], this.updateView, this),
                eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this),
                eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this),
                eui.Watcher.watch(this, ["indentation"], this.updateView, this)
            );
            this.updateView();
        }

        private onRemovedFromStage()
        {
            this.removeEventListener(MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false);
            this.removeEventListener(DragEvent.DRAG_ENTER, this.onDragEnter, this);
            this.removeEventListener(DragEvent.DRAG_EXIT, this.onDragExit, this);
            this.removeEventListener(DragEvent.DRAG_DROP, this.onDragDrop, this);

            eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
            eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
            eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
            eui.Watcher.watch(this, ["indentation"], this.updateView, this);

            while (this.watchers.length > 0)
            {
                this.watchers.pop().unwatch();
            }

            //
            this.disclosureButton.removeEventListener(MouseEvent.CLICK, this.onDisclosureButtonClick, this);
        }

        private onDisclosureButtonClick()
        {
            if (this.data)
                this.data.isOpen = !this.data.isOpen;
        }

        private updateView()
        {
            this.disclosureButton.visible = this.data ? this.data.children.length > 0 : false;
            this.contentGroup.x = (this.data ? this.data.depth : 0) * this.indentation;
            this.disclosureButton.selected = this.data ? this.data.isOpen : false;
        }

        private onItemMouseDown(event: egret.TouchEvent): void
        {
            if (event.target == this.disclosureButton)
            {
                event.stopImmediatePropagation();
                return;
            }
            this.stage.once(MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.stage.once(MouseEvent.MOUSE_UP, this.onMouseUp, this);
        }

        private onMouseUp(event: MouseEvent)
        {
            this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
        }

        private onMouseMove(event: MouseEvent)
        {
            var dragSource = new DragSource();
            dragSource.addData(this.data, DragType.HierarchyNode);
            DragManager.doDrag(this, dragSource);
        }

        private onDragEnter(event: DragEvent)
        {
            var node = event.dragSource.dataForFormat(DragType.HierarchyNode);
            if (node && this.data != node)
            {
                DragManager.acceptDragDrop(this);
            }
        }

        private onDragExit(event: DragEvent)
        {
        }

        private onDragDrop(event: DragEvent)
        {
            var node: TreeNode = event.dragSource.dataForFormat(DragType.HierarchyNode);

            var iscontain = node.contain(this.data)
            if (iscontain)
            {
                alert("无法添加到自身节点中!");
                return;
            }
            if (node.parent)
            {
                node.parent.removeNode(node);
            }
            this.data.addNode(node);
        }
    }
}