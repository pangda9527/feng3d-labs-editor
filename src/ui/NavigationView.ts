import { Modules } from '../Modules';
import { ModuleView } from './components/TabView';

export class NavigationView extends eui.Component implements ModuleView
{
    moduleName: string;
    static moduleName = 'Navigation';

    constructor()
    {
        super();

        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = 'NavigationView';
        this.moduleName = NavigationView.moduleName;
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
    }

    private onRemovedFromStage()
    {
    }
}

Modules.moduleViewCls[NavigationView.moduleName] = NavigationView;
