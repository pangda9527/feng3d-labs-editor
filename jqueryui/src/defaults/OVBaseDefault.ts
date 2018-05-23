/**
 * 默认基础对象界面
 * @author feng 2016-3-11
 */
@feng3d.OVComponent()
class OVBaseDefault extends Element implements feng3d.IObjectView
{
    public label = document.createElement("label");
    public image = document.createElement("image");
    //
    private _space: Object;

    constructor(objectViewInfo: feng3d.ObjectViewInfo)
    {
        super();

        var dom = document.createAttribute

        this.dom.innerHTML = `<div><span>Type</span><span>source texture</span></div>`;
        this._space = objectViewInfo.owner;
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel)
        this.updateView();
    }

    get space(): Object
    {
        return this._space;
    }

    set space(value: Object)
    {
        this._space = value;
        this.updateView();
    }

    getAttributeView(attributeName: String)
    {
        return null;
    }

    getblockView(blockName: String)
    {
        return null;
    }

    /**
     * 更新界面
     */
    updateView(): void
    {
        this.image.visible = false;
        this.label.visible = true;
        var value = this._space;
        if (typeof value == "string" && value.indexOf("data:") == 0)
        {
            this.image.visible = true;
            this.label.visible = false;
            this.image.source = value;
        } else
        {
            var string = String(value);
            if (string.length > 1000)
                string = string.substr(0, 1000) + "\n......."
            this.label.text = string;
        }
    }
}