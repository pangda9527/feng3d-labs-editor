namespace editor
{
    @feng3d.OAVComponent()
    export class OAVGameObjectName extends OAVBase
    {
        public nameInput: eui.TextInput;
        public visibleCB: eui.CheckBox;
        public mouseEnabledCB: eui.CheckBox;

        //
        space: feng3d.GameObject;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVGameObjectName";
        }

        initView()
        {
            this.visibleCB.addEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.addEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);

            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        dispose()
        {
            this.visibleCB.removeEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.removeEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);

            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        updateView()
        {
            this.visibleCB.selected = this.space.visible;
            this.mouseEnabledCB.selected = this.space.mouseEnabled;
            this.nameInput.text = this.space.name;
        }

        private onVisibleCBClick()
        {
            this.space.visible = !this.space.visible;
        }

        private onMouseEnabledCBClick()
        {
            this.space.mouseEnabled = !this.space.mouseEnabled;
        }

        private _textfocusintxt: boolean;
        private ontxtfocusin()
        {
            this._textfocusintxt = true;
        }

        private ontxtfocusout()
        {
            this._textfocusintxt = false;
        }

        private onTextChange()
        {
            if (this._textfocusintxt)
            {
                this.space.name = this.nameInput.text;
            }
        }
    }
}