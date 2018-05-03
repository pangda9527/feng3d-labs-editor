namespace feng3d.editor
{
    /**
     * 游戏对象控制器类型
     */
    export enum MRSToolType
    {
        /**
         * 移动
         */
        MOVE,
        /**
         * 旋转
         */
        ROTATION,
        /**
         * 缩放
         */
        SCALE,
    }

    /**
     * 控制器数据
     */
    export class MRSToolData
    {
        /**
         * 使用的控制工具类型
         */
        toolType = MRSToolType.MOVE;

        /**
         * 是否使用世界坐标
         */
        isWoldCoordinate = false;

        /**
         * 坐标原点是否在质心
         */
        isBaryCenter = true;
    }

    /**
     * 控制器数据
     */
    export var mrsTool = new MRSToolData();

    /**
     * 设置永久可见
     */
    function setAwaysVisible(component: Component)
    {
        var meshRenderers = component.getComponentsInChildren(MeshRenderer);
        meshRenderers.forEach(element =>
        {
            if (element.material)
            {
                // element.material.depthMask = false;
                element.material.renderParams.depthtest = false;
            }
        });
    }

    /**
     * 位移旋转缩放工具
     */
    export class MRSTool extends Component
    {
        private mTool: MTool;
        private rTool: RTool;
        private sTool: STool;

        private _currentTool: MRSToolBase;

        private controllerTarget: MRSToolTarget;
        private mrsToolObject: GameObject;

        init(gameObject: GameObject)
        {
            super.init(gameObject);

            var mrsToolObject = GameObject.create("MRSTool");
            mrsToolObject.serializable = false;
            mrsToolObject.showinHierarchy = false;

            this.mrsToolObject = editorData.mrsToolObject = mrsToolObject;

            this.controllerTarget = new MRSToolTarget();

            this.mTool = GameObject.create("MTool").addComponent(MTool);
            this.rTool = GameObject.create("RTool").addComponent(RTool);
            this.sTool = GameObject.create("STool").addComponent(STool);
            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);

            this.mTool.gameobjectControllerTarget = this.controllerTarget;
            this.rTool.gameobjectControllerTarget = this.controllerTarget;
            this.sTool.gameobjectControllerTarget = this.controllerTarget;
            //
            this.currentTool = this.mTool;
            //
            watcher.watch(editorData, "selectedObjects", this.onSelectedGameObjectChange, this);
            watcher.watch(mrsTool, "toolType", this.onToolTypeChange, this);
        }

        dispose()
        {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            editorData.mrsToolObject = null;
            //
            this.controllerTarget = null;
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            watcher.unwatch(editorData, "selectedObjects", this.onSelectedGameObjectChange, this);
            watcher.unwatch(mrsTool, "toolType", this.onToolTypeChange, this);

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
            switch (mrsTool.toolType)
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
                this.mrsToolObject.removeChild(this._currentTool.gameObject)
            }
            this._currentTool = value;
            if (this._currentTool)
            {
                this.mrsToolObject.addChild(this._currentTool.gameObject);
            }
        }
    }
}