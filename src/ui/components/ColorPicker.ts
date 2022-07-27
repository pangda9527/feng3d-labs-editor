import { Color3, Color4 } from 'feng3d';
import { ColorPickerView } from './ColorPickerView';
import { popupview } from './Popupview';

export class ColorPicker extends eui.Component implements eui.UIComponent
{
    public picker: eui.Rect;

    get value()
    {
        return this._value;
    }
    set value(v)
    {
        this._value = v;
        if (this.picker)
        {
            if (this._value instanceof Color3)
            {
                this.picker.fillColor = this._value.toInt();
            }
            else
            {
                this.picker.fillColor = this._value.toColor3().toInt();
            }
        }
    }
    private _value: Color3 | Color4 = new Color3();

    constructor()
    {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = 'ColorPicker';
    }

    private onComplete()
    {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

        if (this.stage)
        {
            this.onAddedToStage();
        }
    }

    private onAddedToStage()
    {
        this.picker.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
    }

    private onRemovedFromStage()
    {
        this.picker.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
    }

    private onClick()
    {
        if (!ColorPickerView.colorPickerView) ColorPickerView.colorPickerView = new ColorPickerView();
        ColorPickerView.colorPickerView.color = this.value;
        const pos = this.localToGlobal(0, 0);
        // pos.x = pos.x - colorPickerView.width;
        pos.x = pos.x - 318;
        ColorPickerView.colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
        //
        popupview.popupView(ColorPickerView.colorPickerView, {
            x: pos.x, y: pos.y,
            closecallback: () =>
            {
                ColorPickerView.colorPickerView.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
            }
        });
    }

    private onPickerViewChanged()
    {
        this.value = ColorPickerView.colorPickerView.color;
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    }
}
