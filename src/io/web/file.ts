module feng3d.web
{
    export var file = {
        stat: stat,
        readdir: readdir,
        writeFile: writeFile,
        readFile: readFile,
        remove: remove,
        mkdir: mkdir,
        rename: rename,
        move: move,
    };

    export type FileInfo = feng3d.editor.FileInfo;

    function stat(path: string, callback: (err: { message: string }, stats: { birthtime: number, mtime: number, isDirectory: boolean, size: number }) => void): void
    {
        client.callServer("file", "stat", [path], callback);
    }

    function detailStat(path: string, depth: number, callback: (err: { message: string }, fileInfo: FileInfo) => void): void
    {
        client.callServer("file", "detailStat", [path, depth], callback);
    }

    function readdir(path: string, callback: (err: { message: string }, files: string[]) => void): void
    {
        client.callServer("file", "readdir", [path], callback);
    }

    function writeFile(path: string, data: string, callback: (err: { message: string }) => void)
    {
        client.callServer("file", "writeFile", [path, data], callback);
    }

    function readFile(path: string, callback: (err: { message: string }, data: string) => void)
    {
        client.callServer("file", "readFile", [path], callback);
    }

    function remove(path: string, callback: (err: { message: string }) => void)
    {
        client.callServer("file", "remove", [path], callback);
    }

    function mkdir(path: string, callback: (err: { message: string }) => void)
    {
        client.callServer("file", "mkdir", [path], callback);
    }

    function rename(oldPath: string, newPath: string, callback: (err: { message: string }) => void)
    {
        client.callServer("file", "rename", [oldPath, newPath], callback);
    }

    function move(src: string, dest: string, callback: (err: { message: string }) => void)
    {
        client.callServer("file", "move", [src, dest], callback);
    }
}