module feng3d {

	/**
	 * 对象属性块
	 * @author feng 2016-3-22
	 */
	export interface BlockViewInfo {
		/**
		 * 块名称
		 */
		name: string;

		/**
		 * 组件
		 */
		component?: string;

		/**
		 * 组件参数
		 */
		componentParam?: Object;

		/**
		 * 属性信息列表
		 */
		itemList: AttributeViewInfo[];

		/**
		 * 属性拥有者
		 */
		owner: Object;
	}
}
