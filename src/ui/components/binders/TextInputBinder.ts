namespace eui
{
    export interface Component
    {
        addBinder(...binders: editor.UIBinder[]): void;
    }

    eui.Component.prototype["addBinder"] = function (...binders: editor.UIBinder[])
    {
        this._binders = this._binders || [];
        binders.forEach(v =>
        {
            this._binders.push(v);
        });
    }

    var old$onRemoveFromStage = eui.Component.prototype.$onRemoveFromStage;
    eui.Component.prototype["$onRemoveFromStage"] = function ()
    {
        if (this._binders)
        {
            this._binders.forEach(v => v.dispose());
            this._binders.length = 0;
        }
        old$onRemoveFromStage.call(this);
    };
}

namespace editor
{
    export interface UIBinder
    {
        init(v: Partial<this>): this;
        dispose(): void;
    }

    export class TextInputBinder implements UIBinder
    {
        space: any;

        /**
         * 绑定属性名称
         */
        attribute: string;

        textInput: eui.TextInput;

        /**
         * 是否可编辑
         */
        editable = true;

        /**
         * 绑定属性值转换为文本
         */
        toText = (v) => v;

        /**
         * 文本转换为绑定属性值
         */
        toValue = (v) => v;

        get attributeValue(): any
        {
            return this.space[this.attribute];
        }

        set attributeValue(value: any)
        {
            if (this.space[this.attribute] != value)
            {
                this.space[this.attribute] = value;
                var objectViewEvent = <any>new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                objectViewEvent.space = this.space;
                objectViewEvent.attributeName = this.attribute;
                objectViewEvent.attributeValue = this.attributeValue;
                this.textInput.dispatchEvent(objectViewEvent);
            }
            this.updateView();
        }

        init(v: Partial<this>)
        {
            feng3d.serialization.setValue(this, <any>v);

            //
            this.initView();
            this.updateView();
            //
            return this;
        }

        dispose()
        {
            feng3d.watcher.unwatch(this.space, this.attribute, this.updateView, this);

            //
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.textInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        protected initView()
        {
            //
            feng3d.watcher.watch(this.space, this.attribute, this.updateView, this);
            if (this.editable)
            {
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.textInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            this.textInput.enabled = this.editable;
        }

        protected updateView()
        {
            if (!this._textfocusintxt)
            {
                this.textInput.text = this.toText.call(this, this.attributeValue);
            }
        }

        private onTextChange()
        {
            this.attributeValue = this.toValue.call(this, this.textInput.text);
        }

        private _textfocusintxt: boolean;
        protected ontxtfocusin()
        {
            this._textfocusintxt = true;
        }

        protected ontxtfocusout()
        {
            this._textfocusintxt = false;
            this.updateView();
        }
    }
}