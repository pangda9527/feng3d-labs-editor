module feng3d {

	/**
	 * 对象界面接口
	 * @author feng 2016-3-11
	 */
	export interface IObjectView {
		/**
		 * 界面所属对象（空间）
		 */
		space: Object;

		/**
		 * 更新界面
		 */
		updateView(): void;

		/**
		 * 获取块界面
		 * @param blockName		块名称
		 */
		getblockView(blockName: string): IObjectBlockView;

		/**
		 * 获取属性界面
		 * @param attributeName		属性名称
		 */
		getAttributeView(attributeName: string): IObjectAttributeView;
	}
}
