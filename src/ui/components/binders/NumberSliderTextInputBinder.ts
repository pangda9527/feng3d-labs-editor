namespace editor
{
    export class NumberSliderTextInputBinder extends NumberTextInputBinder
    {
        slider: eui.HSlider;

        initView()
        {
            super.initView();
            if (this.editable)
            {
                this.slider.addEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
            }
            this.slider.enabled = this.slider.touchEnabled = this.slider.touchChildren = this.editable;
        }

        dispose()
        {
            super.dispose();

            this.slider.removeEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
        }

        protected updateView()
        {
            super.updateView();
            this.slider.minimum = isNaN(this.minValue) ? Number.MIN_VALUE : this.minValue;
            this.slider.maximum = isNaN(this.maxValue) ? Number.MAX_VALUE : this.maxValue;
            this.slider.snapInterval = this.step;
            this.slider.value = this.space[this.attribute];
        }

        private _onSliderChanged()
        {
            this.space[this.attribute] = this.slider.value;
        }
    }
}