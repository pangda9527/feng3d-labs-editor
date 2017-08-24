var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 拖拽源
         * @author feng		2017-01-22
         */
        var DragSource = (function () {
            function DragSource() {
                /**
                 * 数据拥有者
                 */
                this.dataHolder = {};
                /**
                 * 格式处理函数列表
                 */
                this.formatHandlers = {};
                /**
                 * 格式列表
                 */
                this._formats = [];
            }
            Object.defineProperty(DragSource.prototype, "formats", {
                /**
                 * 格式列表
                 */
                get: function () {
                    return this._formats;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 添加数据
             * @param data			数据
             * @param format		数据格式
             */
            DragSource.prototype.addData = function (data, format) {
                this._formats.push(data);
                this.dataHolder[format] = data;
            };
            /**
             * 添加处理函数
             * @param handler
             * @param format
             */
            DragSource.prototype.addHandler = function (handler, format) {
                this._formats.push(format);
                this.formatHandlers[format] = handler;
            };
            /**
             * 根据格式获取数据
             * @param format		格式
             * @return 				拥有的数据或者处理回调函数
             */
            DragSource.prototype.dataForFormat = function (format) {
                var data = this.dataHolder[format];
                if (data)
                    return data;
                if (this.formatHandlers[format])
                    return this.formatHandlers[format]();
                return null;
            };
            /**
             * 判断是否支持指定格式
             * @param format			格式
             * @return
             */
            DragSource.prototype.hasFormat = function (format) {
                var n = this._formats.length;
                for (var i = 0; i < n; i++) {
                    if (this._formats[i] == format)
                        return true;
                }
                return false;
            };
            return DragSource;
        }());
        editor.DragSource = DragSource;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=DragSource.js.map