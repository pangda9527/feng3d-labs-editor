namespace feng3d.editor
{
    export class ColorPicker extends eui.Component implements eui.UIComponent
    {
        public picker: eui.Rect;

        get value()
        {
            if (this.picker)
                this._value.fromUnit(this.picker.fillColor);
            return this._value;
        }
        set value(v)
        {
            this._value.fromUnit(v.toInt());
            if (this.picker)
                this.picker.fillColor = this._value.toInt();
        }
        private _value = new Color();

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ColorPicker";
        }

        private onComplete()
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
            this.picker.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }

        private onRemovedFromStage()
        {
            this.picker.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }

        private onClick()
        {
            var c = document.getElementById("color");
            (<any>c).value = this.value.toHexString();
            c.click();
            c.onchange = () =>
            {
                var v = (<any>c).value;//"#189a56"
                this.value = new Color().fromUnit(Number("0x" + v.substr(1)));
                c.onchange = null;
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }
    }
}