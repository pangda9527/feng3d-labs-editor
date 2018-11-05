namespace editor
{
    export var minMaxCurveEditor: MinMaxCurveEditor;

    export class MinMaxCurveEditor extends eui.Component
    {
        @feng3d.watch("_onMinMaxCurveChanged")
        minMaxCurve = new feng3d.MinMaxCurve();

        public curveGroup: eui.Group;
        public curveImage: eui.Image;

        constructor()
        {
            super();
            this.skinName = "MinMaxCurveEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.updateView();

            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        }

        $onRemoveFromStage()
        {
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
            {
                var animationCurve = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                var imagedata = feng3d.imageUtil.createAnimationCurveRect(animationCurve, this.minMaxCurve.between0And1, this.curveGroup.width - 2, this.curveGroup.height - 2, new feng3d.Color3(1, 0, 0), new feng3d.Color3().fromUnit(0x565656));
                this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
            {
                var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                var imagedata = feng3d.imageUtil.createMinMaxCurveRandomBetweenTwoCurvesRect(minMaxCurveRandomBetweenTwoCurves, this.minMaxCurve.between0And1, this.curveGroup.width - 2, this.curveGroup.height - 2, new feng3d.Color3(1, 0, 0), new feng3d.Color3().fromUnit(0x565656));
                this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
            }
        }

        private _onMinMaxCurveChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }
}