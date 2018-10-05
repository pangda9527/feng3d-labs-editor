namespace editor
{
    /**
     * 粒子特效控制器
     */
    export class ParticleEffectController extends eui.Component
    {
        public pauseBtn: eui.Button;
        public stopBtn: eui.Button;
        //
        private saveParent: egret.DisplayObjectContainer;
        private particleSystem: feng3d.ParticleSystem;
        //
        private playbackSpeed: number;
        private playbackTime: number;
        private particles: number;

        constructor()
        {
            super();
            this.skinName = "ParticleEffectController";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.initView();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }

        $onRemoveFromStage(): void
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }

        private onEnterFrame()
        {
            var v = this.particleSystem;
            if (v)
            {
                this.playbackSpeed = v.main.simulationSpeed;
                this.playbackTime = v.time;
                this.particles = v.main.maxParticles;
            }
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