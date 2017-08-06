module feng3d {

	/**
	 * 排序比较函数
	 * @author feng 2016-3-29
	 */
	export class SortCompare {
		/**
		 * 比较字符串
		 * @param a
		 * @param b
		 * @return
		 */
		public static stringCompare(a: string, b: string): number {
			var index = 0;
			var len = Math.min(a.length, b.length);
			for (var i = 0; i < len; i++) {
				if (a.charCodeAt(i) != b.charCodeAt(i))
					return a.charCodeAt(i) - b.charCodeAt(i);
			}
			if (a.length != b.length)
				return a.length - b.length;

			return 0;
		}
	}
}
