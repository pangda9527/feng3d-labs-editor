module feng3d {

	/**
	 * 对象信息
	 * @author feng 2016-3-29
	 */
	export interface ObjectViewInfo {
		/**
		 * 类名
		 */
		name: string;

		/**
		 * 组件
		 */
		component: string;

		/**
		 * 组件参数
		 */
		componentParam: Object;

		/**
		 * 对象属性列表
		 */
		objectAttributeInfos: AttributeViewInfo[];

		/**
		 * 对象块信息列表
		 */
		objectBlockInfos: BlockViewInfo[];

		/**
		 * 保存类的一个实例，为了能够获取动态属性信息
		 */
		owner: Object;
	}
}
