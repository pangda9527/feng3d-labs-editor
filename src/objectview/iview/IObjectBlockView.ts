module feng3d {

	/**
	 * 对象属性块界面接口
	 * @author feng 2016-3-22
	 */
	export interface IObjectBlockView {
		/**
		 * 界面所属对象（空间）
		 */
		space: Object;

		/**
		 * 更新界面
		 */
		updateView(): void;

		/**
		 * 块名称
		 */
		blockName: string;

		/**
		 * 获取属性界面
		 * @param attributeName		属性名称
		 */
		getAttributeView(attributeName: string): IObjectAttributeView;
	}
}
