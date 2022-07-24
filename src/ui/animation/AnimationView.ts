
/**
 * 动画面板
 */
export class AnimationView extends eui.Component implements ModuleView
{
    static moduleName = "Animation";

    moduleName: string;

    constructor()
    {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "AnimationView";
        this.moduleName = AnimationView.moduleName;
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

        //
        this.updateView();
    }

    private onRemovedFromStage()
    {

    }

    private updateView()
    {

    }

}

Modules.moduleViewCls[AnimationView.moduleName] = AnimationView;
