namespace eui
{
    export interface Component
    {
        addBinder(...binders: UIBinder[]): void;
    }
}

eui.Component.prototype["addBinder"] = function (...binders: UIBinder[])
{
    this._binders = this._binders || [];
    binders.forEach(v =>
    {
        this._binders.push(v);
    });
}

var old$onRemoveFromStage = eui.Component.prototype.$onRemoveFromStage;
eui.Component.prototype["$onRemoveFromStage"] = function ()
{
    if (this._binders)
    {
        this._binders.forEach(v => v.dispose());
        this._binders.length = 0;
    }
    old$onRemoveFromStage.call(this);
};

export interface UIBinder
{
    init(v: Partial<this>): this;
    dispose(): void;
}