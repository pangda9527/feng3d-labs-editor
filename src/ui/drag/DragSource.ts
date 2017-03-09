module feng3d.editor
{

	/**
	 * 拖拽源
	 * @author feng		2017-01-22
	 */
	export class DragSource
	{
		/**
		 * 数据拥有者
		 */
		private dataHolder = {};

		/**
		 * 格式处理函数列表
		 */
		private formatHandlers = {};

		/**
		 * 格式列表
		 */
		private _formats = [];

		/**
		 * 格式列表
		 */
		public get formats()
		{
			return this._formats;
		}

		/**
		 * 添加数据
		 * @param data			数据
		 * @param format		数据格式
		 */
		public addData(data: Object, format: string): void
		{
			this._formats.push(data);
			this.dataHolder[format] = data;
		}

		/**
		 * 添加处理函数
		 * @param handler
		 * @param format
		 */
		public addHandler(handler: Function, format: string): void
		{
			this._formats.push(format);
			this.formatHandlers[format] = handler;
		}

		/**
		 * 根据格式获取数据
		 * @param format		格式
		 * @return 				拥有的数据或者处理回调函数
		 */
		public dataForFormat(format: string): Object
		{
			var data: Object = this.dataHolder[format];
			if (data)
				return data;
			if (this.formatHandlers[format])
				return this.formatHandlers[format]();
			return null;
		}

		/**
		 * 判断是否支持指定格式
		 * @param format			格式
		 * @return
		 */
		public hasFormat(format: string):boolean
		{
			var n = this._formats.length;
			for (var i = 0; i < n; i++)
			{
				if (this._formats[i] == format)
					return true;
			}
			return false;
		}
	}
}
