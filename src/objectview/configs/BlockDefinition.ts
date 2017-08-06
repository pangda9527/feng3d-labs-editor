module feng3d {
	/**
	 * 块定义
	 * @author feng 2016-3-23
	 */
	export interface BlockDefinition {
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
	}
}
