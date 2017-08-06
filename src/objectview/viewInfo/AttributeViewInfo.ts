module feng3d {
	/**
	 * 对象属性信息
	 * @author feng 2016-3-10
	 */
	export class AttributeViewInfo {

		/**
		 * 属性名称
		 */
		name: string;

		/**
		 * 属性类型
		 */
		type: string;

		/**
		 * 是否可写
		 */
		writable: boolean;

		/**
		 * 所属块名称
		 */
		block: string;

		/**
		 * 组件
		 */
		component: string;

		/**
		 * 组件参数
		 */
		componentParam: Object;

		/**
		 * 属性所属对象
		 */
		owner: Object;
	}
}
