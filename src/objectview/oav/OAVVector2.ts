import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { NumberTextInputBinder } from '../../ui/components/binders/NumberTextInputBinder';
import { OAVBase } from './OAVBase';

/**
 * Vector2属性界面
 */
@OAVComponent()
export class OAVVector2 extends OAVBase
{
    public labelLab: eui.Label;
    public xLabel: eui.Label;
    public xTextInput: eui.TextInput;
    public yLabel: eui.Label;
    public yTextInput: eui.TextInput;

    /**
     * 步长，精度
     */
    step = 0.001;

    /**
     * 键盘上下方向键步长
     */
    stepDownup = 10;

    /**
     * 移动一个像素时增加的步长数量
     */
    stepScale = 1;

    /**
     * 最小值
     */
    minValue = NaN;

    /**
     * 最小值
     */
    maxValue = NaN;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = "OAVVector2";
    }

    initView()
    {
        super.initView();

        this.addBinder(new NumberTextInputBinder().init({
            space: this.attributeValue, attribute: "x", textInput: this.xTextInput, editable: this._attributeViewInfo.editable,
            controller: this.xLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
        }));
        this.addBinder(new NumberTextInputBinder().init({
            space: this.attributeValue, attribute: "y", textInput: this.yTextInput, editable: this._attributeViewInfo.editable,
            controller: this.yLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
        }));
    }
}
