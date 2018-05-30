namespace editor
{
    export class OAVBase extends eui.Component implements feng3d.IObjectAttributeView
    {
        protected _space: any;
        protected _attributeName: string;
        protected _attributeType: string;
        protected attributeViewInfo: feng3d.AttributeViewInfo;
        //
        label: eui.Label;

        /**
         * 对象属性界面
         */
        objectView: feng3d.IObjectView;
        /**
         * 对象属性块界面
         */
        objectBlockView: feng3d.IObjectBlockView;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super();
            this._space = attributeViewInfo.owner;
            this._attributeName = attributeViewInfo.name;
            this._attributeType = attributeViewInfo.type;
            this.attributeViewInfo = attributeViewInfo;
        }

        get space(): any
        {
            return this._space;
        }

        set space(value: any)
        {
            this._space = value;
            this.dispose();
            this.initView();
            this.updateView();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            var componentParam = this.attributeViewInfo.componentParam;
            if (componentParam)
            {
                for (var key in componentParam)
                {
                    if (this.hasOwnProperty(key))
                    {
                        this[key] = componentParam[key];
                    }
                }
            }
            if (this.label)
            {
                if (componentParam && componentParam.label)
                    this.label.text = componentParam.label;
                else
                    this.label.text = this._attributeName;
            }

            this.initView();
            this.updateView();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()
            this.dispose();
        }

        /**
         * 初始化
         */
        initView()
        {

        }

        /**
         * 销毁
         */
        dispose()
        {

        }

        /**
         * 更新
         */
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
                var objectViewEvent = <any>new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                objectViewEvent.space = this._space;
                objectViewEvent.attributeName = this._attributeName;
                objectViewEvent.attributeValue = this.attributeValue;
                this.dispatchEvent(objectViewEvent);
            }
            this.updateView();
        }
    }
}