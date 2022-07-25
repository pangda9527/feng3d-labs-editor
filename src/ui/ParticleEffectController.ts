import { ParticleSystem, globalEmitter } from 'feng3d';
import { EditorData } from '../global/EditorData';

/**
 * 粒子特效控制器
 */
export class ParticleEffectController extends eui.Component
{
    public pauseBtn: eui.Button;
    public stopBtn: eui.Button;
    public speedInput: eui.TextInput;
    public timeInput: eui.TextInput;
    public particlesInput: eui.TextInput;

    //
    private saveParent: egret.DisplayObjectContainer;
    private particleSystems: ParticleSystem[] = [];

    constructor()
    {
        super();
        this.skinName = 'ParticleEffectController';
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
                this.particleSystems.forEach((v) => v.stop());
                break;
            case this.pauseBtn:
                if (this.isParticlePlaying)
                    { this.particleSystems.forEach((v) => v.pause()); }
                else
                    { this.particleSystems.forEach((v) => v.continue()); }
                break;
        }
        this.updateView();
    }

    private onEnterFrame()
    {
        const v = this.particleSystems;
        if (v)
        {
            const playbackSpeed = (this.particleSystems[0] && this.particleSystems[0].main.simulationSpeed) || 1;
            const playbackTime = (this.particleSystems[0] && this.particleSystems[0].time) || 0;
            const particles = this.particleSystems.reduce((pv, cv) =>
{
 pv += cv.particleCount;

return pv;
}, 0);

            //
            this.speedInput.text = playbackSpeed.toString();
            this.timeInput.text = playbackTime.toFixed(3);
            this.particlesInput.text = particles.toString();
        }
    }

    private initView()
    {
        if (this.saveParent) return;
        this.saveParent = this.parent;
        globalEmitter.on('editor.selectedObjectsChanged', this.onDataChange, this);
        this.onDataChange();
    }

    private updateView()
    {
        if (!this.particleSystems) return;
        this.pauseBtn.label = this.isParticlePlaying ? 'Pause' : 'Continue';
    }

    private get isParticlePlaying()
    {
        return this.particleSystems.reduce((pv, cv) => pv || cv.isPlaying, false);
    }

    private onDataChange()
    {
        const particleSystems = EditorData.editorData.selectedGameObjects.reduce((pv: ParticleSystem[], cv) =>
{
 const ps = cv.getComponent(ParticleSystem); ps && (pv.push(ps));

return pv;
}, []);
        this.particleSystems.forEach((v) =>
        {
            v.pause();
            v.off('particleCompleted', this.updateView, this);
        });
        this.particleSystems = particleSystems;
        this.particleSystems.forEach((v) =>
        {
            v.continue();
            v.on('particleCompleted', this.updateView, this);
        });
        if (this.particleSystems.length > 0) this.saveParent.addChild(this);
        else this.parent && this.parent.removeChild(this);
    }
}

globalEmitter.once('editor.selectedObjectsChanged', () =>
{
    globalEmitter.emit('editor.addSceneToolView', new ParticleEffectController());
});
