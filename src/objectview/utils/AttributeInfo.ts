module feng3d {

	/**
	 * 属性信息
	 * @author feng 2016-3-28
	 */
	export class AttributeInfo {
		/**
		 * 属性名称
		 */
		public name: string;

		/**
		 * 属性类型
		 */
		public type: string;

		/**
		 * 是否可写
		 */
		public writable: boolean;

		/**
		 * 构建
		 */
		constructor(name = "", type = "", writable = true) {
			this.name = name;
			this.type = type;
			this.writable = writable;
		}

		/**
		 * 比较字符串
		 * @param a
		 * @param b
		 * @return
		 */
		public static compare(a: AttributeInfo, b: AttributeInfo): number {
			return SortCompare.stringCompare(a.name, b.name);
		}
	}
}
