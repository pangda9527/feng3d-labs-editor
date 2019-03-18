/**
 * 粒子特效控制器
 */
export declare class ParticleEffectController extends eui.Component {
    pauseBtn: eui.Button;
    stopBtn: eui.Button;
    speedInput: eui.TextInput;
    timeInput: eui.TextInput;
    particlesInput: eui.TextInput;
    private saveParent;
    private particleSystems;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private onClick;
    private onEnterFrame;
    private initView;
    private updateView;
    private readonly isParticlePlaying;
    private onDataChange;
}
//# sourceMappingURL=ParticleEffectController.d.ts.map