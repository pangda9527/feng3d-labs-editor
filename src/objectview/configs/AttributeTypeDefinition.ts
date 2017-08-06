module feng3d {
	/**
	 * 定义特定属性类型默认界面
	 * @author feng 2016-3-25
	 */
	export interface AttributeTypeDefinition {
		/**
		 * 属性类型
		 */
		type: string;
		/**
		 * 界面类
		 */
		component: string;
		/**
		 * 组件参数
		 */
		componentParam?: Object;
	}
}
