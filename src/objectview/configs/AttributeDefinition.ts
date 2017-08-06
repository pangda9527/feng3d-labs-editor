module feng3d {
	/**
	 * 定义属性
	 * @author feng 2016-3-23
	 */
	export interface AttributeDefinition {
		/**
		 * 属性名称
		 */
		name: string;

		/**
		 * 所属块名称
		 */
		block?: string;

		/**
		 * 组件
		 */
		component?: string;

		/**
		 * 组件参数
		 */
		componentParam?: Object;
	}
}
