module feng3d {
	/**
	 * ObjectView类配置
	 * @author feng 2016-3-23
	 */
	export interface ClassDefinition {
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
		 * 自定义对象属性定义字典（key:属性名,value:属性定义）
		 */
		attributeDefinitionVec: AttributeDefinition[];

		/**
		 * 自定义对象属性块界面类定义字典（key:属性块名称,value:自定义对象属性块界面类定义）
		 */
		blockDefinitionVec: BlockDefinition[];
	}
}
