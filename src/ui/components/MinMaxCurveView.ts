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
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {

            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);

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

                this.addBinder(new NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.constantTextInput, editable: true,
                    controller: null,
                }));
            } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants)
            {
                this.randomBetweenTwoConstantsGroup.visible = true;

                this.addBinder(new NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.minValueTextInput, editable: true,
                    controller: null,
                }));
                this.addBinder(new NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant1", textInput: this.maxValueTextInput, editable: true,
                    controller: null,
                }));
            } else
            {
                this.curveGroup.visible = true;
                var imageUtil = new feng3d.ImageUtil(this.curveGroup.width - 2, this.curveGroup.height - 2, feng3d.Color4.fromUnit(0xff565656));
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve)
                {
                    imageUtil.drawCurve(this.minMaxCurve.curve, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                } else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves)
                {
                    imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curve1, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                this.curveImage.source = imageUtil.toDataURL();
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
                    });
                    break;
                case this.curveGroup:
                    minMaxCurveEditor = minMaxCurveEditor || new editor.MinMaxCurveEditor();
                    minMaxCurveEditor.minMaxCurve = this.minMaxCurve;

                    var pos = this.localToGlobal(0, 0);
                    pos.x = pos.x - 318;
                    minMaxCurveEditor.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    //
                    popupview.popupView(minMaxCurveEditor, {
                        x: pos.x, y: pos.y, closecallback: () =>
                        {
                            minMaxCurveEditor.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                        }
                    });
                    break;
            }
        }

        private onPickerViewChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);

            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

        private _onRightClick()
        {
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant || this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants)
                return;

            var menus: MenuItem[] = [{
                label: "Copy", click: () =>
                {
                    copyCurve = Object.deepClone(this.minMaxCurve);
                }
            }];
            if (copyCurve && this.minMaxCurve.mode == copyCurve.mode && copyCurve.between0And1 == this.minMaxCurve.between0And1)
            {
                menus.push({
                    label: "Paste", click: () =>
                    {
                        Object.setValue(this.minMaxCurve, copyCurve);

                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            menu.popup(menus)
        }
    }

    var copyCurve: feng3d.MinMaxCurve;
}