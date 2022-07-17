namespace feng3d { export interface ComponentMap { MRSTool: editor.MRSTool } }

namespace editor
{

    /**
     * 设置永久可见
     */
    function setAwaysVisible(component: feng3d.Component)
    {
        var models = component.getComponentsInChildren(feng3d.Renderable);
        models.forEach(element =>
        {
            if (element.material)
            {
                element.material.renderParams.depthtest = false;
            }
        });
    }

    /**
     * 位移旋转缩放工具
     */
    @feng3d.RegisterComponent()
    export class MRSTool extends feng3d.Component
    {
        private mTool: MTool;
        private rTool: RTool;
        private sTool: STool;

        private _currentTool: MRSToolBase;

        private mrsToolObject: feng3d.GameObject;
        private mrsToolTarget = new MRSToolTarget();

        get editorCamera() { return this._editorCamera; }
        set editorCamera(v) { this._editorCamera = v; this.invalidate(); }
        private _editorCamera: feng3d.Camera;

        init()
        {
            super.init();

            this.mrsToolObject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "MRSTool" });

            this.mTool = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "MTool" }).addComponent(MTool);
            this.rTool = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "RTool" }).addComponent(RTool);
            this.sTool = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "STool" }).addComponent(STool);

            this.mTool.mrsToolTarget = this.mrsToolTarget;
            this.rTool.mrsToolTarget = this.mrsToolTarget;
            this.sTool.mrsToolTarget = this.mrsToolTarget;

            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);
            //
            this.currentTool = this.mTool;
            //
            feng3d.globalEmitter.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.globalEmitter.on("editor.toolTypeChanged", this.onToolTypeChange, this);
        }

        dispose()
        {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            //
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            feng3d.globalEmitter.off("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.globalEmitter.off("editor.toolTypeChanged", this.onToolTypeChange, this);

            super.dispose();
        }

        private invalidate()
        {
            feng3d.ticker.nextframe(this.update, this);
        }

        private update()
        {
            this.mTool.editorCamera = this._editorCamera;
            this.rTool.editorCamera = this._editorCamera;
            this.sTool.editorCamera = this._editorCamera;
        }

        private onSelectedGameObjectChange()
        {
            var objects = editorData.selectedGameObjects.filter(v => !(v.hideFlags & feng3d.HideFlags.DontTransform));

            //筛选出 工具控制的对象
            if (objects.length > 0)
            {
                this.gameObject.addChild(this.mrsToolObject);
            }
            else
            {
                this.mrsToolObject.remove();
            }
        }

        private onToolTypeChange()
        {
            switch (editorData.toolType)
            {
                case MRSToolType.MOVE:
                    this.currentTool = this.mTool;
                    break;
                case MRSToolType.ROTATION:
                    this.currentTool = this.rTool;
                    break;
                case MRSToolType.SCALE:
                    this.currentTool = this.sTool;
                    break;
            }
        }

        private set currentTool(value)
        {
            if (this._currentTool == value)
                return;
            if (this._currentTool)
            {
                this._currentTool.gameObject.remove();
            }
            this._currentTool = value;
            if (this._currentTool)
            {
                this.mrsToolObject.addChild(this._currentTool.gameObject);
            }
        }
    }
}