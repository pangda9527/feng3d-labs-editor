namespace feng3d { export interface ComponentMap { MRSTool: editor.MRSTool } }

namespace editor
{

    /**
     * 设置永久可见
     */
    function setAwaysVisible(component: feng3d.Component)
    {
        var models = component.getComponentsInChildren(feng3d.Model);
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
    export class MRSTool extends feng3d.Component
    {
        private mTool: MTool;
        private rTool: RTool;
        private sTool: STool;

        private _currentTool: MRSToolBase;

        private controllerTarget: MRSToolTarget;
        private mrsToolObject: feng3d.GameObject;

        init(gameObject: feng3d.GameObject)
        {
            super.init(gameObject);

            this.mrsToolObject = feng3d.GameObject.create("MRSTool");

            this.controllerTarget = new MRSToolTarget();

            this.mTool = feng3d.GameObject.create("MTool").addComponent(MTool);
            this.rTool = feng3d.GameObject.create("RTool").addComponent(RTool);
            this.sTool = feng3d.GameObject.create("STool").addComponent(STool);
            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);

            this.mTool.gameobjectControllerTarget = this.controllerTarget;
            this.rTool.gameobjectControllerTarget = this.controllerTarget;
            this.sTool.gameobjectControllerTarget = this.controllerTarget;
            //
            this.currentTool = this.mTool;
            //
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.feng3dDispatcher.on("editor.toolTypeChanged", this.onToolTypeChange, this);
        }

        dispose()
        {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            //
            this.controllerTarget = null;
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.feng3dDispatcher.off("editor.toolTypeChanged", this.onToolTypeChange, this);

            super.dispose();
        }

        private onSelectedGameObjectChange()
        {
            //筛选出 工具控制的对象
            var transforms = editorData.mrsTransforms;
            if (transforms.length > 0)
            {
                this.controllerTarget.controllerTargets = transforms;
                this.gameObject.addChild(this.mrsToolObject);
            }
            else
            {
                this.controllerTarget.controllerTargets = null;
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