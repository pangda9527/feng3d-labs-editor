
/**
 * 快捷键设置界面
 */
export class ShortCutSetting extends eui.Component
{
    static moduleName = "ShortCutSetting";

    public searchTxt: eui.TextInput;
    public list: eui.List;

    moduleName: string;

    constructor()
    {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "ShortCutSetting";
        this.moduleName = ShortCutSetting.moduleName;
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
        this.searchTxt.addEventListener(egret.Event.CHANGE, this.updateView, this);
        this.updateView();
    }

    private onRemovedFromStage()
    {
        this.searchTxt.removeEventListener(egret.Event.CHANGE, this.updateView, this);
    }

    private updateView()
    {
        var text = this.searchTxt.text;
        var reg = new RegExp(text, "i");

        var data = shortcutConfig.filter(v =>
        {
            for (const key in v)
            {
                if (key.charAt(0) != "_")
                {
                    if (typeof v[key] == "string" && v[key].search(reg) != -1)
                        return true;
                }
            }
            return false;
        })
        this.list.dataProvider = new eui.ArrayCollection(data);
    }
}

Modules.moduleViewCls[ShortCutSetting.moduleName] = ShortCutSetting;
