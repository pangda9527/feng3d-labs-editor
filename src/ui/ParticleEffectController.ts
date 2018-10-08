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
        private particleSystems: feng3d.ParticleSystem[] = [];
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
            this.updateView();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.pauseBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.stopBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }

        $onRemoveFromStage(): void
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.pauseBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.stopBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }

        private onClick(e: egret.Event)
        {
            switch (e.currentTarget)
            {
                case this.stopBtn:
                    this.particleSystems.forEach(v => v.stop());
                    break;
                case this.pauseBtn:
                    if (this.isParticlePlaying)
                        this.particleSystems.forEach(v => v.pause());
                    else
                        this.particleSystems.forEach(v => v.continue());
                    break;
            }
            this.updateView();
        }

        private onEnterFrame()
        {
            var v = this.particleSystems;
            if (v)
            {
                this.playbackSpeed = (this.particleSystems[0] && this.particleSystems[0].main.simulationSpeed) || 1;
                this.playbackTime = (this.particleSystems[0] && this.particleSystems[0].time) || 0;
                this.particles = this.particleSystems.reduce((pv, cv) => { pv += cv.numActiveParticles; return pv; }, 0);
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

        private updateView()
        {
            if (!this.particleSystems) return;
            this.pauseBtn.label = this.isParticlePlaying ? "Pause" : "Continue";
        }

        private get isParticlePlaying()
        {
            return this.particleSystems.reduce((pv, cv) => { return pv || cv.isPlaying; }, false)
        }

        private onDataChange()
        {
            var particleSystems = editorData.selectedGameObjects.reduce((pv: feng3d.ParticleSystem[], cv) => { var ps = cv.getComponent(feng3d.ParticleSystem); ps && (pv.push(ps)); return pv; }, []);
            this.particleSystems.forEach(v =>
            {
                v.pause()
                v.off("particleCompleted", this.updateView, this);
            });
            this.particleSystems = particleSystems;
            this.particleSystems.forEach(v =>
            {
                v.continue()
                v.on("particleCompleted", this.updateView, this);
            });
            if (this.particleSystems.length > 0) this.saveParent.addChild(this);
            else this.parent && this.parent.removeChild(this);
        }
    }
}