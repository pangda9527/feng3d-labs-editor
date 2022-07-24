
export class MinMaxCurveVector3View extends eui.Component
{
    @feng3d.watch("_onMinMaxCurveVector3Changed")
    minMaxCurveVector3 = new feng3d.MinMaxCurveVector3();

    public xMinMaxCurveView: editor.MinMaxCurveView;
    public yMinMaxCurveView: editor.MinMaxCurveView;
    public zMinMaxCurveView: editor.MinMaxCurveView;

    constructor()
    {
        super();
        this.skinName = "MinMaxCurveVector3View";
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel);

        this.xMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
        this.yMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
        this.zMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);

    }

    $onRemoveFromStage()
    {
        this.xMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
        this.yMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
        this.zMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);

        super.$onRemoveFromStage()
    }

    updateView()
    {
        if (!this.stage) return;

        this.xMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.xCurve;
        this.yMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.yCurve;
        this.zMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.zCurve;
    }

    private _onMinMaxCurveVector3Changed()
    {
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
    }

    private _onchanged()
    {
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    }
}
