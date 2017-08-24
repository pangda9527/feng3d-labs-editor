var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.file = {
            stat: stat,
            readdir: readdir,
            writeFile: writeFile,
            readFile: readFile,
            remove: remove,
            mkdir: mkdir,
            rename: rename,
            move: move,
        };
        function stat(path, callback) {
            editor.client.callServer("file", "stat", [path], callback);
        }
        function detailStat(path, depth, callback) {
            editor.client.callServer("file", "detailStat", [path, depth], callback);
        }
        function readdir(path, callback) {
            editor.client.callServer("file", "readdir", [path], callback);
        }
        function writeFile(path, data, callback) {
            editor.client.callServer("file", "writeFile", [path, data], callback);
        }
        function readFile(path, callback) {
            editor.client.callServer("file", "readFile", [path], callback);
        }
        function remove(path, callback) {
            editor.client.callServer("file", "remove", [path], callback);
        }
        function mkdir(path, callback) {
            editor.client.callServer("file", "mkdir", [path], callback);
        }
        function rename(oldPath, newPath, callback) {
            editor.client.callServer("file", "rename", [oldPath, newPath], callback);
        }
        function move(src, dest, callback) {
            editor.client.callServer("file", "move", [src, dest], callback);
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=file.js.map