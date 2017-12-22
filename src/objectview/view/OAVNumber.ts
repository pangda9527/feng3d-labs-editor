namespace feng3d.editor
{
	/**
	 * 默认对象属性界面
	 * @author feng 2016-3-10
	 */
	@OAVComponent()
	export class OAVNumber extends OAVDefault
	{
		fractionDigits = 3;

		attributeValue: number;

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			var pow = Math.pow(10, 3);
			var value = Math.round(this.attributeValue * pow) / pow;
			this.text.text = String(value);
		}
	}
}