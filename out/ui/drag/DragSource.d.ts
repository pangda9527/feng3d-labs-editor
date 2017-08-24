declare namespace feng3d.editor {
    /**
     * 拖拽源
     * @author feng		2017-01-22
     */
    class DragSource {
        /**
         * 数据拥有者
         */
        private dataHolder;
        /**
         * 格式处理函数列表
         */
        private formatHandlers;
        /**
         * 格式列表
         */
        private _formats;
        /**
         * 格式列表
         */
        readonly formats: any[];
        /**
         * 添加数据
         * @param data			数据
         * @param format		数据格式
         */
        addData(data: Object, format: string | number): void;
        /**
         * 添加处理函数
         * @param handler
         * @param format
         */
        addHandler(handler: Function, format: string | number): void;
        /**
         * 根据格式获取数据
         * @param format		格式
         * @return 				拥有的数据或者处理回调函数
         */
        dataForFormat(format: string | number): any;
        /**
         * 判断是否支持指定格式
         * @param format			格式
         * @return
         */
        hasFormat(format: string | number): boolean;
    }
}
