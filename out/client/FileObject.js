var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * Created by 黑暗之神KDS on 2017/2/17.
         */
        /**
         * 文件对象
         * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
         * -- 其他端支持绝对路径
         * Created by kds on 2017/1/21 0021.
         */
        var FileObject = (function () {
            // /**
            //  * 判断文件名是否合法
            //  * @param fileName 文件名
            //  */
            // static isLegalName(fileName: string): boolean;
            // /**
            //  * 构造函数
            //  *  -- 当存在path且isGetFileInfo==true的时候会自动探索基本信息
            //  *       -- 是否存在
            //  *       -- 文件大小
            //  *       -- 创建日期
            //  *       -- 最近一次的修改日期
            //  * @param path 路径 文件夹 kds\\test  文件 kds\\test\\file.js
            //  * @param onComplete 探查该文件完毕后的回调 onComplete([object FileObject])
            //  * @param thisPtr 执行域
            //  * @param onError 当错误时返回 onError([object FileObject])
            //  * @param isGetFileInfo 初始就获取下该文件的基本信息
            //  */
            function FileObject(path, onComplete, thisPtr, onError, isGetFileInfo) {
                if (path === void 0) { path = ""; }
                if (onComplete === void 0) { onComplete = null; }
                if (thisPtr === void 0) { thisPtr = null; }
                if (onError === void 0) { onError = null; }
                if (isGetFileInfo === void 0) { isGetFileInfo = true; }
                var _this = this;
                var sp = this;
                editor.file.stat(path, function (err, info) {
                    console.log(sp, _this, path, err, info);
                });
            }
            return FileObject;
        }());
        editor.FileObject = FileObject;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=FileObject.js.map