module feng3d {

	/**
	 * 对象属性界面接口
	 * @author feng 2016-3-10
	 */
	export interface IObjectAttributeView {
		/**
		 * 界面所属对象（空间）
		 */
		space: Object;

		/**
		 * 更新界面
		 */
		updateView(): void;

		/**
		 * 属性名称
		 */
		attributeName: string;

		/**
		 * 属性值
		 */
		attributeValue: Object;
	}
}
