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

        attribute: string;

        textInput: eui.TextInput;

        init(v: Partial<this>)
        {
            feng3d.serialization.setValue(this, <any>v);

            feng3d.watcher.watch(this.space, this.attribute, this.updateView, this);
            this.textInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            return this;
        }

        dispose()
        {
            feng3d.watcher.unwatch(this.space, this.attribute, this.updateView, this);
            this.textInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        private updateView()
        {
            this.textInput.text = this.space[this.attribute];
        }

        private onTextChange()
        {
            this.space[this.attribute] = this.textInput.text
        }
    }
}