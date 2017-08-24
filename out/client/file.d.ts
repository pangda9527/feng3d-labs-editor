declare namespace feng3d.editor {
    var file: {
        stat: (path: string, callback: (err: {
            message: string;
        }, stats: {
            birthtime: number;
            mtime: number;
            isDirectory: boolean;
            size: number;
        }) => void) => void;
        readdir: (path: string, callback: (err: {
            message: string;
        }, files: string[]) => void) => void;
        writeFile: (path: string, data: string, callback: (err: {
            message: string;
        }) => void) => void;
        readFile: (path: string, callback: (err: {
            message: string;
        }, data: string) => void) => void;
        remove: (path: string, callback: (err: {
            message: string;
        }) => void) => void;
        mkdir: (path: string, callback: (err: {
            message: string;
        }) => void) => void;
        rename: (oldPath: string, newPath: string, callback: (err: {
            message: string;
        }) => void) => void;
        move: (src: string, dest: string, callback: (err: {
            message: string;
        }) => void) => void;
    };
    type FileInfo = {
        path: string;
        birthtime: number;
        mtime: number;
        isDirectory: boolean;
        size: number;
        children?: FileInfo[];
    };
}
