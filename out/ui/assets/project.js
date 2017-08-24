var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.project = {
            init: init,
        };
        function init(path, callback) {
            editor.client.callServer("project", "init", [path], callback);
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=project.js.map