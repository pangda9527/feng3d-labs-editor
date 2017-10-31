module feng3d.editor
{
    @OAVComponent()
    export class OAVArray extends eui.Component implements IObjectAttributeView
    {
        private _space: Object;
        private _attributeName: string;
        private _attributeType: string;
        private attributeViewInfo: AttributeViewInfo;
        private isInitView: boolean;

        public group: eui.Group;
        public titleGroup: eui.Group;
        public titleButton: eui.Rect;
        public contentGroup: eui.Group;
        public sizeTxt: eui.TextInput;

        private attributeViews: eui.Component[];

        constructor(attributeViewInfo: AttributeViewInfo)
        {
            super();
            this._space = attributeViewInfo.owner;
            this._attributeName = attributeViewInfo.name;
            this._attributeType = attributeViewInfo.type;
            this.attributeViewInfo = attributeViewInfo;

            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "OAVArray";
        }

        private onComplete()
        {
            this.$updateView();
        }

        get space(): Object
        {
            return this._space;
        }

        set space(value: Object)
        {
            this._space = value;
            this.updateView();
        }

        get attributeName(): string
        {
            return this._attributeName;
        }

        get attributeValue(): any[]
        {
            return this._space[this._attributeName];
        }

        set attributeValue(value: any[])
        {
            if (this._space[this._attributeName] != value)
            {
                this._space[this._attributeName] = value;
            }
            this.updateView();
        }

        /**
		 * 更新自身界面
		 */
        private $updateView(): void
        {
            if (!this.isInitView)
            {
                this.initView();
            }
        }

        private initView(): void
        {
            this.attributeViews = [];
            var attributeValue = this.attributeValue;
            this.sizeTxt.text = this.attributeValue.length.toString();
            for (var i = 0; i < attributeValue.length; i++)
            {
                var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
                displayObject.percentWidth = 100;
                this.contentGroup.addChild(displayObject);
                this.attributeViews[i] = <any>displayObject;
            }

            this.currentState = "hide";
            this.isInitView = true;
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.titleButton.addEventListener(MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()
            this.titleButton.removeEventListener(MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
        }

		/**
		 * 更新界面
		 */
        updateView(): void
        {
            this.$updateView();
        }

        private onTitleButtonClick()
        {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        }

        private onsizeTxtfocusout()
        {
            var size = parseInt(this.sizeTxt.text);
            var attributeValue = this.attributeValue;
            var attributeViews = this.attributeViews;
            if (size != attributeValue.length)
            {
                attributeValue.length = size;
                for (var i = 0; i < attributeViews.length; i++)
                {
                    if (attributeViews[i].parent)
                    {
                        attributeViews[i].parent.removeChild(attributeViews[i]);
                    }
                }

                for (var i = 0; i < attributeValue.length; i++)
                {
                    if (attributeViews[i] == null)
                    {
                        var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
                        attributeViews[i] = displayObject;

                        displayObject.percentWidth = 100;
                    }
                    this.contentGroup.addChild(attributeViews[i]);
                }
            }
        }
    }

    export class OAVArrayItem extends OAVDefault
    {
        constructor(arr: any[], index: number, componentParam: Object)
        {
            var attributeViewInfo: AttributeViewInfo = <any>{
                name: index,
                writable: true,
                componentParam: componentParam,
                owner: arr,
            };
            super(attributeViewInfo);
        }

        protected onComplete()
        {
            super.onComplete();
            this.label.width = 60;
        }
    }
}