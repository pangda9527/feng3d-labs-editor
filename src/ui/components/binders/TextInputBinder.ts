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

    export interface TextInputBinderEventMap
    {
        valueChanged
    }

    export interface TextInputBinder
    {
        once<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.IEvent<TextInputBinderEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        emit<K extends keyof TextInputBinderEventMap>(type: K, data?: TextInputBinderEventMap[K], bubbles?: boolean): feng3d.IEvent<TextInputBinderEventMap[K]>;
        has<K extends keyof TextInputBinderEventMap>(type: K): boolean;
        on<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.IEvent<TextInputBinderEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): void;
        off<K extends keyof TextInputBinderEventMap>(type?: K, listener?: (event: feng3d.IEvent<TextInputBinderEventMap[K]>) => any, thisObject?: any): void;
    }

    export class TextInputBinder extends feng3d.EventEmitter implements UIBinder
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
        toText(v: any)
        {
            return v;
        }

        /**
         * 文本转换为绑定属性值
         */
        toValue(v: any)
        {
            return v;
        }

        init(v: Partial<this>)
        {
            Object.assign(this, v);

            //
            this.initView();
            this.invalidateView();
            //
            return this;
        }

        dispose()
        {
            feng3d.watcher.unwatch(this.space, this.attribute, this.onValueChanged, this);

            //
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.textInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        protected initView()
        {
            //
            if (this.editable)
            {
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.textInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            feng3d.watcher.watch(this.space, this.attribute, this.onValueChanged, this);
            this.textInput.enabled = this.editable;
        }

        protected onValueChanged()
        {
            var objectViewEvent = <any>new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
            objectViewEvent.space = this.space;
            objectViewEvent.attributeName = this.attribute;
            objectViewEvent.attributeValue = this.space[this.attribute];
            this.textInput.dispatchEvent(objectViewEvent);

            this.emit("valueChanged");

            this.invalidateView();
        }

        protected updateView()
        {
            if (!this._textfocusintxt)
            {
                this.textInput.text = this.toText(this.space[this.attribute]);
            }
        }

        protected onTextChange()
        {
            this.space[this.attribute] = this.toValue(this.textInput.text);
        }

        private _textfocusintxt: boolean;
        protected ontxtfocusin()
        {
            this._textfocusintxt = true;
        }

        protected ontxtfocusout()
        {
            this._textfocusintxt = false;
            this.invalidateView();
        }

        protected invalidateView()
        {
            feng3d.ticker.nextframe(this.updateView, this);
        }
    }
}