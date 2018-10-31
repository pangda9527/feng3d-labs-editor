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

        }

        private onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onMinMaxCurveChanged()
        {
            if (this.stage) this.updateView();
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