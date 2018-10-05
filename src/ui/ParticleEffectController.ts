namespace editor
{
    /**
     * 粒子特效控制器
     */
    export class ParticleEffectController extends eui.Component
    {
        private saveParent: egret.DisplayObjectContainer;
        private particleSystem: feng3d.ParticleSystem;

        constructor()
        {
            super();
            this.skinName = "ParticleEffectController";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
        }

        private initView()
        {
            if (this.saveParent) return;
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(() =>
            {
                this.parent.removeChild(this);
            });
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
        }

        private onDataChange()
        {
            var selectedGameObjects = editorData.selectedGameObjects;
            if (selectedGameObjects.length > 0)
            {
                for (let i = 0; i < selectedGameObjects.length; i++)
                {
                    var particleSystem = selectedGameObjects[i].getComponent(feng3d.ParticleSystem);
                    if (particleSystem)
                    {
                        this.particleSystem = particleSystem;
                        this.saveParent.addChild(this);
                        return;
                    }
                }
            }
            this.particleSystem = null;
            this.parent && this.parent.removeChild(this);
        }
    }
}