namespace feng3d.editor
{
    export class OAVBase extends eui.Component implements feng3d.IObjectAttributeView
    {
        protected _space: any;
        protected _attributeName: string;
        protected _attributeType: string;
        protected attributeViewInfo: AttributeViewInfo;
        //
        label: eui.Label;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super();
            this._space = attributeViewInfo.owner;
            this._attributeName = attributeViewInfo.name;
            this._attributeType = attributeViewInfo.type;
            this.attributeViewInfo = attributeViewInfo;

            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        }

        protected onComplete(): void
        {
            if (this.label)
                this.label.text = this._attributeName;
            this.updateView();
        }

        get space(): any
        {
            return this._space;
        }

        set space(value: any)
        {
            this._space = value;
            this.updateView();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            if (this.attributeViewInfo.componentParam)
            {
                for (var key in this.attributeViewInfo.componentParam)
                {
                    if (this.attributeViewInfo.componentParam.hasOwnProperty(key))
                    {
                        this[key] = this.attributeViewInfo.componentParam[key];
                    }
                }
            }
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()
        }

        updateView()
        {

        }

        get attributeName(): string
        {
            return this._attributeName;
        }

        get attributeValue(): any
        {
            return this._space[this._attributeName];
        }

        set attributeValue(value: any)
        {
            if (this._space[this._attributeName] != value)
            {
                this._space[this._attributeName] = value;
                var objectViewEvent = <any>new ObjectViewEvent(ObjectViewEvent.VALUE_CHANGE, true);
                objectViewEvent.space = this._space;
                objectViewEvent.attributeName = this._attributeName;
                objectViewEvent.attributeValue = this.attributeValue;
                this.dispatchEvent(objectViewEvent);
            }
        }
    }
}