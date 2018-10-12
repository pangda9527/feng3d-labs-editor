namespace editor
{
    export class GradientEditor extends eui.Component
    {
        @feng3d.watch("_onGradientChanged")
        gradient = new feng3d.Gradient();

        public modeCB: ComboBox;
        public alphaLineGroup: eui.Group;
        public colorImage: eui.Image;
        public colorLineGroup: eui.Group;
        public colorGroup: eui.Group;
        public colorRect: eui.Rect;
        public alphaGroup: eui.Group;
        public alphaLabel: eui.Label;
        public alphaSlide: eui.HSlider;
        public alphaInput: eui.TextInput;
        public locationLabel: eui.Label;
        public locationInput: eui.TextInput;

        public constructor()
        {
            super();
            this.skinName = "GradientEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        }

        $onRemoveFromStage()
        {
            this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

            var list = [];
            for (const key in feng3d.GradientMode)
            {
                if (isNaN(Number(key)))
                    list.push({ label: key, value: feng3d.GradientMode[key] });
            }
            this.modeCB.dataProvider = list;
            this.modeCB.data = list.filter(v => v.value == this.gradient.mode)[0];
            //
            if (this.colorImage.width > 0 && this.colorImage.height > 0)
            {
                var imagedata = feng3d.imageUtil.createMinMaxGradientRect(this.gradient, this.colorImage.width, this.colorImage.height);
                this.colorImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
            }
            //

        }

        private _onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onModeCBChange()
        {
            this.gradient.mode = this.modeCB.data.value;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

        private _onGradientChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }
    export var gradientEditor: GradientEditor;
}