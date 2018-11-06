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
            this.curveGroup.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {

            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);

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
                var imageData = feng3d.imageUtil.createImageData(this.curveGroup.width - 2, this.curveGroup.height - 2, feng3d.Color4.fromUnit(0xff565656));
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
                {
                    var animationCurve = <feng3d.AnimationCurve>this.minMaxCurve.minMaxCurve;
                    feng3d.imageUtil.drawImageDataCurve(imageData, animationCurve, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
                {
                    var minMaxCurveRandomBetweenTwoCurves = <feng3d.MinMaxCurveRandomBetweenTwoCurves>this.minMaxCurve.minMaxCurve;
                    feng3d.imageUtil.drawImageDataBetweenTwoCurves(imageData, minMaxCurveRandomBetweenTwoCurves, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                this.curveImage.source = feng3d.dataTransform.imageDataToDataURL(imageData);
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
                case this.curveGroup:
                    minMaxCurveEditor = minMaxCurveEditor || new editor.MinMaxCurveEditor();
                    minMaxCurveEditor.minMaxCurve = this.minMaxCurve;

                    var pos = this.localToGlobal(0, 0);
                    pos.x = pos.x - 318;
                    minMaxCurveEditor.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    //
                    popupview.popupView(minMaxCurveEditor, () =>
                    {
                        minMaxCurveEditor.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    }, pos.x, pos.y);
                    break;
            }
        }

        private onPickerViewChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);

            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    }
}