namespace editor
{
    /**
     * 最大最小曲线界面
     */
    export class MinMaxCurveView extends eui.Component
    {
        @feng3d.watch("_onMinMaxCurveChanged")
        minMaxCurve = new feng3d.MinMaxCurve();

        public constantGroup: eui.Group;
        public constantTextInput: eui.TextInput;
        public curveGroup: eui.Group;
        public curveImage: eui.Image;
        public randomBetweenTwoConstantsGroup: eui.Group;
        public minValueTextInput: eui.TextInput;
        public maxValueTextInput: eui.TextInput;
        public modeBtn: eui.Button;

        constructor()
        {
            super();
            this.skinName = "MinMaxCurveView";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {

            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            this.constantGroup.visible = false;
            this.curveGroup.visible = false;
            this.randomBetweenTwoConstantsGroup.visible = false;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant)
            {
                this.constantGroup.visible = true;

                var minMaxCurveConstant = <feng3d.MinMaxCurveConstant>this.minMaxCurve.minMaxCurve;
                this.addBinder(new NumberTextInputBinder().init({
                    space: minMaxCurveConstant, attribute: "value", textInput: this.constantTextInput, editable: true,
                    controller: null,
                }));
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants)
            {
                this.randomBetweenTwoConstantsGroup.visible = true;

                var minMaxCurveRandomBetweenTwoConstants = <feng3d.MinMaxCurveRandomBetweenTwoConstants>this.minMaxCurve.minMaxCurve;
                this.addBinder(new NumberTextInputBinder().init({
                    space: minMaxCurveRandomBetweenTwoConstants, attribute: "minValue", textInput: this.minValueTextInput, editable: true,
                    controller: null,
                }));
                this.addBinder(new NumberTextInputBinder().init({
                    space: minMaxCurveRandomBetweenTwoConstants, attribute: "maxValue", textInput: this.maxValueTextInput, editable: true,
                    controller: null,
                }));
            } else
            {
                this.curveGroup.visible = true;
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
                {
                    var animationCurve = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                    var imagedata = feng3d.imageUtil.createAnimationCurveRect(animationCurve, this.curveGroup.width - 2, this.curveGroup.height - 2, new feng3d.Color3(1, 0, 0), new feng3d.Color3().fromUnit(0x565656));
                    this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
                {
                    var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                    var imagedata = feng3d.imageUtil.createMinMaxCurveRandomBetweenTwoCurvesRect(minMaxCurveRandomBetweenTwoCurves, this.curveGroup.width - 2, this.curveGroup.height - 2, new feng3d.Color3(1, 0, 0), new feng3d.Color3().fromUnit(0x565656));
                    this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                }
            }
        }

        private onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onMinMaxCurveChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private onClick(e: egret.MouseEvent)
        {
            switch (e.currentTarget)
            {
                case this.modeBtn:
                    menu.popupEnum(feng3d.MinMaxCurveMode, this.minMaxCurve.mode, (v) =>
                    {
                        this.minMaxCurve.mode = v;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    }, { width: 210 });
                    break;
            }
        }
    }
}