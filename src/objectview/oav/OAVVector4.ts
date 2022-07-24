
/**
 * Vector4属性界面
 */
@feng3d.OAVComponent()
export class OAVVector4 extends OAVBase
{
    public labelLab: eui.Label;
    public group: eui.Group;
    public xLabel: eui.Label;
    public xTextInput: eui.TextInput;
    public yLabel: eui.Label;
    public yTextInput: eui.TextInput;
    public zLabel: eui.Label;
    public zTextInput: eui.TextInput;
    public wLabel: eui.Label;
    public wTextInput: eui.TextInput;

    /**
     * 步长，精度
     */
    step = 0.001;

    /**
     * 键盘上下方向键步长
     */
    stepDownup = 0.001;

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

    constructor(attributeViewInfo: feng3d.AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = "OAVVector4";
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
        this.addBinder(new NumberTextInputBinder().init({
            space: this.attributeValue, attribute: "z", textInput: this.zTextInput, editable: this._attributeViewInfo.editable,
            controller: this.zLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
        }));
        this.addBinder(new NumberTextInputBinder().init({
            space: this.attributeValue, attribute: "w", textInput: this.wTextInput, editable: this._attributeViewInfo.editable,
            controller: this.wLabel, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
        }));
    }
}
