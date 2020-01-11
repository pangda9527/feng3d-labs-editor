namespace editor
{
	/**
	 * 默认对象属性界面
	 */
	@feng3d.OAVComponent()
	export class OAVNumber extends OAVBase
	{
		public labelLab: eui.Label;
		public text: eui.TextInput;

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

			this.skinName = "OAVNumber";
		}

		initView()
		{
			super.initView();

			this.addBinder(new NumberTextInputBinder().init({
				space: this.space, attribute: this._attributeName, textInput: this.text, editable: this._attributeViewInfo.editable,
				controller: this.labelLab, step: this.step, stepDownup: this.stepDownup, stepScale: this.stepScale, minValue: this.minValue, maxValue: this.maxValue,
			}));
		}
	}
}