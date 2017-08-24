declare namespace feng3d.editor {
    var project: {
        init: (path: string, callback: (err: {
            message: string;
        }, fileInfo: FileInfo) => void) => void;
    };
}
