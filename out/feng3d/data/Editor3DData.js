var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Editor3DData = (function () {
            function Editor3DData() {
                /**
                 * 项目根路径
                 */
                this.projectRoot = "editorproject";
                this.sceneData = new editor.SceneData();
                this.object3DOperationID = 0;
                /**
                 * 鼠标在view3D中的坐标
                 */
                this.mouseInView3D = new feng3d.Point();
                this.view3DRect = new feng3d.Rectangle(0, 0, 100, 100);
                this.inspectorViewData = new editor.InspectorViewData(this);
            }
            return Editor3DData;
        }());
        editor.Editor3DData = Editor3DData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Editor3DData.js.map